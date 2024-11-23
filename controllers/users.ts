import { db } from "@/dataBase";
import { IUser } from "@/models";
import {
  editUser,
  followUser,
  getUser,
  getUserFollowers,
  getUserFollowings,
  listGroupUsers,
  registerUser,
  unfollowUser,
} from "@/utils";
import searchUser from "@/utils/users/searchUser";
import { NextApiRequest, NextApiResponse } from "next";

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    const user: IUser = req.body;
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
    await unfollowUser(req, res);
    await db.disconnect();
    res.status(200).json("Unfollow user");
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Can't unfollow user");
  }
};

export const userGroups = async(req: NextApiRequest, res: NextApiResponse) => {
  const {userId, page, limit} = req.query
  try {
    await db.connect();
    const groups = await listGroupUsers(`${userId}`, Number(page), Number(limit))
    await db.disconnect();
    res.status(200).json(groups)
  } catch (error) {
    await db.disconnect();
    res.status(500).json("can't get user groups")
  }
}


export const userFollowes = async(req: NextApiRequest, res: NextApiResponse) => {
  const {userId, page, limit} = req.query
  try {
    await db.connect();
    const followes = await getUserFollowers(`${userId}`, Number(page), Number(limit))
    await db.disconnect();
    res.status(200).json(followes)
  } catch (error) {
    db.disconnect();
    res.status(500).json("can't get user followers")
  }
}

export const userFollowings = async(req: NextApiRequest, res: NextApiResponse) => {
  const {userId, page,limit} = req.query;
  console.log(`User ${userId}`);

  try {
    await db.connect();
    const followings = await getUserFollowings(`${userId}`, Number(page), Number(limit))
    await db.disconnect();
    res.status(200).json(followings)
  } catch (error) {
    await db.disconnect();
    res.status(500).json("can't get user followings")
  }
}