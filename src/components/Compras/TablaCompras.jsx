import { Table, Spinner, Button } from "react-bootstrap";

const TablaCompras = ({ compras, cargando, onVerDetalle, onEditar, onEliminar }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (!compras || compras.length === 0) {
    return <p className="text-center text-muted">No hay compras registradas.</p>;
  }

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-success">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Proveedor</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((c) => (
          <tr key={c.ID_Compra}>
            <td className="fw-bold">{c.ID_Compra}</td>
            <td>{new Date(c.Fecha_Compra).toLocaleDateString()}</td>
            <td>{c.Proveedor}</td>
            <td>${c.Total_Compra?.toFixed(2)}</td>
            <td className="text-center">
              <Button variant="outline-info" size="sm" className="me-1" onClick={() => onVerDetalle(c)}>
                Ver
              </Button>
              <Button variant="outline-warning" size="sm" className="me-1" onClick={onEditar}>
                Editar
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onEliminar(c.ID_Compra)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCompras;