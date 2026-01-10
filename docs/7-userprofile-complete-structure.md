# Estructura Completa del Perfil de Usuario

Este documento describe la estructura completa del `UserProfile` que el frontend espera recibir.

## 📋 Endpoint

**GET** `/api/users/{userId}`

## ✅ Respuesta Esperada (Formato Completo)

```json
{
  "success": true,
  "data": {
    "id": "68ce0291c4f5d1435816d910",
    "name": "Juan Pérez",
    "avatar": "https://example.com/image.jpg",
    "coverImage": "https://example.com/cover.jpg",
    "description": "Profesor de matemáticas con 10 años de experiencia",
    "topic": "Matemáticas",
    "rating": 4.8,
    "totalReviews": 15,
    "followers": 120,
    "following": 85,
    "totalClasses": 45,
    "experience": "10 años enseñando, Universidad Nacional, Escuela secundaria",
    "education": "Licenciado en Matemáticas",
    "location": "Madrid, España",
    "languages": ["Español", "Inglés", "Francés"],
    "specialties": ["Álgebra", "Cálculo", "Geometría"],
    "reviews": [
      {
        "id": "review-id-1",
        "reviewerName": "María García",
        "reviewerAvatar": "https://example.com/avatar.jpg",
        "rating": 5,
        "comment": "Excelente profesor, muy claro en sus explicaciones",
        "date": "2025-01-20T10:00:00.000Z"
      }
    ],
    "events": [
      {
        "id": "event-id-1",
        "title": "Clase de Álgebra",
        "description": "Introducción a ecuaciones lineales",
        "start": "2025-01-25T10:00:00.000Z",
        "end": "2025-01-25T11:00:00.000Z",
        "color": "#E5E5FF",
        "type": "agendadas",
        "level": "Intermedio",
        "location": "Online",
        "price": 30,
        "topic": "Matemáticas",
        "maxStudents": 10
      }
    ],
    "contactInfo": {
      "email": "juan@example.com",
      "phone": "+34 612 345 678",
      "website": "https://juanmatematicas.com"
    },
    "socialMedia": {
      "instagram": "@juanmatematicas",
      "linkedin": "linkedin.com/in/juanperez",
      "twitter": "@juanperez"
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

## 📊 Estructura de Datos

### Campos Principales

| Campo | Tipo | Descripción |
|-------|------|---------------|
| `id` | string | ID del usuario |
| `name` | string | Nombre completo del usuario |
| `avatar` | string | URL de la imagen de perfil |
| `coverImage` | string | URL de la imagen de portada |
| `description` | string | Biografía del usuario |
| `topic` | string | Tema principal de especialización |
| `rating` | number | Calificación promedio |
| `totalReviews` | number | Número total de reseñas |
| `followers` | number | Número de seguidores |
| `following` | number | Número de usuarios que sigue |
| `totalClasses` | number | Total de clases dictadas |
| `experience` | string | Experiencia profesional |
| `education` | string | Educación/certificaciones |
| `location` | string | Ubicación |
| `languages` | string[] | Idiomas hablados |
| `specialties` | string[] | Especialidades/habilidades |

### Reviews

Array de reseñas con la siguiente estructura:

```typescript
interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date
}
```

### Events

Array de eventos del usuario con la siguiente estructura:

```typescript
interface UserEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  type: 'disponibilidad' | 'agendadas' | 'ofertas' | 'recibir';
  level?: string;
  location?: string;
  price?: number;
  topic?: string;
  maxStudents?: number;
}
```

### ContactInfo

Información de contacto:

```typescript
interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
}
```

### SocialMedia

Redes sociales:

```typescript
interface SocialMedia {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}
```

### Availability

Disponibilidad de clases:

```typescript
interface Availability {
  isOnline: boolean;
  isInPerson: boolean;
  isHybrid: boolean;
}
```

### Pricing

Información de precios:

```typescript
interface Pricing {
  individual: number;
  group?: number;
  currency: string;
}
```

## 🔄 Mapeo con Modelo de Base de Datos

| Frontend | Base de Datos | Notas |
|----------|--------------|-------|
| `name` | `fullName` | Mapeo automático |
| `avatar` | `image` | Mapeo automático |
| `description` | `description` | Directo |
| `topic` | `topic` | Directo |
| `rating` | `rating` | Directo |
| `followers` | `followers.length` | Convertido de array a número |
| `following` | `following.length` | Convertido de array a número |
| `location` | `residence` | Mapeo automático |
| `specialties` | `specialties` o `skills` | Directo |
| `languages` | `languages` | Directo |
| `experience` | `experiences.join(', ')` | Array convertido a string |
| `education` | `education` | Directo |
| `phone` | `phone` | Directo |
| `website` | `website` | Directo |
| `instagram` | `instagram` | Directo |
| `linkedin` | `linkedin` | Directo |
| `twitter` | `twitter` | Directo |
| `isOnline` | `isOnline` | Directo |
| `isInPerson` | `isInPerson` | Directo |
| `isHybrid` | `isHybrid` | Directo |
| `individual` | `individualPricing` | Directo |
| `group` | `groupPricing` | Directo |
| `currency` | `pricingCurrency` | Directo |

## 📝 Campos Adicionales en el Modelo

Se agregaron los siguientes campos al modelo `User`:

```typescript
{
  coverImage?: string;
  topic?: string;
  phone?: string;
  website?: string;
  education?: string;
  languages?: string[];
  specialties?: string[];
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  isOnline?: boolean;
  isInPerson?: boolean;
  isHybrid?: boolean;
  individualPricing?: number;
  groupPricing?: number;
  pricingCurrency?: string;
}
```

## 🎯 Implementación

El endpoint `GET /api/users/{userId}` ahora:

1. Obtiene el usuario de la base de datos
2. Busca las reviews del usuario (últimas 10)
3. Busca los eventos del usuario (últimos 20)
4. Transforma los datos al formato esperado por el frontend
5. Retorna el perfil completo

**Archivo:** `controllers/users.ts` - función `getUserProfile`

## ✅ Validaciones

- `userId` es requerido en la query
- Los campos opcionales pueden ser `undefined` o tener valores por defecto
- Los arrays vacíos se retornan como `[]`
- Los objetos anidados vacíos se retornan con valores por defecto

