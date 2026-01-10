# Generador de Datos de Prueba

Este script genera datos de prueba para:
- **Clases Disponibles** (CalendarEvent)
- **Ofertas de Usuario** (Offer)
- **Sesiones Pasadas** (PastSession)

## Uso

### Ejecutar el script

```bash
npm run generate-test-data
```

O directamente con ts-node:

```bash
npx ts-node --project scripts/tsconfig.json scripts/generateTestData.ts
```

## Datos Generados

### Clases Disponibles (6 registros)
- Clase de Cálculo Diferencial (disponibilidad)
- Tutoría de Física Cuántica (agendadas)
- Curso de React y Next.js (ofertas)
- Workshop de TypeScript (recibir)
- Clase de Inglés Conversacional (disponibilidad)
- Preparación para IELTS (agendadas)

### Ofertas (5 registros)
- Curso Intensivo de Álgebra Lineal - 299 EUR
- Bootcamp de Desarrollo Full Stack - 599 EUR
- Masterclass de Python Avanzado - 199 EUR
- Curso de Inglés para Negocios - 249 EUR
- Tutoría de Cálculo Integral - 50 EUR

### Sesiones Pasadas (6 registros)
- Introducción al Cálculo (Rating: 5/5)
- Fundamentos de React (Rating: 4/5)
- Inglés Conversacional (Rating: 5/5)
- Física Mecánica (Rating: 4/5)
- Node.js y Express (Rating: 5/5)
- Preparación IELTS (Rating: 5/5)

## Notas

- El script crea usuarios de prueba si no existen en la base de datos
- Los datos incluyen relaciones entre entidades
- Las sesiones pasadas incluyen archivos adjuntos de ejemplo
- Todos los datos tienen información completa y realista

