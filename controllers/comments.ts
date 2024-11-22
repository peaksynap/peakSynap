import { db } from "@/dataBase";
import { IComment } from "@/models";
import { createComment, deleteComment, editComment, listComments } from "@/utils";

import { NextApiRequest, NextApiResponse } from "next";

export const newComment = async(req: NextApiRequest, res: NextApiResponse) => {
    const {body} = req

    try {
        await db.connect();
        await createComment(body)
        await db.disconnect();
        res.status(200).json('Comment created successfully')

    } catch (error) {
        db.disconnect();
        res.status(500).json('Error creating comment')
    }

}

export const updateComment = async(req: NextApiRequest, res: NextApiResponse) => {
    const updatedData: Partial<IComment> = req.body;
    try {

        await db.connect();
        await editComment(updatedData);
        await db.disconnect();
        res.status(200).json('Comment edited successfully')

    } catch (error) {
        await db.disconnect();
        res.status(500).json('Error editing comment')
    }
}

export const commentDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    const {commentId, userId} = req.body
    try {
        await db.connect();
        await deleteComment(commentId, userId);
        await db.disconnect();
        res.status(200).json('Comment deleted successfully')

    } catch (error) {
        await db.disconnect();
        res.status(500).json('Error deleting comment')
    }
}

export const  getCommentsList = async (req: NextApiRequest, res: NextApiResponse) => {

    const {publicationId, page, limit} = req.body;

    try {
        await db.connect();
        const data = await listComments(publicationId, page, limit);
        await db.disconnect();
        res.status(200).json(data);
    } catch (error) {
        await db.disconnect();
        res.status(500).json('Error getting comments')
    }
}