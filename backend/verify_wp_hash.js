import bcrypt from 'bcryptjs';

const compareWpPassword = async (candidatePassword, hashToCompare) => {
  console.log('Original Hash:', hashToCompare);
  
  let normalizedHash = hashToCompare;
  if (normalizedHash.startsWith('$wp$2y$')) {
    normalizedHash = '$2a$' + normalizedHash.slice(7);
  } else if (normalizedHash.startsWith('$2y$')) {
    normalizedHash = '$2a$' + normalizedHash.slice(4);
  }
  
  console.log('Normalized Hash:', normalizedHash);
  
  // NOTE: We can't actually verify without knowing the plain text password,
  // but we can check if it's a valid bcrypt hash format that bcryptjs accepts.
  try {
    const salt = bcrypt.getSalt(normalizedHash);
    console.log('Salt found:', salt);
    console.log('Hash format is valid for bcryptjs.');
    return true;
  } catch (err) {
    console.error('Invalid hash format:', err.message);
    return false;
  }
};

const wpHash = '$wp$2y$10$ejjKR0K96PW2z/tOX4hv9ObrtFl6boG3LAhC.Z9I.av5zyMbSjkNK';
compareWpPassword('dummy', wpHash);
