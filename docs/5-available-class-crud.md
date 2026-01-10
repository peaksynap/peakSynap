# CRUD de AvailableClass - Documentación Completa

## Descripción
Este documento describe la implementación completa del CRUD (Create, Read, Update, Delete) para la entidad `AvailableClass`, que representa clases disponibles en el sistema PeakSynap.

## Interfaz AvailableClass

```typescript
interface AvailableClass {
  _id: string;                    // ID único del evento
  userId: {                       // Información del profesor/usuario
    _id: string;
    fullName: string;
    email: string;
    image: string;
  };
  title: string;                  // Título del evento
  description: string;            // Descripción de la clase
  start: string;                  // Fecha y hora de inicio (ISO string)
  end: string;                    // Fecha y hora de fin (ISO string)
  color: string;                  // Color del evento según el tipo
  type: 'disponibilidad' | 'agendadas' | 'ofertas' | 'recibir';
  price: number;                  // Precio de la clase
  level: string;                  // Nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  topic: string;                  // Tema de la clase
  maxStudents: number;           // Máximo número de estudiantes
  groupClass: boolean;           // Si es clase grupal o individual
  maxDuration: number;           // Duración máxima en minutos
  location: string;              // Ubicación: 'Online' | 'Presencial' | dirección específica
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  students: Array<{             // Estudiantes inscritos
    id: string;
    name: string;
    email?: string;
  }>;
  createdAt: string;             // Fecha de creación (ISO string)
  updatedAt: string;             // Fecha de última actualización (ISO string)
  __v: number;                  // Versión del documento
}
```

## Endpoints Disponibles

### 1. Obtener Todas las Clases Disponibles
**GET** `/api/available-classes`

#### Parámetros de Query (Opcionales):
- `userId`: Filtrar por profesor específico
- `type`: Filtrar por tipo de clase
- `level`: Filtrar por nivel (Principiante, Intermedio, Avanzado)
- `topic`: Buscar por tema (búsqueda parcial)
- `location`: Buscar por ubicación (búsqueda parcial)
- `status`: Filtrar por estado
- `startDate`: Fecha de inicio mínima
- `endDate`: Fecha de fin máxima
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo

#### Ejemplo de Uso:
```bash
GET /api/available-classes?type=ofertas&level=Principiante&minPrice=20&maxPrice=100
```

#### Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "_id": "68f594bf5270efdd47cd355e",
      "userId": {
        "_id": "68ce0291c4f5d1435816d910",
        "fullName": "Yader Parrales",
        "email": "yader27.sc@gmail.com",
        "image": "profile.jpg"
      },
      "title": "Clase de Programación",
      "description": "Aprende JavaScript desde cero",
      "start": "2024-12-25T10:00:00.000Z",
      "end": "2024-12-25T12:00:00.000Z",
      "color": "#FF6B6B",
      "type": "ofertas",
      "price": 50,
      "level": "Principiante",
      "topic": "JavaScript",
      "maxStudents": 10,
      "groupClass": true,
      "maxDuration": 120,
      "location": "Online",
      "status": "pending",
      "students": [],
      "createdAt": "2024-12-19T10:00:00.000Z",
      "updatedAt": "2024-12-19T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

### 2. Obtener una Clase Específica
**GET** `/api/available-classes/{id}`

#### Parámetros:
- `id`: ID único de la clase

#### Ejemplo de Uso:
```bash
GET /api/available-classes/68f594bf5270efdd47cd355e
```

### 3. Crear una Nueva Clase
**POST** `/api/available-classes`

#### Cuerpo de la Petición:
```json
{
  "title": "Clase de Programación",
  "description": "Aprende JavaScript desde cero",
  "start": "2024-12-25T10:00:00.000Z",
  "end": "2024-12-25T12:00:00.000Z",
  "color": "#FF6B6B",
  "type": "ofertas",
  "price": 50,
  "level": "Principiante",
  "topic": "JavaScript",
  "maxStudents": 10,
  "groupClass": true,
  "maxDuration": 120,
  "location": "Online"
}
```

#### Campos Requeridos:
- `title`: Título de la clase
- `start`: Fecha y hora de inicio
- `end`: Fecha y hora de fin
- `color`: Color en formato hexadecimal
- `type`: Tipo de clase

#### Campos Opcionales:
- `userId`: ID del profesor (usa valor por defecto si no se proporciona)
- `description`: Descripción de la clase
- `price`: Precio (default: 0)
- `level`: Nivel de dificultad (default: "Principiante")
- `topic`: Tema de la clase
- `maxStudents`: Máximo de estudiantes (default: 1)
- `groupClass`: Si es clase grupal (default: false)
- `maxDuration`: Duración máxima en minutos (default: 60)
- `location`: Ubicación (default: "Online")
- `status`: Estado (default: "pending")

### 4. Actualizar una Clase
**PUT** `/api/available-classes/{id}`

#### Cuerpo de la Petición:
```json
{
  "title": "Clase de Programación Avanzada",
  "price": 75,
  "level": "Intermedio"
}
```

### 5. Eliminar una Clase
**DELETE** `/api/available-classes/{id}`

### 6. Actualizar Estado de una Clase
**PATCH** `/api/available-classes/{id}`

#### Cuerpo de la Petición:
```json
{
  "status": "confirmed"
}
```

