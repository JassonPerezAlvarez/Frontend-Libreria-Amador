// src/views/Usuarios.jsx
import { Container, Button } from "react-bootstrap";
import TablaUsuarios from "../components/Usuarios/TablaUsuarios";

const Usuarios = () => {
  // Datos de ejemplo (simula tu tabla Usuarios)
  const usuarios = [
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

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Usuarios</h2>
        <Button variant="success">+ Nuevo Usuario</Button>
      </div>
      <TablaUsuarios usuarios={usuarios} cargando={false} />
    </Container>
  );
};

export default Usuarios;