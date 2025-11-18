// src/components/detalles_compras/ModalDetallesCompra.jsx
import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles }) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detalles && detalles.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre_producto}</td>
                  <td>{item.cantidad}</td>
                  <td>C$ {parseFloat(item.precio_unitario).toFixed(2)}</td>
                  <td>C$ {(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">
                  Total:
                </td>
                <td className="fw-bold">
                  C${" "}
                  {detalles
                    .reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </Table>
        ) : (
          <p className="text-center">No hay detalles disponibles.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;