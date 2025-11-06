// src/views/Usuarios.jsx
import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import TablaUsuarios from "../components/Usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Usuarios = () => {
  // Datos de ejemplo
  const usuariosOriginales = [
    {
      ID_Usuario: 1,
      Primer_Nombre: "Juan",
      Segundo_Nombre: "Carlos",
      Primer_Apellido: "Martínez",
      Segundo_Apellido: "Gómez",
      Nombre_Usuario: "juan.martinez",
      Rol: "Administrador"
    },
    {
      ID_Usuario: 2,
      Primer_Nombre: "María",
      Segundo_Nombre: null,
      Primer_Apellido: "López",
      Segundo_Apellido: "Pérez",
      Nombre_Usuario: "maria.lopez",
      Rol: "Vendedor"
    },
    {
      ID_Usuario: 3,
      Primer_Nombre: "Pedro",
      Segundo_Nombre: "Luis",
      Primer_Apellido: "Ramírez",
      Segundo_Apellido: null,
      Nombre_Usuario: "pedro.ramirez",
      Rol: "Cajero"
    }
  ];

  // Estado para búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Función para construir nombre completo
  const nombreCompleto = (u) => {
    const partes = [
      u.Primer_Nombre,
      u.Segundo_Nombre,
      u.Primer_Apellido,
      u.Segundo_Apellido
    ].filter(Boolean);
    return partes.join(" ").toLowerCase();
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuariosOriginales.filter(usuario => {
    const busqueda = textoBusqueda.toLowerCase();
    return (
      nombreCompleto(usuario).includes(busqueda) ||
      usuario.Nombre_Usuario.toLowerCase().includes(busqueda) ||
      usuario.Rol.toLowerCase().includes(busqueda)
    );
  });

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Usuarios</h2>
        <Button variant="success">+ Nuevo Usuario</Button>
      </div>

      {/* Cuadro de búsqueda */}
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />

      {/* Tabla con datos filtrados */}
      <TablaUsuarios usuarios={usuariosFiltrados} cargando={false} />
    </Container>
  );
};

export default Usuarios;