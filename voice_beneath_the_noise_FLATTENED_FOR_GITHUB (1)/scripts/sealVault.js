
// scripts/sealVault.js

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const VAULT_PATH = path.join(__dirname, '../config/vault.json');
const vaultData = fs.readFileSync(VAULT_PATH, 'utf8');
const vaultHash = crypto.createHash('sha256').update(vaultData).digest('hex');

console.log('✅ Vault sealed. Use this hash as your GENESIS_HASH in your .env file:');
console.log(`GENESIS_HASH=${vaultHash}`);
