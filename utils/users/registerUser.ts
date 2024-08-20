import { IUser, User } from "@/models";
import bcrypt from 'bcrypt';

async function registerUser(userData: IUser): Promise<IUser> {
  try {
    const { password, ...userDataWithoutPassword } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...userDataWithoutPassword,
      password: hashedPassword, 
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error();
  }
}

export default registerUser;

