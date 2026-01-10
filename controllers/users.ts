import { db } from "@/dataBase";
import { IUser, CalendarEvent, Review, User } from "@/models";
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
import mongoose from "mongoose";

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    const user: IUser = req.body;
    const savedUser = await registerUser(user);
    await db.disconnect();
    res.status(201).json(savedUser);
  } catch (error) {
    await db.disconnect();
    
    if (error instanceof Error) {
      if (error.message === "Email already in use") {
        return res.status(400).json({ error: error.message });
      }
    }

    console.error("Unexpected server error:", error);
    res.status(500).json({ error: "Internal server error see the console for information" });
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
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    await db.disconnect();
    return res.status(500).json({
      success: false,
      error: error.message || "Can't get user"
    });
  }
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    const user = await editUser(req, res);
    await db.disconnect();
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    await db.disconnect();
    return res.status(500).json({
      success: false,
      error: error.message || "Can't edit user"
    });
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

// Función para obtener perfil completo de usuario con reviews y events
export const getUserProfile = async(req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId es requerido'
    });
  }

  try {
    await db.connect();
    
    // Validar que userId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      await db.disconnect();
      return res.status(400).json({
        success: false,
        error: 'ID de usuario inválido'
      });
    }
    
    // Obtener usuario directamente desde el modelo
    const user = await User.findById(userId);
    
    if (!user) {
      await db.disconnect();
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Obtener reviews del usuario
    const reviews = await Review.find({ targetId: userId })
      .populate('reviewerId', 'fullName image')
      .populate('eventId', 'title type')
      .sort({ date: -1 })
      .limit(10)
      .lean();

    // Obtener eventos del usuario
    const events = await CalendarEvent.find({ userId })
      .sort({ start: -1 })
      .limit(20)
      .lean();

    // Transformar reviews al formato esperado
    const transformedReviews = reviews.map((review: any) => ({
      id: review._id.toString(),
      reviewerName: review.reviewerId?.fullName || 'Anónimo',
      reviewerAvatar: review.reviewerId?.image || '',
      rating: review.rating,
      comment: review.comment,
      date: review.date
    }));

    // Transformar eventos al formato esperado
    const transformedEvents = events.map((event: any) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      color: event.color,
      type: event.type,
      level: event.level,
      location: event.location,
      price: event.price,
      topic: event.topic,
      maxStudents: event.maxStudents
    }));

    // Construir perfil completo
    const profile = {
      id: user._id.toString(),
      name: user.fullName,
      avatar: user.image || '',
      coverImage: user.coverImage || '',
      description: user.description || '',
      topic: user.topic || '',
      rating: user.rating || 0,
      totalReviews: reviews.length,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      totalClasses: events.length,
      experience: user.experiences?.join(', ') || '',
      education: user.education || '',
      location: user.residence || '',
      languages: user.languages || [],
      specialties: user.specialties || user.skills || [],
      reviews: transformedReviews,
      events: transformedEvents,
      contactInfo: {
        email: user.email,
        phone: user.phone,
        website: user.website
      },
      socialMedia: {
        instagram: user.instagram,
        linkedin: user.linkedin,
        twitter: user.twitter
      },
      availability: {
        isOnline: user.isOnline || false,
        isInPerson: user.isInPerson || false,
        isHybrid: user.isHybrid || false
      },
      pricing: {
        individual: user.individualPricing || 0,
        group: user.groupPricing,
        currency: user.pricingCurrency || 'USD'
      }
    };

    await db.disconnect();
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    console.error('Error al obtener perfil completo:', error);
    await db.disconnect();
    return res.status(500).json({
      success: false,
      error: error.message || "Can't get user profile"
    });
  }
}