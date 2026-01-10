# Ejemplos de Uso del CRUD de AvailableClass

## Ejemplos de Peticiones HTTP

### 1. Crear una Nueva Clase

```javascript
// Frontend - JavaScript/TypeScript
const createClass = async (classData) => {
  try {
    const response = await fetch('/api/available-classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Clase de React Avanzado",
        description: "Aprende hooks, context y optimización en React",
        start: "2024-12-25T14:00:00.000Z",
        end: "2024-12-25T16:00:00.000Z",
        color: "#61DAFB",
        type: "ofertas",
        price: 80,
        level: "Avanzado",
        topic: "React",
        maxStudents: 8,
        groupClass: true,
        maxDuration: 120,
        location: "Online"
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Clase creada:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};
```

### 2. Obtener Todas las Clases con Filtros

```javascript
const getClasses = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/available-classes?${queryParams}`);
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Clases encontradas:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplos de uso:
getClasses({ type: 'ofertas', level: 'Principiante' });
getClasses({ minPrice: 30, maxPrice: 100 });
getClasses({ location: 'Online', status: 'confirmed' });
```

### 3. Buscar Clases por Tema

```javascript
const searchClasses = async (searchTerm) => {
  try {
    const response = await fetch(`/api/available-classes/search?topic=${encodeURIComponent(searchTerm)}`);
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Resultados de búsqueda:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

searchClasses('JavaScript');
searchClasses('Python');
```

### 4. Obtener una Clase Específica

```javascript
const getClassById = async (classId) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}`);
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Clase:', result.data);
      return result.data;
    } else {
      console.error('Clase no encontrada');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 5. Actualizar una Clase

```javascript
const updateClass = async (classId, updateData) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Clase actualizada:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplo de actualización:
updateClass('68f594bf5270efdd47cd355e', {
  title: "Clase de React Avanzado - Actualizada",
  price: 90,
  maxStudents: 12
});
```

### 6. Cambiar Estado de una Clase

```javascript
const updateClassStatus = async (classId, status) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Estado actualizado:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplos:
updateClassStatus('68f594bf5270efdd47cd355e', 'confirmed');
updateClassStatus('68f594bf5270efdd47cd355e', 'cancelled');
```

### 7. Inscribir Estudiante a una Clase

```javascript
const enrollStudent = async (classId, studentData) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Estudiante inscrito:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplo de inscripción:
enrollStudent('68f594bf5270efdd47cd355e', {
  studentId: '68ce0291c4f5d1435816d910',
  studentName: 'María García',
  studentEmail: 'maria@example.com'
});
```

### 8. Desinscribir Estudiante de una Clase

```javascript
const unenrollStudent = async (classId, studentId) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}/enroll`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Estudiante desinscrito:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 9. Obtener Estadísticas

```javascript
const getClassStats = async (userId = null) => {
  try {
    const url = userId 
      ? `/api/available-classes/stats?userId=${userId}`
      : '/api/available-classes/stats';
      
    const response = await fetch(url);
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Estadísticas:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Estadísticas generales:
getClassStats();

// Estadísticas de un profesor específico:
getClassStats('68ce0291c4f5d1435816d910');
```

### 10. Eliminar una Clase

```javascript
const deleteClass = async (classId) => {
  try {
    const response = await fetch(`/api/available-classes/${classId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Clase eliminada:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Ejemplos de Uso en React

### Hook Personalizado para Clases

```javascript
// hooks/useAvailableClasses.js
import { useState, useEffect } from 'react';

export const useAvailableClasses = (filters = {}) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/available-classes?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setClasses(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [JSON.stringify(filters)]);

  return { classes, loading, error, refetch: fetchClasses };
};
```

### Componente de Lista de Clases

```jsx
// components/ClassList.jsx
import React from 'react';
import { useAvailableClasses } from '../hooks/useAvailableClasses';

const ClassList = ({ filters }) => {
  const { classes, loading, error } = useAvailableClasses(filters);

  if (loading) return <div>Cargando clases...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="class-list">
      {classes.map(classItem => (
        <div key={classItem._id} className="class-card">
          <h3>{classItem.title}</h3>
          <p>{classItem.description}</p>
          <div className="class-info">
            <span>Profesor: {classItem.userId.fullName}</span>
            <span>Precio: ${classItem.price}</span>
            <span>Nivel: {classItem.level}</span>
            <span>Estudiantes: {classItem.students.length}/{classItem.maxStudents}</span>
          </div>
          <button onClick={() => enrollInClass(classItem._id)}>
            Inscribirse
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Ejemplos de Uso con Axios

```javascript
// api/availableClasses.js
import axios from 'axios';

const API_BASE = '/api/available-classes';

export const availableClassesAPI = {
  // Obtener todas las clases
  getAll: (params = {}) => axios.get(API_BASE, { params }),
  
  // Obtener una clase específica
  getById: (id) => axios.get(`${API_BASE}/${id}`),
  
  // Crear nueva clase
  create: (data) => axios.post(API_BASE, data),
  
  // Actualizar clase
  update: (id, data) => axios.put(`${API_BASE}/${id}`, data),
  
  // Eliminar clase
  delete: (id) => axios.delete(`${API_BASE}/${id}`),
  
  // Cambiar estado
  updateStatus: (id, status) => axios.patch(`${API_BASE}/${id}`, { status }),
  
  // Inscribir estudiante
  enrollStudent: (id, studentData) => axios.post(`${API_BASE}/${id}/enroll`, studentData),
  
  // Desinscribir estudiante
  unenrollStudent: (id, studentId) => axios.delete(`${API_BASE}/${id}/enroll`, {
    data: { studentId }
  }),
  
  // Búsqueda
  search: (params) => axios.get(`${API_BASE}/search`, { params }),
  
  // Estadísticas
  getStats: (userId = null) => axios.get(`${API_BASE}/stats`, {
    params: userId ? { userId } : {}
  })
};

// Uso:
availableClassesAPI.getAll({ type: 'ofertas' })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## Manejo de Errores

```javascript
const handleAPIError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        console.error('Error de validación:', data.error.details);
        break;
      case 404:
        console.error('Recurso no encontrado');
        break;
      case 405:
        console.error('Método no permitido');
        break;
      case 500:
        console.error('Error interno del servidor');
        break;
      default:
        console.error('Error desconocido:', data.error);
    }
  } else if (error.request) {
    // Error de red
    console.error('Error de red:', error.request);
  } else {
    // Error de configuración
    console.error('Error:', error.message);
  }
};
```

Estos ejemplos proporcionan una guía completa para implementar el CRUD de AvailableClass en cualquier frontend.
