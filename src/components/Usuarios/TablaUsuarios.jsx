// src/components/Usuarios/TablaUsuarios.jsx
import { Table, Spinner, Button, Badge } from "react-bootstrap";

const TablaUsuarios = ({ usuarios, cargando }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary">
          <span className="visually-hidden">Cargando usuarios...</span>
        </Spinner>
      </div>
    );
  }

  if (!usuarios || usuarios.length === 0) {
    return <p className="text-center text-muted">No hay usuarios registrados.</p>;
  }

  const getRolBadge = (rol) => {
    switch (rol) {
      case "Administrador": return "bg-danger";
      case "Vendedor": return "bg-success";
      case "Cajero": return "bg-info";
      default: return "bg-secondary";
    }
  };

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-primary">
        <tr>
          <th>ID</th>
          <th>Nombre Completo</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.ID_Usuario}>
            <td className="fw-bold">{u.ID_Usuario}</td>
            <td>
              {u.Primer_Nombre} {u.Segundo_Nombre || ""} {u.Primer_Apellido} {u.Segundo_Apellido || ""}
            </td>
            <td>{u.Nombre_Usuario}</td>
            <td>
              <Badge bg={getRolBadge(u.Rol)} className="text-dark">
                {u.Rol}
              </Badge>
            </td>
            <td className="text-center">
              <Button variant="outline-info" size="sm" className="me-1">Ver</Button>
              <Button variant="outline-warning" size="sm" className="me-1">Editar</Button>
              <Button variant="outline-danger" size="sm">Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaUsuarios;