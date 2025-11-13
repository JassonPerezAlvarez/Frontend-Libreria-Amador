import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";

const TablaCompras = ({ compras, cargando, onEditar, onEliminar }) => {
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <span className="visually-hidden">Cargando compras...</span>
      </div>
    );
  }

  if (!compras || compras.length === 0) {
    return <p className="text-center text-muted">No hay compras registradas.</p>;
  }

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-primary">
        <tr>
          <th>ID Compra</th>
          <th>Fecha Compra</th>
          <th>ID Proveedor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (
          <tr key={compra.ID_Compra}>
            <td>{compra.ID_Compra}</td>
            <td>{new Date(compra.Fecha_Compra).toLocaleDateString()}</td>
            <td>{compra.ID_Proveedor}</td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => onEditar(compra)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onEliminar(compra.ID_Compra)}
              >
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