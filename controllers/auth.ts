import { db } from "@/dataBase";
import { forgotPassword, loginUser, resetPassword } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";


export const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  try {
    await db.connect();
    await forgotPassword(email);
     await db.disconnect();
    res.status(200).json("Send email success");
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't send email");
  }
};

export const changePassword = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { passwordToken, password } = req.body;
  try {
    await db.connect();
    await resetPassword(passwordToken, password);
    await db.disconnect();
    res.status(200).json("Password reset success");
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't reset password");
  }
};

export const login = async(req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;
    try {
        await db.connect();
        const user = await loginUser(body);
        await db.disconnect();
        res.status(200).json(user);
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Can't login");
    }
};
