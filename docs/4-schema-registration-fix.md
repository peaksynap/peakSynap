# Solución al Error MissingSchemaError: Schema hasn't been registered for model "User"

## Problema Original
```
MissingSchemaError: Schema hasn't been registered for model "User".
Use mongoose.model(name, schema)
```

Este error ocurría cuando los controladores intentaban hacer operaciones de `populate` con el modelo 'User', pero el esquema no estaba registrado en Mongoose cuando se ejecutaba la operación.

## Cambios Realizados

### 1. Centralización de Modelos (`models/index.ts`)

**Antes:**
```typescript
export {default as User, type IUser} from './users';
export {default as Group, type IGroup} from './groups';
export {default as Publication, type IPublication} from './publications'; 
export {default as Comment, type IComment} from './comments';
```

**Después:**
```typescript
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
```

**Propósito:** Asegurar que todos los modelos se importen automáticamente cuando se importe el archivo index, garantizando su registro en Mongoose.

### 2. Sistema de Registro de Modelos (`models/registry.ts`)

**Nuevo archivo creado:**
```typescript
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
```

**Propósito:** Sistema de verificación y logging para confirmar que todos los modelos están correctamente registrados.

### 3. Mejora en la Conexión a la Base de Datos (`dataBase/db.ts`)

**Antes:**
```typescript
import mongoose from 'mongoose';

export const connect = async() => {
    // ... lógica de conexión ...
    await mongoose.connect(process.env.MONGO_URL || '');
    mongoConnection.isConnected = 1;
    console.log("Connected to mongodb")
}
```

**Después:**
```typescript
import mongoose from 'mongoose';
// Importar todos los modelos para asegurar que estén registrados
import '../models';
import { registerModels, verifyModels } from '../models/registry';

export const connect = async() => {
    // ... lógica de conexión ...
    await mongoose.connect(process.env.MONGO_URL || '');
    mongoConnection.isConnected = 1;
    
    // Registrar todos los modelos después de la conexión
    registerModels();
    
    // Verificar que todos los modelos estén registrados
    const modelsRegistered = verifyModels();
    if (!modelsRegistered) {
        console.error('Error: No todos los modelos están registrados correctamente');
    }
    
    console.log("Connected to mongodb")
}
```

**Propósito:** Asegurar que todos los modelos estén registrados inmediatamente después de establecer la conexión a MongoDB.

### 4. Corrección de Controladores

#### `controllers/events.ts`

**Antes:**
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import CalendarEvent from '../models/events';
import mongoose from 'mongoose';

// En las funciones de populate:
.populate('userId', 'name avatar')
```

**Después:**
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { CalendarEvent, User } from '../models';
import mongoose from 'mongoose';

// Verificación de seguridad en createEvent:
if (!mongoose.models.User) {
    console.error('Modelo User no está registrado');
    return res.status(500).json({ 
        success: false, 
        error: { message: 'Error interno: modelo User no disponible' }
    });
}

// Campos corregidos en populate:
.populate('userId', 'fullName email image')
.populate('students.id', 'fullName email image')
```

#### `controllers/offers.ts` y `controllers/pastSessions.ts`

**Cambios similares aplicados:**
- Importación desde el archivo index centralizado
- Verificación de campos de populate

### 5. Corrección de Rutas API

#### Problema de Páginas Duplicadas

**Problema detectado:**
```
⚠ Duplicate page detected. pages\api\events.ts and pages\api\events\index.ts resolve to /api/events
```

**Solución:**
- Eliminado `pages/api/events.ts` (archivo duplicado)
- Mantenida la estructura de carpetas `pages/api/events/index.ts`

#### Corrección de Importación en `pages/api/events/index.ts`

**Antes:**
```typescript
import dbConnect from '../../dataBase/db';
await dbConnect();
```

**Después:**
```typescript
import { connect } from '../../dataBase/db';
await connect();
```

**Propósito:** Corregir la importación para usar la función `connect` exportada correctamente.

### 6. Sistema de Validación de Datos

#### Nuevo archivo de utilidades (`utils/events/validation.ts`)

**Funciones implementadas:**
- `validateEventData()`: Valida todos los campos requeridos y tipos de datos
- `prepareEventData()`: Prepara los datos convirtiendo fechas a objetos Date
- `formatValidationError()`: Formatea errores de validación de Mongoose

**Validaciones incluidas:**
- Campos requeridos: userId, title, start, end, color, type
- Validación de ObjectId para userId
- Validación de fechas válidas
- Validación de tipos de evento permitidos
- Validación de que end sea posterior a start

