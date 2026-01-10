# Datos de Prueba Creados - Actualizado

## 📊 Resumen Completo

Se han creado exitosamente los siguientes datos de prueba en la base de datos:

### 👥 Usuarios Creados (4)

1. **María García López** - Profesora de matemáticas
   - Especialización: Álgebra, Cálculo, Geometría, Estadística
   - Rating: 4.8
   - Precio individual: €40 | Grupal: €25

2. **Carlos Rodríguez Martín** - Profesor de física
   - Especialización: Física Cuántica, Mecánica, Óptica, Termodinámica
   - Rating: 4.9
   - Precio individual: €50 | Grupal: €30

3. **Ana Martínez Sánchez** - Profesora de idiomas
   - Especialización: Inglés, Francés, Alemán
   - Rating: 4.7
   - Precio individual: €35 | Grupal: €20

4. **Pedro Hernández Díaz** - Profesor de programación
   - Especialización: JavaScript, Python, React, Node.js, TypeScript
   - Rating: 5.0
   - Precio individual: €45 | Grupal: €28

### 📅 Eventos de Calendario Creados (7)

**Modelo:** `CalendarEvent`

#### Eventos del Usuario Objetivo como Profesor (3):

1. **Clase de Disponibilidad - Álgebra**
   - Tipo: `disponibilidad` (#FFE5E5)
   - Fecha: futuro
   - Precio: €40

2. **Clase Agendada - Cálculo Diferencial**
   - Tipo: `agendadas` (#E5FFE5)
   - Fecha: futuro
   - Precio: €40

3. **Oferta de Clases Grupales**
   - Tipo: `ofertas` (#E5E5FF)
   - Fecha: futuro
   - Precio: €25

#### Eventos de Otros Usuarios donde el usuario objetivo está inscrito (4):

4. **Clase María - Matemáticas**
5. **Clase Carlos - Física**
6. **Clase Ana - Idiomas**
7. **Clase Pedro - Programación**

### 💼 Ofertas Creadas (4)

**Modelo:** `Offer`

Cada uno de los otros usuarios tiene una oferta creada:

1. **Matemáticas - María**
   - Profesor: María García López
   - Precio: €40
   - Duración: 60 minutos
   - Status: `active`

2. **Física - Carlos**
   - Profesor: Carlos Rodríguez Martín
   - Precio: €50
   - Duración: 60 minutos
   - Status: `active`

3. **Idiomas - Ana**
   - Profesora: Ana Martínez Sánchez
   - Precio: €35
   - Duración: 60 minutos
   - Status: `active`

4. **Programación - Pedro**
   - Profesor: Pedro Hernández Díaz
   - Precio: €45
   - Duración: 60 minutos
   - Status: `active`

### 👨‍🎓 Inscripciones del Usuario Objetivo

El usuario objetivo (`68ce0291c4f5d1435816d910`) está inscrito como estudiante en 3 eventos de calendario de otros usuarios.

### ⭐ Reviews del Usuario Objetivo (3)

1. **5 estrellas** - María García López
   - "Excelente profesor, muy claro en sus explicaciones. Altamente recomendado."

2. **4 estrellas** - Carlos Rodríguez Martín
   - "Muy buen maestro, aunque algunos temas podrían explicarse más despacio."

3. **5 estrellas** - Ana Martínez Sánchez
   - "Increíble método de enseñanza. Las clases son muy interactivas."

## 🎯 Información del Usuario Objetivo

**ID:** `68ce0291c4f5d1435816d910`
**Nombre:** Yader Parrales

## 🧪 Endpoints para Probar

### 1. Obtener Perfil Completo del Usuario Objetivo
```bash
GET /api/users/68ce0291c4f5d1435816d910
```
Retorna: perfil con reviews y events

### 2. Ver Todas las Ofertas Disponibles
```bash
GET /api/offers/available
```
Retorna: todas las ofertas activas de todos los usuarios

### 3. Obtener Ofertas de un Usuario Específico

**María:**
```bash
GET /api/offers/user/68ffea199b59bb7efb6a2f32/offers
```

**Carlos:**
```bash
GET /api/offers/user/68ffea199b59bb7efb6a2f35/offers
```

**Ana:**
```bash
GET /api/offers/user/68ffea199b59bb7efb6a2f38/offers
```

**Pedro:**
```bash
GET /api/offers/user/68ffea199b59bb7efb6a2f3b/offers
```

### 4. Obtener Eventos de un Usuario
```bash
GET /api/available-classes?userId=68ce0291c4f5d1435816d910
```

### 5. Obtener Eventos donde el Usuario es Estudiante
```bash
GET /api/available-classes?type=agendadas
```

### 6. Obtener Reviews del Usuario
```bash
GET /api/reviews?targetId=68ce0291c4f5d1435816d910
```

## 📝 Diferencias entre CalendarEvent y Offer

### CalendarEvent (Clases en el Calendario)
- Son eventos del calendario
- Usados para mostrar horarios disponibles, clases agendadas
- Tienen fecha y hora específicas
- Tipo: `disponibilidad`, `agendadas`, `ofertas`, `recibir`
- Colores automáticos por tipo

### Offer (Ofertas)
- Son ofertas de clases/tutoring
- Usados en el marketplace
- Tienen información completa de precios, horarios
- Status: `active`, `cancelled`, `completed`
- Más detalladas con requirements, materials, etc.

## ✨ Características Implementadas

✅ Usuarios completos con perfiles
✅ Eventos de calendario de diferentes tipos
✅ Ofertas para cada usuario
✅ Auto-asignación de colores por tipo de evento
✅ Usuario objetivo como profesor y estudiante
✅ Reviews con comentarios
✅ Fechas aleatorias futuras
✅ Precios y disponibilidad configurados
