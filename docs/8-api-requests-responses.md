# Guía de Requests y Responses - PeakSynap Backend

Este documento describe cómo el backend espera recibir las requests y cómo responde.

## 🔧 Configuración Base

- **Base URL**: `http://192.168.100.11:3000/api/`
- **Autenticación**: JWT Bearer token en header `Authorization`
- **Formato**: JSON
- **Content-Type**: `application/json`

---

## 📅 1. CLASES DISPONIBLES (CalendarEvent)

### 1.1 GET /available-classes

**Request:**
```bash
GET /api/available-classes?type=agendadas&startDate=2025-01-20T00:00:00.000Z&endDate=2025-01-25T23:59:59.999Z
```

**Response Success:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68f538cf7868c1b139a1d28c",
      "userId": {
        "_id": "68ce0291c4f5d1435816d910",
        "fullName": "Profesor Ejemplo",
        "email": "profesor@example.com",
        "image": ""
      },
      "title": "Clase de Matemáticas",
      "description": "Clase de álgebra básica",
      "start": "2025-01-20T10:00:00.000Z",
      "end": "2025-01-20T11:00:00.000Z",
      "color": "#E5FFE5",
      "type": "agendadas",
      "price": 25,
      "level": "Intermedio",
      "topic": "Matemáticas",
      "maxStudents": 5,
      "groupClass": true,
      "maxDuration": 60,
      "location": "Online",
      "status": "confirmed",
      "students": [],
      "createdAt": "2025-01-19T19:15:27.450Z",
      "updatedAt": "2025-01-19T19:15:27.450Z",
      "__v": 0
    }
  ]
}
```

**Response Error:**
```json
{
  "success": false,
  "data": [],
  "error": "Error message"
}
```

---

### 1.2 GET /available-classes/[id]

**Request:**
```bash
GET /api/available-classes/68f538cf7868c1b139a1d28c
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68f538cf7868c1b139a1d28c",
    "userId": { ... },
    "title": "Clase de Matemáticas",
    ...
  }
}
```

---

### 1.3 POST /available-classes

**Request:**
```json
{
  "title": "Clase de Matemáticas",
  "description": "Clase de álgebra básica para principiantes",
  "start": "2025-01-20T10:00:00.000Z",
  "end": "2025-01-20T11:00:00.000Z",
  "type": "disponibilidad",
  "price": 30,
  "level": "Principiante",
  "topic": "Matemáticas",
  "maxStudents": 8,
  "groupClass": true,
  "maxDuration": 60,
  "location": "Online",
  "userId": "68ce0291c4f5d1435816d910"
}
```

**Nota importante:** El backend **automáticamente** asigna colores según el tipo:
- `disponibilidad` → `#FFE5E5`
- `agendadas` → `#E5FFE5`
- `ofertas` → `#E5E5FF`
- `recibir` → `#FFE5FF`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68f538cf7868c1b139a1d28d",
    "color": "#FFE5E5",
    "type": "disponibilidad",
    ...
  }
}
```

---

### 1.4 PUT /available-classes/[id]

**Request:**
```json
{
  "title": "Clase de Matemáticas Avanzada",
  "price": 40,
  "level": "Avanzado",
  "maxStudents": 6
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 1.5 DELETE /available-classes/[id]

**Request:**
```bash
DELETE /api/available-classes/68f538cf7868c1b139a1d28c
```

**Response:**
```json
{
  "success": true,
  "data": null
}
```

---

### 1.6 PATCH /available-classes/[id]

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Status válidos:** `pending`, `confirmed`, `cancelled`, `completed`

---

### 1.7 POST /available-classes/[id]/enroll

**Request:**
```json
{
  "id": "student-id",
  "name": "Nombre Estudiante",
  "email": "estudiante@example.com"
}
```

**También acepta:**
```json
{
  "studentId": "student-id",
  "studentName": "Nombre Estudiante",
  "studentEmail": "estudiante@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    ...eventWithUpdatedStudents
  }
}
```

---

### 1.8 DELETE /available-classes/[id]/enroll

**Request:**
```json
{
  "studentId": "student-id"
}
```

**También acepta:**
```json
{
  "id": "student-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 💼 2. OFERTAS (Offer)

### 2.1 GET /offers/available

**Request:**
```bash
GET /api/offers/available?topics=Matemáticas&budget.min=20&budget.max=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68ffed7c58a2bc99294f016e",
      "userId": {
        "_id": "68ffea199b59bb7efb6a2f32",
        "fullName": "María García López",
        "email": "maria.garcia@example.com",
        "image": "..."
      },
      "name": "Matemáticas - María",
      "topic": "Matemáticas",
      "startDate": "2025-01-22T10:00:00.000Z",
      "endDate": "2025-01-22T11:00:00.000Z",
      "startTime": "10:00",
      "endTime": "11:00",
      "avatar": "...",
      "coverImage": "",
      "price": 40,
      "currency": "EUR",
      "rating": 4.8,
      "timeSlot": "Morning",
      "description": "Clase de Matemáticas con María García López",
      "level": "Intermedio",
      "duration": 60,
      "maxStudents": 8,
      "location": "Online",
      "requirements": ["Computadora", "Internet estable"],
      "materials": ["Cuaderno", "Lápiz"],
      "status": "active"
    }
  ]
}
```

**Nota:** Si no hay datos, retorna array vacío:
```json
{
  "success": true,
  "data": []
}
```

---

### 2.2 GET /offers/[id]

**Request:**
```bash
GET /api/offers/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 2.3 POST /offers

