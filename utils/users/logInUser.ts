import { IUser, User } from "@/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? '';  

interface Body {
  email: string;
  password: string;
}

async function loginUser(body: Body): Promise<{ user: Omit<IUser, 'password'>, token: string } | null> {
  const { email, password } = body;

  const user: IUser | null = await User.findOne({ email }).lean();

  if (!user) {
    console.log("User not found");
    throw new Error("Invalid credentials see the console for information");
  }

  const passwordMatch = await bcrypt.compare(password, user.password!);

  if (!passwordMatch) {
    console.log('Invalid password')
    throw new Error("Invalid credentials see the console for information");
  }

  user.password = "";

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { user, token };
}


export default loginUser;


