import { User } from "@/models";
import { transporter } from "..";
import crypto from 'crypto'

const forgotPassword = async(email: string) => {
    try {
        const token = crypto.randomBytes(20).toString('hex');
    
        const user = await User.findOne({ email });
    
        if (!user) {
          throw new Error('Can´t send email');
        }
    
        user.passwordToken = token;
        await user.save();
    
        const resetUrl = `${process.env.CHANGEPASS_URL}${token}`;
    
        const mailOptions = {
          from: 'tu_correo@gmail.com',
          to: email,
          subject: 'Recuperación de contraseña',
          text: `Hola,\n\nPuedes restablecer tu contraseña haciendo clic en el siguiente enlace:\n\n${resetUrl}`
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return true;
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error()
      }
}

export default forgotPassword