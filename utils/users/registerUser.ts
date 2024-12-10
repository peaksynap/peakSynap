import { IUser, User } from "@/models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function registerUser(userData: IUser): Promise<{ user: IUser, token: string }> {
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
      image:""
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    return { user: savedUser, token }; 
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Error registering user');
  }
}

export default registerUser;

