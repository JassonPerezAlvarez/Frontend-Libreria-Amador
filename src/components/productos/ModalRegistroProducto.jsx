import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="Nombre">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={nuevoProducto.Nombre}
                  onChange={manejarCambioInput}
                  placeholder="Ej: Libro "
                  maxLength={100}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="Descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="Descripcion"
                  value={nuevoProducto.Descripcion}
                  onChange={manejarCambioInput}
                  placeholder="Descripción del producto"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="Cantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="Cantidad"
                  value={nuevoProducto.Cantidad}
                  onChange={manejarCambioInput}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="Precio_Comp">
                <Form.Label>Precio de Compra</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio_Comp"
                  value={nuevoProducto.Precio_Comp}
                  onChange={manejarCambioInput}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="Precio_Vent">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Precio_Vent"
              value={nuevoProducto.Precio_Vent}
              onChange={manejarCambioInput}
              placeholder="Descripción opcional (máx. 300 caracteres)"
              maxLength={300}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarProducto}
          disabled={!nuevoProducto.Nombre?.trim()}
        >
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;