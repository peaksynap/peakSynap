import mongoose from 'mongoose';
import User from './users';
import Group from './groups';
import Publication from './publications';
import Comment from './comments';
import CalendarEvent from './events';
import Offer from './offers';
import PastSession from './pastSessions';
import Review from './reviews';

// Registrar todos los modelos si no están ya registrados
export const registerModels = () => {
  // Los modelos ya están registrados al importarlos, solo verificamos que existan
  console.log('Verificando modelos registrados...');
  
  const models = ['User', 'Group', 'Publication', 'Comment', 'CalendarEvent', 'Offer', 'PastSession', 'Review'];
  models.forEach(modelName => {
    if (mongoose.models[modelName]) {
      console.log(`✓ Modelo ${modelName} está registrado`);
    } else {
      console.error(`✗ Modelo ${modelName} NO está registrado`);
    }
  });
};

// Verificar si todos los modelos están registrados
export const verifyModels = () => {
  const requiredModels = ['User', 'Group', 'Publication', 'Comment', 'CalendarEvent', 'Offer', 'PastSession', 'Review'];
  const missingModels = requiredModels.filter(model => !mongoose.models[model]);
  
  if (missingModels.length > 0) {
    console.error('Modelos faltantes:', missingModels);
    return false;
  }
  
  console.log('Todos los modelos están registrados');
  return true;
};
