# Documentación PeakSynap Backend

## Índice

1. [Arquitectura del Sistema](./1-architecture.md)
   - Estructura general
   - Flujo de datos
   - Componentes principales
   - Stack tecnológico

2. [Base de Datos](./2-database.md)
   - Modelo de Usuario
   - Esquemas
   - Conexión y gestión
   - Validaciones

3. [Autenticación y Usuarios](./3-authentication.md)
   - Sistema de registro
   - Gestión de usuarios
   - Seguridad
   - API endpoints

4. [Solución de Errores de Esquemas](./4-schema-registration-fix.md)
   - Error MissingSchemaError
   - Sistema de registro de modelos
   - Correcciones aplicadas
   - Verificación y debugging

5. [CRUD de AvailableClass](./5-available-class-crud.md)
   - Documentación completa del CRUD
   - Endpoints disponibles
   - Validaciones implementadas
   - Ejemplos de uso

## Guía Rápida

### Estructura de Carpetas
```
├── controllers/    # Controladores de la aplicación
├── database/      # Configuración de base de datos
├── models/        # Modelos de datos
├── utils/         # Utilidades y servicios
└── pages/api/     # Endpoints de la API
```

### Comandos Principales
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Construye la aplicación
- `npm start`: Inicia el servidor en modo producción

### Enlaces Útiles
- [Documentación de API](./4-api-endpoints.md)
- [Guía de Desarrollo](./5-development-guide.md)
- [Troubleshooting](./6-troubleshooting.md)

## Notas Importantes

- Asegúrate de tener MongoDB instalado y corriendo
- Configura las variables de entorno según el ejemplo
- Sigue las convenciones de código establecidas
