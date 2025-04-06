import { commentDelete, getCommentsList, newComment, updateComment } from "@/controllers";
import { authenticateToken } from "@/middleware/auth";
import { IComment } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {error: string} |  IComment 

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    switch (req.method) {
        case 'POST':
            return newComment(req, res);
        case 'PUT':
            return updateComment(req, res);
        case 'DELETE':
            return commentDelete(req, res);
        case 'GET':
            return getCommentsList(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)