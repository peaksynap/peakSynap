import { IUser, User } from "@/models";
import bcrypt from 'bcrypt';

async function registerUser(userData: IUser): Promise<IUser> {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

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
    throw new Error('Error registering user');
  }
}

export default registerUser;


