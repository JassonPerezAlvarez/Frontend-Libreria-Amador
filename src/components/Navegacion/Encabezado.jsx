import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Encabezado = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/inicio" className="fw-bold">
          Librería Central
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/inicio" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/usuarios" end>
              Usuarios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/clientes" end>
              Clientes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/proveedores" end>
              Proveedores
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos" end>
              Productos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/compras" end className="fw-bold">
              Compras
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ventas" end>
              Ventas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;