import { db } from "@/dataBase";
import { forgotPassword, loginUser, resetPassword } from "@/utils";
import cors, { runMiddleware } from "@/utils/cors";
import { NextApiRequest, NextApiResponse } from "next";

const handleCors = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
};

export const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  try {
    db.connect();
    await handleCors(req, res); 
    await forgotPassword(email);
    db.disconnect();
    res.status(200).json("Send email success");
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't send email");
  }
};

export const changePassword = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { passwordToken, password } = req.body;
  try {
    db.connect();
    await handleCors(req, res); 
    await resetPassword(passwordToken, password);
    db.disconnect();
    res.status(200).json("Password reset success");
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't reset password");
  }
};

export const login = async(req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;
    try {
        db.connect();
        await handleCors(req, res); 
        const user = await loginUser(body);
        db.disconnect();
        res.status(200).json(user);
    } catch (error) {
        db.disconnect();
        res.status(500).json("Can't login");
    }
};

