import fs from "fs";
import jsonWebToken, { JwtPayload } from "jsonwebtoken";
import path from "path";

const pathToPrvKey = path.join(__dirname, "../../secrets/keys/id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "../../secrets/keys/id_rsa_pub.pem");

const PRIV_KEY = fs.readFileSync(pathToPrvKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

export const jwtUtils = {
  /**
   * Create a JWT (json web token) for a successfully authenticated user.
   *
   * @param {object} sub - user or participant doc from db
   * @return {object} object containing new JWT (token) and expires date
   */
  issueJWT(sub: { id: number }): { token: string; expiresIn: string } {
    const id = sub.id;

    const expiresIn = "1d";

    const payload = {
      sub: id, // sub property of jwt (subject) identified who it is for
      iat: Date.now(), // iat issued at identified when token was issued
    };

    const signedToken = jsonWebToken.sign(payload, PRIV_KEY, {
      algorithm: "RS256",
    });

    // Bearer is the name of the JWT auth strategy
    return {
      token: "Bearer " + signedToken,
      expiresIn,
    };
  },

  /**
   * Verify that an authorization header is JWT and is valid.
   *
   * @param {string} authorization - request authorization header
   * @return decrypted jwt
   * @throws {Error} if invalid or expired token
   */
  verifyJWT(authorization: string): JwtPayload {
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new Error("unauthorized");
    }

    if (!token.match(/\S*\.\S*\.\S*/)) {
      throw new Error("unauthorized");
    }

    const decrypted: JwtPayload = jsonWebToken.verify(token, PUB_KEY, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    const oneDayMs = 1e3 * 24 * 60 * 60;

    if (decrypted.iat + oneDayMs <= Date.now()) {
      throw new Error("unauthorized");
    }

    return decrypted;
  },
};
