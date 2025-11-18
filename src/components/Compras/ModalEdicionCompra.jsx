// src/components/Compras/ModalEdicionCompra.jsx
import { Modal, Button, Form, Table, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

const ModalEdicionCompra = ({ mostrar, setMostrar, compra }) => {
  // Solución: usamos useEffect para cargar los datos cuando "compra" cambia
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState("");
  const [detalles, setDetalles] = useState([]);

  // Este useEffect se ejecuta cada vez que abre el modal con una compra
  useEffect(() => {
    if (compra) {
      setProveedor(compra.Proveedor || "");
      setFecha(compra.Fecha_Compra || "");
      setDetalles(compra.detalles || []);
    }
  }, [compra]);

  const total = detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

  const guardar = () => {
    alert(`Compra editada: ${proveedor} - Total: C$ ${total.toFixed(2)}`);
    setMostrar(false);
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="xl">
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>Editar Compra #{compra?.ID_Compra}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {compra ? (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Detalles de la Compra</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">No hay detalles</td></tr>
                ) : (
                  detalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{d.cantidad}</td>
                      <td>C$ {d.precio_unitario.toFixed(2)}</td>
                      <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                  <td><strong>C$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </>
        ) : (
          <p className="text-center">Cargando compra...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="warning" onClick={guardar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;