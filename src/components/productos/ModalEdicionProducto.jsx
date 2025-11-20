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
              <Form.Group controlId="Nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={productoEditado?.Nombre ?? ""}
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
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="Descripcion"
                  value={productoEditado?.Descripcion ?? ""}
                  onChange={manejarCambio}
                  placeholder="Descripción"
                  maxLength={300}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="mb-3">
              <Form.Group controlId="Cantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="Cantidad"
                  value={productoEditado?.Cantidad ?? 0}
                  onChange={manejarCambio}
                  placeholder="0"
                />
              </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Group controlId="Precio_Comp">
                <Form.Label>Precio Compra</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio_Comp"
                  value={productoEditado?.Precio_Comp ?? 0}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Group controlId="Precio_Vent">
                <Form.Label>Precio Venta</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio_Vent"
                  value={productoEditado?.Precio_Vent ?? 0}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group className="mb-3" controlId="formImagenProducto">
                <Form.Label>Imagen</Form.Label>
                {productoEditado?.imagen && (
                  <div>
                    <img
                      src={`data:image/png;base64,${productoEditado.imagen}`}
                      alt="Imagen actual"
                      style={{ maxWidth: '100px', marginBottom: '10px' }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        manejarCambio({
                          target: { name: 'imagen', value: reader.result.split(',')[1] }
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!productoEditado?.Nombre?.toString().trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;