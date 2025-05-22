
// core/vaultProtector.js

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const VAULT_PATH = path.join(__dirname, '../config/vault.json');
const EXPECTED_HASH = process.env.GENESIS_HASH;

function hashVault() {
  const vaultData = fs.readFileSync(VAULT_PATH, 'utf8');
  return crypto.createHash('sha256').update(vaultData).digest('hex');
}

function verifyVaultIntegrity() {
  const currentHash = hashVault();
  if (currentHash !== EXPECTED_HASH) {
    console.error('❌ Vault integrity check failed. Genesis hash mismatch.');
    throw new Error('Vault has been tampered with. System halted.');
  } else {
    console.log('✅ Vault integrity verified.');
  }
}

module.exports = { verifyVaultIntegrity, hashVault };
