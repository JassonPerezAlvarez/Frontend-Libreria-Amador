import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroCompra = ({ show, onHide, onGuardar }) => {
  const [ID_Proveedor, setIDProveedor] = useState("");
  const [Fecha_Compra, setFechaCompra] = useState("");

  const manejarGuardar = () => {
    if (!ID_Proveedor || !Fecha_Compra) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    onGuardar({ ID_Proveedor, Fecha_Compra });
    setIDProveedor("");
    setFechaCompra("");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formProveedor">
            <Form.Label>ID Proveedor</Form.Label>
            <Form.Control
              type="number"
              value={ID_Proveedor}
              onChange={(e) => setIDProveedor(e.target.value)}
              placeholder="Ingrese ID Proveedor"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaCompra">
            <Form.Label>Fecha Compra</Form.Label>
            <Form.Control
              type="date"
              value={Fecha_Compra}
              onChange={(e) => setFechaCompra(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={manejarGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;