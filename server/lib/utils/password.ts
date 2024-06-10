import crypto from "crypto";

export const passwordUtils = {
  /**
   * Validate a password by generating a new hash with the input
   * password and the salt from the db then comparing this new hash with
   * the hash in the db.
   *
   * @param {string} password - user's password from login form
   * @param {string} hash - user's hash in db
   * @param {string} salt - hash from db
   * @return {boolean} - validation was successful
   */
  validatePassword(password: string, hash: string, salt: string): boolean {
    // generate hash with given login password and salt
    const reqHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    return reqHash === hash;
  },

  /**
   * Generate a password salt and hash.
   *
   * @param {string} password - user's new password
   * @return {Object} - object containing salt and hash
   */
  genPassword(password: string): { salt: string; hash: string }{
    // create salt (random information)
    const salt = crypto.randomBytes(32).toString("hex");

    // generate hash with new password and salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    return {
      salt,
      hash,
    };
  },
};
