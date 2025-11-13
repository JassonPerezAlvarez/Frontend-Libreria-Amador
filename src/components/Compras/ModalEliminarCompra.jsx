import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminarCompra = ({ show, onHide, onConfirmar, compra }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Está seguro que desea eliminar la compra con ID: {compra?.ID_Compra}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => onConfirmar(compra.ID_Compra)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminarCompra;