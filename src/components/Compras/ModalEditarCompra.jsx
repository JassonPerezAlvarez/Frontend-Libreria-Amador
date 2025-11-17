import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEditarCompra = ({ show, onHide, compra, onActualizar }) => {
  const [ID_Proveedor, setIDProveedor] = useState("");
  const [Fecha_Compra, setFechaCompra] = useState("");

  useEffect(() => {
    if (compra) {
      setIDProveedor(compra.ID_Proveedor);
      setFechaCompra(compra.Fecha_Compra ? compra.Fecha_Compra.split("T")[0] : "");
    }
  }, [compra]);

  const manejarActualizar = () => {
    if (!ID_Proveedor || !Fecha_Compra) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    onActualizar({ ID_Proveedor, Fecha_Compra });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Compra ID {compra?.ID_Compra}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formProveedorEdit">
            <Form.Label>ID Proveedor</Form.Label>
            <Form.Control
              type="number"
              value={ID_Proveedor}
              onChange={(e) => setIDProveedor(e.target.value)}
              placeholder="Ingrese ID Proveedor"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaCompraEdit">
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
        <Button variant="primary" onClick={manejarActualizar}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarCompra;