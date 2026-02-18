import bcrypt from 'bcryptjs';

const hash = '$2y$10$c211GhFRCGXHiHuo89vp3.wQnEI5wF48ejzo73F1P12w1JM1ReaHa';
const normalizedHash = hash.replace('$2y$', '$2a$');

const commonPasswords = [
    'treecampus',
    'treecampus123',
    'Tree@123',
    'TreeCampus@123',
    '123456',
    '12345678',
    'password',
    'admin',
    'admin123',
    'wordpress',
    'wp-admin',
    'TreeCampus',
    'tree@123',
    'Tree123',
    'treecampus@123',
    'Treecampus@123'
];

async function check() {
    console.log('Testing hash:', hash);
    for (const pw of commonPasswords) {
        const match = await bcrypt.compare(pw, normalizedHash);
        if (match) {
            console.log('MATCH FOUND! Password is:', pw);
            return;
        }
    }
    console.log('No matches found in common list.');
}

check();
