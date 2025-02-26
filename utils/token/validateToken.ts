import { IUser, User } from "@/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";  

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

async function refreshToken(token: string): Promise<{ user: Omit<IUser, 'password'>, token: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("User not found");
      return null;
    }

    const timeLeft = decoded.exp * 1000 - Date.now();

    if (timeLeft > 10 * 60 * 1000) {
      console.log("Token is still valid");
      return { user: user.toObject(), token };  
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return { user: userWithoutPassword, token: newToken };
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}

export default refreshToken;
