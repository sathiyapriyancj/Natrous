const crypto = require('crypto');

const resetToken = crypto.randomBytes(64).toString('hex');
console.log('Generated reset token:', resetToken);
