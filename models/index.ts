// Importar todos los modelos para asegurar que estén registrados
import './users';
import './groups';
import './publications';
import './comments';
import './events';
import './offers';
import './pastSessions';
import './reviews';

// Exportar los modelos y tipos
export {default as User, type IUser} from './users';
export {default as Group, type IGroup} from './groups';
export {default as Publication, type IPublication} from './publications'; 
export {default as Comment, type IComment} from './comments';
export {default as CalendarEvent, type ICalendarEvent} from './events';
export {default as Offer, type IOffer} from './offers';
export {default as PastSession, type IPastSession} from './pastSessions';
export {default as Review, type IReview} from './reviews';