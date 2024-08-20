import { db } from "@/dataBase";
import { createPublication, deletePublication, editPublication } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const newPublication = async(req: NextApiRequest, res: NextApiResponse) => {
    const {body} = req
    try {
        db.connect();
        const publication = await createPublication(body)
        db.disconnect();
        res.status(200).json(publication)
    } catch (error) {
        db.disconnect();
        res.status(500).json("Cant't create publication")
    }
}

export const refreshPublication = async (req: NextApiRequest, res: NextApiResponse) => {
    const {publicationId, newData} = req.body
    try {
        db.disconnect();
        const publication = await editPublication(publicationId, newData)
        db.disconnect();
        res.status(200).json(publication)
    } catch (error) {
        db.disconnect();
        res.status(500).json("Cant't edit publication")
    }
}

export const deleteOnePublication = async(req: NextApiRequest, res: NextApiResponse) => {
    const {publicationId} = req.query
    try {
        db.connect();
        await deletePublication(`${publicationId}`)
        db.disconnect();
        res.status(200).json('Publication was deleted successfully')
    } catch (error) {
        db.disconnect();
        res.status(500).json("Cant't delete publication")
    }
}