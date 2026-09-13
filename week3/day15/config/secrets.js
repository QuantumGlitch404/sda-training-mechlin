const crypto = require('crypto');

class SecretsManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';

    this.encryptionKey =
      process.env.ENCRYPTION_KEY ||
      crypto.randomBytes(32);
  }

  encrypt(text) {
    const iv =
      crypto.randomBytes(16);

    const cipher =
      crypto.createCipheriv(
        this.algorithm,
        this.encryptionKey,
        iv
      );

    cipher.setAAD(
      Buffer.from(
        'sda-training',
        'utf8'
      )
    );

    const encrypted = Buffer.concat([
      cipher.update(
        text,
        'utf8'
      ),
      cipher.final()
    ]);

    const authTag =
      cipher.getAuthTag();

    return {
      encrypted:
        encrypted.toString('hex'),

      iv:
        iv.toString('hex'),

      authTag:
        authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher =
      crypto.createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        Buffer.from(
          encryptedData.iv,
          'hex'
        )
      );

    decipher.setAAD(
      Buffer.from(
        'sda-training',
        'utf8'
      )
    );

    decipher.setAuthTag(
      Buffer.from(
        encryptedData.authTag,
        'hex'
      )
    );

    const decrypted =
      Buffer.concat([
        decipher.update(
          Buffer.from(
            encryptedData.encrypted,
            'hex'
          )
        ),
        decipher.final()
      ]);

    return decrypted.toString(
      'utf8'
    );
  }

  validateSecrets({
    strict = false
  } = {}) {
    const requiredSecrets = [
      'JWT_SECRET',
      'MONGODB_URI',
      'POSTGRES_PASSWORD',
      'REDIS_URL'
    ];

    const missingSecrets =
      requiredSecrets.filter(
        (secret) =>
          !process.env[secret]
      );

    if (
      strict &&
      missingSecrets.length > 0
    ) {
      throw new Error(
        `Missing required secrets: ${missingSecrets.join(', ')}`
      );
    }

    return {
      valid:
        missingSecrets.length === 0,

      missingSecrets
    };
  }

  getSecret(
    name,
    defaultValue = null
  ) {
    const value =
      process.env[name];

    if (
      !value &&
      defaultValue === null
    ) {
      throw new Error(
        `Secret ${name} is required but not found`
      );
    }

    return (
      value || defaultValue
    );
  }
}

module.exports =
  new SecretsManager();