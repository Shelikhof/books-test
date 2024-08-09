import { tokenPayload } from "../utils/interfaces";
import jwt from "jsonwebtoken";

class TokenService {
  generateToken<T extends {}>(payload: T, key: string, expiresIn: string): string {
    const token = jwt.sign(payload, key, { expiresIn });
    return token;
  }

  validateToken<T>(token: string, key: string): T | null {
    try {
      const data = jwt.verify(token, key) as T;
      return data;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