**Request:**
```json
{
  "userId": "68ce0291c4f5d1435816d910",
  "name": "Clase de Matemáticas",
  "topic": "Álgebra",
  "startDate": "2025-01-20T10:00:00.000Z",
  "endDate": "2025-01-20T11:00:00.000Z",
  "startTime": "10:00",
  "endTime": "11:00",
  "avatar": "https://example.com/avatar.jpg",
  "coverImage": "https://example.com/cover.jpg",
  "price": 25,
  "currency": "USD",
  "rating": 0,
  "timeSlot": "Morning",
  "description": "Clase de álgebra básica",
  "level": "Principiante",
  "duration": 60,
  "maxStudents": 10,
  "location": "Online",
  "requirements": ["Lápiz", "Papel"],
  "materials": [],
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Clase de Matemáticas",
    ...
  }
}
```

---

### 2.4 PUT /offers/[id]

**Request:**
```json
{
  "price": 30,
  "maxStudents": 6,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 2.5 DELETE /offers/[id]

**Request:**
```bash
DELETE /api/offers/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 2.6 POST /offers/[id]/accept

**Request:**
```bash
POST /api/offers/68ffed7c58a2bc99294f016e/accept
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68ffed7c58a2bc99294f016e",
    "status": "confirmed",
    ...
  }
}
```

---

### 2.7 POST /offers/[id]/reject

**Request:**
```bash
POST /api/offers/68ffed7c58a2bc99294f016e/reject
```

**Response:**
```json
{
  "success": true
}
```

---

### 2.8 POST /offers/[id]/apply

**Request:**
```bash
POST /api/offers/68ffed7c58a2bc99294f016e/apply
Content-Type: application/json

{
  "userId": "68ce0291c4f5d1435816d910"
}
```

**Response:**
```json
{
  "success": true
}
```

**Nota:** El ID de la oferta viene en la URL (`[id]`), no en el body.

---

### 2.9 GET /offers/user/[userId]/offers

**Request:**
```bash
GET /api/offers/user/68ce0291c4f5d1435816d910/offers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Clase de Matemáticas",
      ...
    }
  ]
}
```

---

## 🔍 3. BÚSQUEDAS (Searches)

### 3.1 GET /offers/searches

**Request:**
```bash
GET /api/offers/searches?topics=Matemáticas&budget.min=20&budget.max=50
```

**Response:**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### 3.2 GET /offers/searches/[id]

**Request:**
```bash
GET /api/offers/searches/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 3.3 POST /offers/searches

**Request:**
```json
{
  "userId": "68ce0291c4f5d1435816d910",
  "name": "Busco clase de física",
  "topic": "Física",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 3.4 PUT /offers/searches/[id]

**Request:**
```json
{
  "price": 30,
  "description": "Nueva descripción"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 3.5 DELETE /offers/searches/[id]

**Request:**
```bash
DELETE /api/offers/searches/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": null
}
```

---

### 3.6 POST /offers/searches/[id]/apply

**Request:**
```bash
POST /api/offers/searches/68ffed7c58a2bc99294f016e/apply
Content-Type: application/json

