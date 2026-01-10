# Sistema de Autenticación y Gestión de Usuarios

## Registro de Usuarios

El proceso de registro de usuarios se maneja a través de varios componentes:

### Flujo de Registro

1. **Punto de Entrada**: `controllers/users.ts -> register()`
   - Recibe la petición HTTP POST con los datos del usuario
   - Maneja la conexión a la base de datos
   - Gestiona los errores de registro

2. **Proceso de Registro**: `utils/users/registerUser.ts`
   - Verifica que el email no exista previamente
   - Encripta la contraseña usando bcrypt
   - Crea nuevo usuario en MongoDB
   - Genera token JWT (válido por 30 días)
   - Retorna usuario y token

### Estructura de Datos del Usuario

El registro requiere los siguientes datos:
```typescript
interface IUser {
  email: string;
  password: string;
  // otros campos según el modelo
}
```

### Manejo de Errores

- Email duplicado: Status 400 con mensaje "Email already in use"
- Errores del servidor: Status 500 con mensaje detallado

## Gestión de Usuarios

### Funcionalidades Disponibles

1. **Obtener Usuario** (`getUserById`)
   - Recupera información de un usuario por su ID
   - Endpoint: GET /api/users/:id

2. **Actualizar Usuario** (`updateUser`)
   - Actualiza información del perfil
   - Endpoint: PUT /api/users/:id

3. **Buscar Usuarios** (`findUsers`)
   - Búsqueda de usuarios en el sistema
   - Endpoint: GET /api/users/search

### Sistema de Seguimiento

1. **Seguir Usuario** (`follow`)
   - Permite seguir a otro usuario
   - Endpoint: POST /api/users/follow

2. **Dejar de Seguir** (`unfollow`)
   - Permite dejar de seguir a un usuario
   - Endpoint: POST /api/users/unfollow

3. **Consultas de Seguidores**
   - `userFollowes`: Lista los seguidores de un usuario
   - `userFollowings`: Lista a quién sigue el usuario
   - Ambos endpoints soportan paginación

### Grupos de Usuarios

- `userGroups`: Obtiene los grupos asociados a un usuario
- Soporta paginación mediante parámetros `page` y `limit`

## Seguridad

- Las contraseñas se almacenan encriptadas usando bcrypt
- Se utiliza JWT para la autenticación
- Todas las operaciones requieren conexión a la base de datos
- Se implementa manejo de desconexión segura

## Uso de Base de Datos

- Conexión manejada por el módulo `db` en `database/db.ts`
- Conexión automática antes de cada operación
- Desconexión automática después de cada operación
- Manejo de errores en caso de fallos de conexión