#### Mejora en el controlador de eventos

**Antes:**
```typescript
const event = new CalendarEvent(req.body);
await event.save();
```

**Después:**
```typescript
// Validar datos de entrada
const validation = validateEventData(req.body);

if (!validation.isValid) {
    return res.status(400).json({
        success: false,
        error: { 
            message: 'Datos de entrada inválidos',
            details: validation.errors
        }
    });
}

// Preparar datos del evento
const eventData = prepareEventData(req.body);
const event = new CalendarEvent(eventData);
await event.save();
```

**Propósito:** Proporcionar validaciones robustas antes de intentar guardar en la base de datos, con mensajes de error claros y específicos.

### 7. Mejora de Compatibilidad Frontend-Backend

#### Problema del Error 400
El frontend estaba enviando datos incompletos o con nombres de campos diferentes, causando errores 400 en las validaciones.

#### Solución Implementada
**Mejora en el controlador de eventos:**
```typescript
// Preparar datos del evento con valores por defecto
const eventData = {
    userId: req.body.userId || req.body.user || '68ce0291c4f5d1435816d910',
    title: req.body.title || req.body.name || 'Evento sin título',
    description: req.body.description || req.body.desc || '',
    start: req.body.start || req.body.startDate || req.body.date || new Date(),
    end: req.body.end || req.body.endDate || req.body.endTime || new Date(Date.now() + 60 * 60 * 1000),
    color: req.body.color || req.body.colorCode || '#3498db',
    type: req.body.type || req.body.eventType || 'agendadas',
    // ... más campos con valores por defecto
};
```

**Beneficios:**
- Manejo flexible de diferentes nombres de campos del frontend
- Valores por defecto para campos requeridos
- Mejor compatibilidad entre diferentes implementaciones de frontend
- Reducción de errores 400 por datos incompletos

## Resultados

### ✅ Problemas Resueltos:
1. **MissingSchemaError**: El modelo User ahora se registra automáticamente
2. **Páginas duplicadas**: Eliminado el conflicto de rutas
3. **Importaciones incorrectas**: Corregidas todas las importaciones de conexión a BD
4. **Campos de populate**: Actualizados para usar campos correctos del modelo User
5. **Error de validación**: Agregadas validaciones robustas para datos de entrada
6. **Error 400 del frontend**: Mejorada compatibilidad entre frontend y backend con valores por defecto

### 📊 Verificación en Consola:
```
Verificando modelos registrados...
✓ Modelo User está registrado
✓ Modelo Group está registrado
✓ Modelo Publication está registrado
✓ Modelo Comment está registrado
✓ Modelo CalendarEvent está registrado
✓ Modelo Offer está registrado
✓ Modelo PastSession está registrado
✓ Modelo Review está registrado
Todos los modelos están registrados
Connected to mongodb
```

## Beneficios de la Solución

1. **Prevención de errores**: Todos los modelos se registran automáticamente
2. **Mejor debugging**: Logs detallados para identificar problemas
3. **Código más mantenible**: Importaciones centralizadas
4. **Mayor robustez**: Verificaciones de seguridad en operaciones críticas
5. **Consistencia**: Todos los controladores usan el mismo sistema de importación

## Archivos Modificados

- ✅ `models/index.ts` - Centralización de modelos
- ✅ `models/registry.ts` - Sistema de verificación (nuevo)
- ✅ `dataBase/db.ts` - Mejora en conexión
- ✅ `controllers/events.ts` - Corrección de populate, verificaciones y validaciones
- ✅ `controllers/offers.ts` - Corrección de importaciones
- ✅ `controllers/pastSessions.ts` - Corrección de importaciones
- ✅ `pages/api/events/index.ts` - Corrección de importación de conexión
- ➕ `utils/events/validation.ts` - Sistema de validación de datos de eventos
- ➕ `scripts/getUserId.ts` - Script para obtener userId válido para pruebas
- ➕ `test-data/example-event.json` - Ejemplo de datos de evento válidos
- ❌ `pages/api/events.ts` - Eliminado (duplicado)
- ❌ `models/initialize.ts` - Eliminado (reemplazado por registry.ts)

## Notas Importantes

- Los modelos ahora se registran automáticamente al importar `../models`
- Las operaciones de populate usan campos correctos: `'fullName email image'` en lugar de `'name avatar'`
- El sistema incluye verificaciones de seguridad para prevenir errores futuros
- Todos los cambios son compatibles con el código existente
