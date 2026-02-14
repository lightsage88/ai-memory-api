import crypto from 'crypto';
import BaseService from '../services/base-service.js';

class PromptImageUtilities extends BaseService {
  constructor(stash, log, db) {
    super(stash, log, db);
  }

  normalize(prompt) {
    return prompt.trim().toLowerCase();
  }

  hash(prompt) {
    return crypto
      .createHash('sha256')
      .update(prompt)
      .digest('hex');
  }

  async findByPrompt(promptText) {
    const normalized = this.normalize(promptText);
    const hash = this.hash(normalized);

    const [rows] = await this.db.query(
      'SELECT image_url FROM prompt_images WHERE prompt_hash = ?',
      [hash]
    );

    if (rows.length > 0) {
      return { imageUrl: rows[0].image_url, cacheHit: true };
    }

    return { cacheHit: false, normalized, hash };
  }

  async save(promptText, imageUrl, hashOverride = null) {
    const normalized = this.normalize(promptText);
    const hash = hashOverride || this.hash(normalized);

    await this.db.query(
      `INSERT INTO prompt_images (prompt_text, prompt_hash, image_url)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)`,
      [normalized, hash, imageUrl]
    );
  }
}

export default PromptImageUtilities;