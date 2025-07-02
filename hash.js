// backend/hash.js
const bcrypt = require('bcryptjs');
async function hashPassword() {
  const hash = await bcrypt.hash('securepassword123', 10);
  console.log(hash);
}
hashPassword();