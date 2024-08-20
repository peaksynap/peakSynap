import { IUser, User } from "@/models";

const resetPassword = async (passwordToken: string, newPassword: string): Promise<boolean> => {
  try {
    const user: IUser | null = await User.findOne({ passwordToken });

    if (!user) {
      throw new Error('Token no válido');
    }
    user.password = newPassword;

    user.passwordToken = undefined;

    await user.save();

    return true;
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return false;
  }
};

export default resetPassword;
