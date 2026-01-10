# Estructura de la Base de Datos

## Modelo de Usuario

El sistema utiliza MongoDB como base de datos y Mongoose como ODM. A continuación se detalla la estructura del modelo de usuario:

### Campos Obligatorios
```typescript
{
  fullName: string;       // Nombre completo del usuario
  email: string;         // Email (único en el sistema)
  bornDate: Date;       // Fecha de nacimiento
  password: string;     // Contraseña (se almacena encriptada)
  createdAt: Date;     // Fecha de creación
  updatedAt: Date;     // Fecha de última actualización
}
```

### Campos Opcionales
```typescript
{
  gender?: string;          // Género
  country?: string;         // País
  residence?: string;       // Lugar de residencia
  experiences?: string[];   // Lista de experiencias
  skills?: string[];        // Habilidades
  interests?: string[];     // Intereses
  image?: string;          // URL de la imagen de perfil
  description?: string;    // Descripción del perfil
  rating?: number;        // Calificación del usuario (default: 0)
}
```

### Campos de Relaciones
```typescript
{
  followers?: string[];     // IDs de usuarios que siguen a este usuario
  following?: string[];     // IDs de usuarios que este usuario sigue
  userGroups?: string[];   // IDs de grupos a los que pertenece
}
```

### Campos de Seguridad
```typescript
{
  password: string;        // Contraseña encriptada con bcrypt
  passwordToken?: string;  // Token para reseteo de contraseña
}
```

## Características Especiales

1. **Transformación de Datos**
   - Al convertir a JSON o Object, se eliminan automáticamente los campos sensibles:
     - password
     - passwordToken

2. **Índices**
   - Email: Índice único para prevenir duplicados

3. **Validaciones**
   - Email: Requerido y único
   - Nombre completo: Requerido
   - Fecha de nacimiento: Requerida
   - Contraseña: Requerida

## Conexión a la Base de Datos

La conexión se maneja mediante el módulo `database/db.ts` que implementa:

1. **Estado de Conexión**
   - Tracking del estado de conexión
   - Reutilización de conexiones existentes
   - Reconexión automática cuando es necesario

2. **Gestión de Conexiones**
   - Conexión automática antes de operaciones
   - Desconexión segura después de operaciones
   - Manejo de errores de conexión