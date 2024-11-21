import { db } from "@/dataBase";
import { IUser } from "@/models";
import {
  editUser,
  followUser,
  getUser,
  registerUser,
  runMiddleware,
  unfollowUser,
} from "@/utils";
import cors from "@/utils/cors";
import searchUser from "@/utils/users/searchUser";
import { NextApiRequest, NextApiResponse } from "next";

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    const user: IUser = req.body;
    await runMiddleware(req, res, cors);
    const savedUser = await registerUser(user);
    await db.disconnect();
    res.status(200).json(savedUser);
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't create user");
  }
};

export const getUserById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log(req)
  try {
    await db.connect();
    await runMiddleware(req, res, cors);
    const user = await getUser(req, res);
    console.log(req)
    await db.disconnect();
    res.status(200).json(user);
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't get user");
  }
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    await runMiddleware(req, res, cors);
    const user = await editUser(req, res);
    await db.disconnect();
    res.status(200).json(user);
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't edit user");
  }
};

export const findUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    await runMiddleware(req, res, cors);
    const users = await searchUser(req, res);
    await db.disconnect();
    res.status(200).json(users);
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't find users");
  }
};

export const follow = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    await runMiddleware(req, res, cors);
    await followUser(req, res);
    await db.disconnect();
    res.status(200).json("Fallow user");
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't follow user");
  }
};

export const unfollow = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    await runMiddleware(req, res, cors);
    await unfollowUser(req, res);
    await db.disconnect();
    res.status(200).json("Unfollow user");
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't unfollow user");
  }
};
