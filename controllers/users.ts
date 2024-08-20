import { db } from "@/dataBase";
import { IUser } from "@/models";
import {
  editUser,
  followUser,
  getUser,
  registerUser,
  unfollowUser,
} from "@/utils";
import searchUser from "@/utils/users/searchUser";
import { NextApiRequest, NextApiResponse } from "next";

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    db.connect();
    const user: IUser = req.body;
    const savedUser = await registerUser(user);
    db.disconnect();
    res.status(200).json(savedUser);
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't create user");
  }
};

export const getUserById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    db.connect();
    const user = await getUser(req, res);
    db.disconnect();
    res.status(200).json(user);
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't get user");
  }
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    db.connect();
    const user = await editUser(req, res);
    db.disconnect();
    res.status(200).json(user);
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't edit user");
  }
};

export const findUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    db.connect();
    const users = await searchUser(req, res);
    db.disconnect();
    res.status(200).json(users);
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't find users");
  }
};

export const follow = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    db.connect();
    await followUser(req, res);
    db.disconnect();
    res.status(200).json("Fallow user");
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't follow user");
  }
};

export const unfollow = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    db.connect();
    await unfollowUser(req, res);
    db.disconnect();
    res.status(200).json("Unfollow user");
  } catch (error) {
    db.disconnect();
    res.status(500).json("Can't unfollow user");
  }
};
