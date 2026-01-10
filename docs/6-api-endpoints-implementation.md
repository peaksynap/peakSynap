# Implementación de Endpoints API - PeakSynap

Este documento describe la implementación de todos los endpoints según la especificación del frontend.

## ✅ Cambios Implementados

### 1. Auto-asignación de Colores Según Tipo de Evento

**Archivo modificado:** `controllers/availableClass.ts`

Se implementó la lógica para asignar automáticamente colores según el tipo de evento:
- `disponibilidad`: `#FFE5E5` (Rosa claro)
- `agendadas`: `#E5FFE5` (Verde claro)
- `ofertas`: `#E5E5FF` (Azul claro)
- `recibir`: `#FFE5FF` (Magenta claro)

### 2. Endpoints de Clases Disponibles (Available Classes)

**Archivos:** Ya existentes, con auto-asignación de colores implementada

**Endpoints completos:**
- ✅ `GET /api/available-classes` - Obtener todas las clases
- ✅ `GET /api/available-classes/[id]` - Obtener clase específica
- ✅ `POST /api/available-classes` - Crear nueva clase
- ✅ `PUT /api/available-classes/[id]` - Actualizar clase
- ✅ `DELETE /api/available-classes/[id]` - Eliminar clase
- ✅ `PATCH /api/available-classes/[id]` - Cambiar estado de clase
- ✅ `POST /api/available-classes/[id]/enroll` - Inscribir estudiante
- ✅ `DELETE /api/available-classes/[id]/enroll` - Desinscribir estudiante

### 3. Endpoints de Ofertas (Offers)

**Archivos creados:**
- `pages/api/offers/available.ts` - Obtener ofertas disponibles
- `pages/api/offers/[id]/accept.ts` - Aceptar oferta
- `pages/api/offers/[id]/reject.ts` - Rechazar oferta
- `pages/api/offers/[id]/apply.ts` - Aplicar a oferta
- `pages/api/offers/user/[userId]/offers.ts` - Obtener ofertas de un usuario

**Archivos modificados:**
- `controllers/offers.ts` - Agregadas nuevas funciones:
  - `getAvailableOffers` - Obtener ofertas con filtros avanzados
  - `acceptOffer` - Aceptar oferta
  - `rejectOffer` - Rechazar oferta
  - `applyToOffer` - Aplicar a una oferta
  - `getUserOffers` - Obtener ofertas de un usuario

### 4. Endpoints de Búsquedas (Searches)

**Archivos creados:**
- `controllers/searches.ts` - Controlador completo de búsquedas
- `pages/api/offers/searches.ts` - Listar y crear búsquedas
- `pages/api/offers/searches/[id].ts` - Obtener, actualizar, eliminar búsqueda
- `pages/api/offers/searches/[id]/apply.ts` - Aplicar a búsqueda
- `pages/api/offers/user/[userId]/searches.ts` - Obtener búsquedas de un usuario

**Funciones implementadas:**
- `getSearches` - Obtener todas las búsquedas
- `getSearch` - Obtener búsqueda específica
- `createSearch` - Crear nueva búsqueda
- `updateSearch` - Actualizar búsqueda
- `deleteSearch` - Eliminar búsqueda
- `applyToSearch` - Aplicar a búsqueda
- `getUserSearches` - Obtener búsquedas de un usuario

### 5. Endpoints de Usuario

**Archivos creados:**
- `pages/api/users/[userId].ts` - Obtener perfil completo de usuario

**Archivos modificados:**
- `controllers/users.ts` - 
  - Función `getUserProfile` - Retorna perfil completo con reviews y events
  - Actualizado formato de respuesta a `{ success, data, error }`
- `models/users.ts` - Agregados campos adicionales para perfil completo

**Nuevo:** Ver documentación completa en `docs/7-userprofile-complete-structure.md`

### 6. Endpoints de Sesiones Pasadas

**Estado:** Ya existían todos los endpoints necesarios en `controllers/pastSessions.ts`

### 7. Endpoint de Autenticación

**Archivos creados:**
- `pages/api/auth/refresh.ts` - Refresh token

**Nota:** Este endpoint requiere implementar la lógica completa de JWT tokens. Actualmente retorna tokens mock.

## 📊 Resumen de Endpoints

### Total: 25+ Endpoints Implementados

**Calendar Events (8 endpoints):**
- ✅ GET /api/available-classes
- ✅ GET /api/available-classes/[id]
- ✅ POST /api/available-classes
- ✅ PUT /api/available-classes/[id]
- ✅ DELETE /api/available-classes/[id]
- ✅ PATCH /api/available-classes/[id]
- ✅ POST /api/available-classes/[id]/enroll
- ✅ DELETE /api/available-classes/[id]/enroll

**Offers (7 endpoints):**
- ✅ GET /api/offers/available
- ✅ GET /api/offers/[id]
- ✅ POST /api/offers
- ✅ PUT /api/offers/[id]
- ✅ DELETE /api/offers/[id]
- ✅ POST /api/offers/[id]/accept
- ✅ POST /api/offers/[id]/reject

**Searches (5 endpoints):**
- ✅ GET /api/offers/searches
- ✅ GET /api/offers/searches/[id]
- ✅ POST /api/offers/searches
- ✅ PUT /api/offers/searches/[id]
- ✅ DELETE /api/offers/searches/[id]

**Applications (2 endpoints):**
- ✅ POST /api/offers/[id]/apply
- ✅ POST /api/offers/searches/[id]/apply

**User Profile (4 endpoints):**
- ✅ GET /api/users/[userId]
- ✅ PUT /api/users/[userId]
- ✅ GET /api/offers/user/[userId]/offers
- ✅ GET /api/offers/user/[userId]/searches

**Past Sessions (5 endpoints):**
- ✅ GET /api/past-sessions
- ✅ GET /api/past-sessions/[id]
- ✅ POST /api/past-sessions
- ✅ PUT /api/past-sessions/[id]
- ✅ DELETE /api/past-sessions/[id]

**Auth (1 endpoint):**
- ✅ POST /api/auth/refresh

## 🔧 Formato de Respuesta Estándar

Todos los endpoints ahora siguen el formato:

```typescript
// Éxito
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Mensaje de error"
}
```

## 📝 Notas Importantes

1. **Auto-asignación de colores:** Implementada en `createAvailableClass`
2. **Formato de respuesta:** Todos los endpoints actualizados para usar el formato estándar
3. **Refresh token:** Implementado como mock, requiere integración con sistema JWT
4. **Aplicaciones:** Los endpoints de aplicación actualmente solo validan, se puede extender para almacenar aplicaciones en el modelo

## 🚀 Próximos Pasos

1. Integrar el sistema de refresh token real con JWT
2. Agregar almacenamiento de aplicaciones en los modelos Offer y Search
3. Implementar autenticación en endpoints que la requieran
4. Agregar validaciones adicionales según necesidad

