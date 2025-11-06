// src/components/Navegacion/Encabezado.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const Encabezado = () => {
  const navigate = useNavigate();

  const irA = (ruta) => {
    navigate(ruta);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        {/* NOMBRE DE TU LIBRERÍA */}
        <Navbar.Brand
          onClick={() => irA("/inicio")}
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Librería Amador
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-horizontal" />

        <Navbar.Collapse id="menu-horizontal">
          <Nav className="ms-auto gap-2">
            <Nav.Link onClick={() => irA("/inicio")} className="text-white fw-medium">
              Inicio
            </Nav.Link>
            <Nav.Link onClick={() => irA("/productos")} className="text-white fw-medium">
              Productos
            </Nav.Link>
            <Nav.Link onClick={() => irA("/clientes")} className="text-white fw-medium">
              Clientes
            </Nav.Link>
            <Nav.Link onClick={() => irA("/proveedores")} className="text-white fw-medium">
              Proveedores
            </Nav.Link>
            <Nav.Link onClick={() => irA("/usuarios")} className="text-white fw-medium">
              Usuarios
            </Nav.Link>
            <Nav.Link onClick={() => irA("/ventas")} className="text-white fw-medium">
              Ventas
            </Nav.Link>
            <Nav.Link onClick={() => irA("/compras")} className="text-white fw-medium">
              Compras
            </Nav.Link>
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;