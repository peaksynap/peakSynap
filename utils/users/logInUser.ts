import { IUser, User } from "@/models";
import bcrypt from "bcrypt";

async function loginUser(
  email: string,
  password: string
): Promise<IUser | null> {
  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new Error();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const passwordMatch = await bcrypt.compare(hashedPassword, user.password);

    if (!passwordMatch) {
      throw new Error();
    }

    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error();
  }
}

export default loginUser;
