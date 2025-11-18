// src/components/compras/TablaCompras.jsx
import { Table, Spinner, Button } from "react-bootstrap";

const TablaCompras = ({ compras, cargando, onVerDetalle, onEditar, onEliminar }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return <Alert variant="info">No hay compras registradas.</Alert>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Proveedor</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (
          <tr key={compra.ID_Compra}>
            <td>{compra.ID_Compra}</td>
            <td>{compra.Fecha_Compra}</td>
            <td>{compra.Proveedor || "Sin proveedor"}</td>
            <td>C$ {parseFloat(compra.Total_Compra || 0).toFixed(2)}</td>
            <td>
              <Button size="sm" variant="info" className="me-2" onClick={() => onVerDetalle(compra)}>
                Ver
              </Button>
              <Button size="sm" variant="warning" className="me-2" onClick={() => onEditar(compra)}>
                Editar
              </Button>
              <Button size="sm" variant="danger" onClick={() => onEliminar(compra)}>
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