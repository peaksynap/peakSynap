import { IUser, User } from "@/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Secret key for signing the JWT (should be stored in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';  // Replace with actual secret

interface Body {
  email: string;
  password: string;
}

async function loginUser(body: Body): Promise<{ user: Omit<IUser, 'password'>, token: string } | null> {
  const { email, password } = body;

  try {
    const user: IUser | null = await User.findOne({ email }).lean();

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Remove password before returning user data
    user.password = "";

    // Create JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload with user info
      JWT_SECRET, // Secret key for signing the token
      { expiresIn: "1h" } // Token expiration (1 hour)
    );

    // Return the user data without password and the JWT token
    return { user, token };
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to login");
  }
}

export default loginUser;


