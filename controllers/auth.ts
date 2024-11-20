import { db } from "@/dataBase";
import { forgotPassword, loginUser, resetPassword, runMiddleware } from "@/utils";
import cors from "@/utils/cors";
import { NextApiRequest, NextApiResponse } from "next";

export const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  try {
    db.connect();
    await runMiddleware(req, res, cors);
    await forgotPassword(email);
    db.disconnect();
    res.status(200).json("Send email success");
  } catch (error) {
    db.disconnect();
    res.status(500).json("can't send email");
  }
};

export const changePassword = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { passwordToken, password } = req.body;
  try {
    db.connect();
    await runMiddleware(req, res, cors);
    await resetPassword(passwordToken, password);
    db.disconnect;
    res.status(200).json("password reset success");
  } catch (error) {
    db.disconnect();
    res.status(500).json("can't reset password");
  }
};

export const login = async(req: NextApiRequest, res: NextApiResponse) => {
    const {body} = req
    try {
        db.connect();
        await runMiddleware(req, res, cors);
        const user = await loginUser(body)
        db.disconnect();
        res.status(200).json(user)
    } catch (error) {
        db.disconnect();
        res.status(500).json("can't login");
    }
}
