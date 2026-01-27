import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Source Database (Contest-main)
const SOURCE_DB = 'mongodb+srv://database_creators:GjSWaV7mJnOy5hJw@cluster0.lwyhn.mongodb.net/contest?retryWrites=true&w=majority';

// Target Database (Tree Campus)
const TARGET_DB = process.env.MONGODB_URI || 'mongodb+srv://vishaldgtldb:Ram%40123@cluster0.llotsdg.mongodb.net/TreeCampus?retryWrites=true&w=majority&appName=Cluster0';

// Create separate mongoose connections
const sourceConn = mongoose.createConnection(SOURCE_DB);
const targetConn = mongoose.createConnection(TARGET_DB);

// Define schemas for Contest-main database
const OldExamSchema = new mongoose.Schema({}, { strict: false });
const OldCouponSchema = new mongoose.Schema({}, { strict: false });

// Define schemas for Tree Campus database
const NewExamSchema = new mongoose.Schema({}, { strict: false });
const NewCouponSchema = new mongoose.Schema({}, { strict: false });

// Models
let OldExam, OldCoupon, NewExam, NewCoupon;

async function migrateData() {
  try {
    console.log('🔄 Starting migration...');
    console.log('📍 Source DB:', SOURCE_DB.split('@')[1].split('/')[0]);
    console.log('📍 Target DB:', TARGET_DB.split('@')[1].split('/')[0]);

    // Wait for connections
    await new Promise((resolve) => {
      sourceConn.once('open', () => {
        console.log('✅ Connected to source database (Contest-main)');
        resolve();
      });
    });

    await new Promise((resolve) => {
      targetConn.once('open', () => {
        console.log('✅ Connected to target database (TreeCampus)');
        resolve();
      });
    });

    // Initialize models after connections are established
    OldExam = sourceConn.model('Exam', OldExamSchema);
    OldCoupon = sourceConn.model('Coupon', OldCouponSchema);
    NewExam = targetConn.model('ContestExam', NewExamSchema);
    NewCoupon = targetConn.model('ContestCoupon', NewCouponSchema);

    // Migrate Exams
    console.log('\n📚 Migrating Exams...');
    const oldExams = await OldExam.find({});
    console.log(`   Found ${oldExams.length} exams in source database`);

    if (oldExams.length > 0) {
      const newExams = oldExams.map(exam => {
        const examObj = exam.toObject();
        delete examObj._id; // Let MongoDB generate new IDs
        return examObj;
      });

      const insertedExams = await NewExam.insertMany(newExams);
      console.log(`   ✅ Migrated ${insertedExams.length} exams`);
    } else {
      console.log('   ℹ️ No exams to migrate');
    }

    // Migrate Coupons
    console.log('\n🎟️  Migrating Coupons...');
    const oldCoupons = await OldCoupon.find({});
    console.log(`   Found ${oldCoupons.length} coupons in source database`);

    if (oldCoupons.length > 0) {
      const newCoupons = oldCoupons.map(coupon => {
        const couponObj = coupon.toObject();
        delete couponObj._id; // Let MongoDB generate new IDs
        return couponObj;
      });

      const insertedCoupons = await NewCoupon.insertMany(newCoupons);
      console.log(`   ✅ Migrated ${insertedCoupons.length} coupons`);
    } else {
      console.log('   ℹ️ No coupons to migrate');
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Exams migrated: ${oldExams.length}`);
    console.log(`   - Coupons migrated: ${oldCoupons.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close connections
    await sourceConn.close();
    await targetConn.close();
    console.log('\n🔌 Database connections closed');
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
