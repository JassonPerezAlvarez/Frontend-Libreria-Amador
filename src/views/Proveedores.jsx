// src/views/Proveedores.jsx
import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import TablaProveedores from "../components/Proveedores/TablaProveedores";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]); 
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  //  useEffect para obtener datos del backend
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/proveedores");
        if (!respuesta.ok) throw new Error("Error al obtener los proveedores");
        const datos = await respuesta.json();
        setProveedores(datos);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProveedores();
  }, []);

  // 🔍 Filtrar resultados
  const proveedoresFiltrados = proveedores.filter((p) => {
    const busqueda = textoBusqueda.toLowerCase().trim();
    if (!busqueda) return true;

    const nombreCompleto = [
      p.Primer_Nombre,
      p.Segundo_Nombre,
      p.Primer_Apellido,
      p.Segundo_Apellido,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      nombreCompleto.includes(busqueda) ||
      p.Contacto?.toLowerCase().includes(busqueda) ||
      p.Correo?.toLowerCase().includes(busqueda)
    );
  });

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  return (
    <Container className="mt-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Proveedores</h2>
        <Button variant="success">+ Nuevo Proveedor</Button>
      </div>

      {/* Búsqueda */}
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />

      {/* Tabla */}
      {cargando ? (
        <p>Cargando proveedores...</p>
      ) : (
        <TablaProveedores proveedores={proveedoresFiltrados} />
      )}
    </Container>
  );
};

export default Proveedores;