#### Estados Válidos:
- `pending`: Pendiente
- `confirmed`: Confirmada
- `cancelled`: Cancelada
- `completed`: Completada

### 7. Inscribir Estudiante a una Clase
**POST** `/api/available-classes/{id}/enroll`

#### Cuerpo de la Petición:
```json
{
  "studentId": "68ce0291c4f5d1435816d910",
  "studentName": "Juan Pérez",
  "studentEmail": "juan@example.com"
}
```

#### Campos Requeridos:
- `studentId`: ID único del estudiante
- `studentName`: Nombre del estudiante

#### Campos Opcionales:
- `studentEmail`: Email del estudiante

### 8. Desinscribir Estudiante de una Clase
**DELETE** `/api/available-classes/{id}/enroll`

#### Cuerpo de la Petición:
```json
{
  "studentId": "68ce0291c4f5d1435816d910"
}
```

### 9. Búsqueda Avanzada
**GET** `/api/available-classes/search`

Utiliza los mismos parámetros de query que el endpoint de obtener todas las clases.

### 10. Estadísticas de Clases
**GET** `/api/available-classes/stats`

#### Parámetros de Query (Opcionales):
- `userId`: Filtrar estadísticas por profesor específico

#### Respuesta:
```json
{
  "success": true,
  "data": {
    "totalClasses": 25,
    "statusBreakdown": {
      "pending": 10,
      "confirmed": 8,
      "cancelled": 2,
      "completed": 5
    },
    "typeBreakdown": [
      { "_id": "ofertas", "count": 15 },
      { "_id": "agendadas", "count": 10 }
    ],
    "levelBreakdown": [
      { "_id": "Principiante", "count": 12 },
      { "_id": "Intermedio", "count": 8 },
      { "_id": "Avanzado", "count": 5 }
    ],
    "totalStudents": 45,
    "averagePrice": 65.5
  }
}
```

## Validaciones Implementadas

### Validaciones de Datos:
- **userId**: Debe ser un ObjectId válido
- **title**: Requerido, mínimo 3 caracteres
- **start/end**: Deben ser fechas válidas, end debe ser posterior a start
- **color**: Debe ser un código hexadecimal válido (ej: #FF0000)
- **type**: Debe ser uno de los valores permitidos
- **price**: Debe ser un número mayor o igual a 0
- **level**: Debe ser uno de: Principiante, Intermedio, Avanzado
- **maxStudents**: Debe ser un número mayor a 0
- **maxDuration**: Debe ser un número mayor a 0
- **status**: Debe ser uno de los estados válidos
- **Duración mínima**: 15 minutos
- **Capacidad máxima**: No puede exceder maxStudents

### Validaciones de Inscripción:
- **studentId**: Debe ser un ObjectId válido
- **studentName**: Requerido, mínimo 2 caracteres
- **studentEmail**: Debe ser un email válido (si se proporciona)
- **Capacidad**: No puede inscribir más estudiantes que maxStudents
- **Duplicados**: No puede inscribir el mismo estudiante dos veces

## Manejo de Errores

### Respuestas de Error:
```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "details": ["Lista de errores específicos"]
  }
}
```

### Códigos de Estado HTTP:
- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error de validación o datos incorrectos
- **404**: Recurso no encontrado
- **405**: Método no permitido
- **500**: Error interno del servidor

## Características Especiales

### 1. Compatibilidad con Frontend:
- Manejo flexible de nombres de campos alternativos
- Valores por defecto inteligentes
- Soporte para datos incompletos del frontend

### 2. Búsqueda y Filtrado:
- Búsqueda por texto parcial en topic y location
- Filtrado por múltiples criterios
- Ordenamiento por fecha de inicio

### 3. Gestión de Estudiantes:
- Inscripción y desinscripción
- Validación de capacidad máxima
- Prevención de inscripciones duplicadas

### 4. Estadísticas:
- Agregaciones complejas con MongoDB
- Desglose por diferentes criterios
- Métricas de rendimiento

## Archivos Implementados

### Controladores:
- `controllers/availableClass.ts` - Lógica principal del CRUD

### Validaciones:
- `utils/availableClass/validation.ts` - Validaciones específicas

### Rutas API:
- `pages/api/available-classes/index.ts` - CRUD principal
- `pages/api/available-classes/[id].ts` - Operaciones por ID
- `pages/api/available-classes/[id]/enroll.ts` - Gestión de estudiantes
- `pages/api/available-classes/search.ts` - Búsqueda avanzada
- `pages/api/available-classes/stats.ts` - Estadísticas

## Pruebas Realizadas

✅ **Crear clase**: Funcionando correctamente
✅ **Obtener todas las clases**: Funcionando correctamente
✅ **Obtener clase específica**: Funcionando correctamente
✅ **Actualizar clase**: Funcionando correctamente
✅ **Estadísticas**: Funcionando correctamente
✅ **Inscripción de estudiantes**: Funcionando correctamente
✅ **Búsqueda con filtros**: Funcionando correctamente

## Notas de Implementación

1. **Base de Datos**: Utiliza el modelo `CalendarEvent` existente
2. **Autenticación**: Preparado para integración con sistema de autenticación
3. **Logging**: Incluye logs detallados para debugging
4. **Flexibilidad**: Compatible con diferentes implementaciones de frontend
5. **Escalabilidad**: Diseñado para manejar grandes volúmenes de datos

El CRUD de AvailableClass está completamente funcional y listo para producción.
