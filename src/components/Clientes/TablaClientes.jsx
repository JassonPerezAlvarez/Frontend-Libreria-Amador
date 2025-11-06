// src/components/Clientes/TablaClientes.jsx
import { Table, Spinner, Button } from "react-bootstrap";

const TablaClientes = ({ clientes, cargando }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary">
          <span className="visually-hidden">Cargando clientes...</span>
        </Spinner>
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return <p className="text-center text-muted">No hay clientes registrados.</p>;
  }

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-primary">
        <tr>
          <th>ID</th>
          <th>Nombre Completo</th>
          <th>Cédula</th>
          <th>Contacto</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((c) => (
          <tr key={c.ID_Cliente}>
            <td className="fw-bold">{c.ID_Cliente}</td>
            <td>
              {c.Primer_Nombre} {c.Segundo_Nombre || ""} {c.Primer_Apellido} {c.Segundo_Apellido || ""}
            </td>
            <td>{c.Cedula || "-"}</td>
            <td>{c.Contacto || "-"}</td>
            <td>{c.Direccion || "-"}</td>
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

export default TablaClientes;