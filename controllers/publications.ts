import { db } from "@/dataBase";
import { createPublication, deletePublication, editPublication, getPublicPublications } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const newPublication = async(req: NextApiRequest, res: NextApiResponse) => {
    const {body} = req
    try {
        await db.connect();
        const publication = await createPublication(body)
        await db.disconnect();
        res.status(200).json(publication)
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Cant't create publication")
    }
}

export const refreshPublication = async (req: NextApiRequest, res: NextApiResponse) => {
    const { publicationId, newData } = req.body;
  
    try {
      await db.connect(); 
      const updatedPublication = await editPublication(publicationId, newData);
      await db.disconnect();
      res.status(200).json(updatedPublication);
    } catch (error) {
      await db.disconnect();
      console.error('Error:', error);
      res.status(500).json({ error: "Can't edit publication", details: 'error' });
    }
  };
  

export const deleteOnePublication = async(req: NextApiRequest, res: NextApiResponse) => {
    const {publicationId, userId} = req.query
    try {
        await db.connect();
        await deletePublication(`${publicationId}`, `${userId}`)
        await db.disconnect();
        res.status(200).json('Publication was deleted successfully')
    } catch (error) {
        await db.disconnect();
        res.status(500).json("Cant't delete publication")
    }
}

export const listPublicPublications = async (req: NextApiRequest, res: NextApiResponse) => {
    const { page = 0, limit = 10, short, longs, simple } = req.query;
  
    try {
      const filters = {
        short: short as string | undefined,
        longs: longs as string | undefined,
        simple: simple as string | undefined
      };
      const publications = await getPublicPublications(Number(page), Number(limit), filters);
      res.status(200).json(publications);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching publications' });
    }
  };
  