{
  "userId": "68ce0291c4f5d1435816d910"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 3.7 GET /offers/user/[userId]/searches

**Request:**
```bash
GET /api/offers/user/68ce0291c4f5d1435816d910/searches
```

**Response:**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 👤 4. PERFIL DE USUARIO

### 4.1 GET /users/[userId]

**Request:**
```bash
GET /api/users/68ce0291c4f5d1435816d910
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "68ce0291c4f5d1435816d910",
    "name": "Yader Parrales",
    "avatar": "https://...",
    "coverImage": "",
    "description": "Profesor de matemáticas",
    "topic": "Matemáticas",
    "rating": 4.8,
    "totalReviews": 3,
    "followers": 0,
    "following": 0,
    "totalClasses": 3,
    "experience": "10 años enseñando, Universidad Nacional, Escuela secundaria",
    "education": "Licenciado en Matemáticas",
    "location": "Madrid, España",
    "languages": ["Español", "Inglés"],
    "specialties": ["Álgebra", "Cálculo"],
    "reviews": [
      {
        "id": "review-id-1",
        "reviewerName": "María García",
        "reviewerAvatar": "https://...",
        "rating": 5,
        "comment": "Excelente profesor",
        "date": "2025-01-20T10:00:00.000Z"
      }
    ],
    "events": [
      {
        "id": "event-id-1",
        "title": "Clase de Álgebra",
        "description": "...",
        "start": "2025-01-25T10:00:00.000Z",
        "end": "2025-01-25T11:00:00.000Z",
        "color": "#FFE5E5",
        "type": "disponibilidad",
        "level": "Intermedio",
        "location": "Online",
        "price": 40,
        "topic": "Matemáticas",
        "maxStudents": 5
      }
    ],
    "contactInfo": {
      "email": "juan@example.com",
      "phone": "+34 612 345 678",
      "website": "https://..."
    },
    "socialMedia": {
      "instagram": "@username",
      "linkedin": "linkedin.com/in/username",
      "twitter": "@username"
    },
    "availability": {
      "isOnline": true,
      "isInPerson": false,
      "isHybrid": true
    },
    "pricing": {
      "individual": 40,
      "group": 25,
      "currency": "EUR"
    }
  }
}
```

---

### 4.2 PUT /users/[userId]

**Request:**
```json
{
  "fullName": "Yader Parrales",
  "description": "Profesor con 10 años de experiencia",
  "skills": ["Álgebra", "Cálculo", "Geometría"],
  "phone": "+34 612 345 678",
  "isOnline": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 📚 5. SESIONES PASADAS

### 5.1 GET /past-sessions

**Request:**
```bash
GET /api/past-sessions?userId=68ce0291c4f5d1435816d910
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "eventId": "...",
      "userId": "...",
      "name": "Clase de Matemáticas",
      "topic": "Matemáticas",
      "date": "2025-01-15T10:00:00.000Z",
      "time": "10:00 AM - 11:00 AM",
      "level": "Intermedio",
      "price": 40,
      "location": "Online",
      "duration": 60,
      "notes": "...",
      "rating": 4.5,
      "feedback": "Excelente clase"
    }
  ]
}
```

---

### 5.2 POST /past-sessions

**Request:**
```json
{
  "eventId": "68ffed7c58a2bc99294f016e",
  "userId": "68ce0291c4f5d1435816d910",
  "name": "Clase de Matemáticas",
  "topic": "Matemáticas",
  "date": "2025-01-15T10:00:00.000Z",
  "time": "10:00 AM - 11:00 AM",
  "duration": 60,
  "rating": 4.5,
  "feedback": "Excelente clase"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 5.3 GET /past-sessions/[id]

**Request:**
```bash
GET /api/past-sessions/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 5.4 PUT /past-sessions/[id]

**Request:**
```json
{
  "notes": "Nuevas notas",
  "rating": 5,
  "feedback": "Clase actualizada"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 5.5 DELETE /past-sessions/[id]

**Request:**
```bash
DELETE /api/past-sessions/68ffed7c58a2bc99294f016e
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🔐 6. AUTENTICACIÓN

### 6.1 POST /auth/refresh

**Request:**
```json
{
  "refreshToken": "token-string"
}
```

**Response:**
```json
{
  "token": "new-access-token",
  "refreshToken": "new-refresh-token",
  "expiresIn": 3600
}
```

---

## 📋 CÓDIGOS DE COLOR AUTOMÁTICOS

El backend asigna automáticamente colores según el tipo de evento:

| Tipo | Color | Hex |
|------|-------|-----|
| `disponibilidad` | Rosa claro | `#FFE5E5` |
| `agendadas` | Verde claro | `#E5FFE5` |
| `ofertas` | Azul claro | `#E5E5FF` |
| `recibir` | Magenta claro | `#FFE5FF` |

**No es necesario enviar el campo `color` en POST, se asigna automáticamente.**

---

## ✅ FORMATO ESTÁNDAR DE RESPUESTA

### Éxito
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

### Error con detalles
```json
{
  "success": false,
  "error": {
    "message": "Mensaje de error",
    "details": "..."
  }
}
```

---

## 🎯 NOTAS IMPORTANTES

1. **Todos los IDs** deben ser strings (MongoDB ObjectId)
2. **Fechas** deben estar en formato ISO 8601: `2025-01-20T10:00:00.000Z`
3. **El campo `color`** es obligatorio en eventos de calendario, pero el backend lo asigna automáticamente si no se envía
4. **Status** válidos:
   - Events: `pending`, `confirmed`, `cancelled`, `completed`
   - Offers: `active`, `cancelled`, `completed`
5. **Type** válidos: `disponibilidad`, `agendadas`, `ofertas`, `recibir`
6. **Arrays vacíos** se retornan como `[]`
7. **Campos opcionales** pueden ser `undefined` o no enviarse

---

## 📞 URLs para Probar

Con los datos de prueba creados:

```bash
# Usuario objetivo
GET /api/users/68ce0291c4f5d1435816d910

# Todas las ofertas
GET /api/offers/available

# Ofertas de María
GET /api/offers/user/68ffea199b59bb7efb6a2f32/offers

# Eventos disponibles
GET /api/available-classes?type=disponibilidad

# Inscribirse en evento
POST /api/available-classes/68ffed7c58a2bc99294f0151/enroll
{
  "id": "68ce0291c4f5d1435816d910",
  "name": "Yader Parrales",
  "email": "yader@example.com"
}
```

