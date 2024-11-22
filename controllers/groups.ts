import { db } from "@/dataBase";
import { createGroup, deleteGroup, editGroup, jointGroup, leaveGroup, searchGroup } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const newGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {body} = req
    try {
        await db.connect();
        await createGroup(body)
        await db.disconnect();
        res.status(200).json('Group created successfully')
    } catch (error) {
        res.status(500).json('Error creating group')
    }
}

export const updatedGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {groupId, userId, newData} = req.body
    try {
        await db.connect();
        const group = await editGroup(groupId, newData, userId)
        db.disconnect
        res.status(200).json(group)
    } catch (error) {
        await db.disconnect();
        res.status(500).json('Error updating group')
    }
}

export const findGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {name} = req.query
    try {
        await db.connect();
        const groups = await searchGroup(`${name}`)
        await db.disconnect();
        res.status(200).json(groups)
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Can't find group")
    }

}

export const joitPublicGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {userId, groupId} = req.body
    try {
        await db.connect();
        await jointGroup(userId, groupId)
        await db.disconnect();
        res.status(200).json('user add success to group')
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Can't add user to group")
    }
}

export const leavePublicPrivateGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {userId, groupId} = req.body;
    try {
        await db.connect();
        await leaveGroup(userId, groupId);
        await db.disconnect();
        res.status(200).json('user leave group successfully')
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Can't leave public group")
    }
}

export const deleteOneGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {groupId, userId} = req.query;
    try {
        await db.connect();
        await deleteGroup(`${groupId}`, `${userId}`)
        await db.disconnect();
        res.status(200).json("grop was deleted")
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Can't delete group")
    }
}