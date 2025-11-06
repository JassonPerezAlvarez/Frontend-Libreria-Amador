// src/components/Proveedores/TablaProveedores.jsx
import { Table, Spinner, Button } from "react-bootstrap";

const TablaProveedores = ({ proveedores, cargando }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary">
          <span className="visually-hidden">Cargando proveedores...</span>
        </Spinner>
      </div>
    );
  }

  if (!proveedores || proveedores.length === 0) {
    return <p className="text-center text-muted">No hay proveedores registrados.</p>;
  }

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-primary">
        <tr>
          <th>ID</th>
          <th>Nombre Completo</th>
          <th>Contacto</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proveedores.map((p) => (
          <tr key={p.ID_Proveedor}>
            <td className="fw-bold">{p.ID_Proveedor}</td>
            <td>
              {p.Primer_Nombre} {p.Segundo_Nombre || ""} {p.Primer_Apellido} {p.Segundo_Apellido || ""}
            </td>
            <td>{p.Contacto || "-"}</td>
            <td>{p.Correo || "-"}</td>
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

export default TablaProveedores;