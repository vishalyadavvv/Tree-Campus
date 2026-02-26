import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export const getWpConnection = () => {
  if (!pool) {
    // Check if credentials exist
    if (!process.env.WP_DB_HOST || !process.env.WP_DB_USER || !process.env.WP_DB_NAME) {
      console.warn('⚠️ WordPress database credentials missing in .env');
      return null;
    }

    pool = mysql.createPool({
      host: process.env.WP_DB_HOST,
      user: process.env.WP_DB_USER,
      password: process.env.WP_DB_PASSWORD || '',
      database: process.env.WP_DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
};

/**
 * Find user by email in WordPress wp_users table
 */
export const findWpUserByEmail = async (email) => {
  const db = getWpConnection();
  if (!db) return null;

  try {
    const [rows] = await db.execute(
      'SELECT ID, user_login, user_pass, user_email, display_name FROM wp_users WHERE user_email = ?',
      [email]
    );

    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('❌ Error querying WordPress database:', error.message);
    return null;
  }
};
