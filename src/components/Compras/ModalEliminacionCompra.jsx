import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCompra = ({ mostrar, setMostrar, compra }) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>¿Estás seguro de eliminar la compra de <strong>{compra?.Proveedor}</strong>?</p>
        <p className="text-muted">ID: {compra?.ID_Compra} • Total: C$ {compra?.Total_Compra}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => {
          alert("Compra eliminada");
          setMostrar(false);
        }}>
          Sí, Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCompra;