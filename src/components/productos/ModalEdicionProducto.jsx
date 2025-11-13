import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  setMostrar,
  productoEditado,
  setProductoEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="nombreProducto">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={productoEditado?.nombre_producto}
                  onChange={manejarCambio}
                  placeholder="Nombre del producto"
                  maxLength={100}
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="Descripcion">
                <Form.Label>Descripcion</Form.Label>
                <Form.Control
                  type="text"
                  name="Descripcion"
                  value={productoEditado?.DesDescripcion}
                  onChange={manejarCambio}
                  placeholder="Descripcion"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="Cantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="Cantidad"
              value={productoEditado?.Cantidad}
              onChange={manejarCambio}
              placeholder="Cantidad"
              maxLength={300}
            />
          </Form.Group>

          <Row>
            <Col md={4} className="mb-3">
              <Form.Group controlId="Precio_Comp">
                <Form.Label>Precio_Comp</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio_Comp"
                  value={productoEditado?.Precio_Comp}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            
            </Col>
          </Row>
          <Col md={4} className="mb-3">
              <Form.Group controlId="Precio_Vent">
                <Form.Label>Precio_Vent</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio_Vent"
                  value={productoEditado?.Precio_Vent}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            
            </Col>
            
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!productoEditado?.nombre_producto?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;