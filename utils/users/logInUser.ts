import { IUser, User } from "@/models";
import bcrypt from "bcrypt";

interface Body {
  email: string;
  password: string;
}

async function loginUser(body: Body): Promise<Omit<IUser, 'password'> | null> {
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

    user.password = ""
    return user;
  } catch (error) {
    console.error("Error logging in:", error || error);
    throw new Error("Failed to login");
  }
}

export default loginUser;

