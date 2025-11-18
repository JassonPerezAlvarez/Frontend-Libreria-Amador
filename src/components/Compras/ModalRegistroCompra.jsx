import { useState } from "react";
import { Modal, Button, Form, Table, Row, Col } from 'react-bootstrap';

const ModalRegistroCompra = ({ mostrar, setMostrar }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [proveedor, setProveedor] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [productoInput, setProductoInput] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Productos simulados (en tu grupal puedes conectar al backend después)
  const productosDisponibles = [
    { id: 1, nombre: "Libro Matemáticas", precio: 10.50, stock: 100 },
    { id: 2, nombre: "Lápiz HB", precio: 0.10, stock: 500 },
    { id: 3, nombre: "Borrador", precio: 0.15, stock: 300 },
  ];

  const agregarProducto = () => {
    if (!productoInput || !cantidad || cantidad <= 0) {
      alert("Selecciona un producto y una cantidad válida");
      return;
    }

    const producto = productosDisponibles.find(p => p.id === parseInt(productoInput));
    if (!producto) return;

    setDetalles([...detalles, {
      nombre_producto: producto.nombre,
      cantidad: parseInt(cantidad),
      precio_unitario: producto.precio
    }]);

    setProductoInput('');
    setCantidad('');
  };

  const total = detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

  const guardar = () => {
    if (!proveedor || detalles.length === 0) {
      alert("Debes ingresar proveedor y al menos un producto");
      return;
    }
    alert(`Compra registrada por C$ ${total.toFixed(2)}`);
    setMostrar(false);
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="xl">
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Proveedor</Form.Label>
              <Form.Control
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                placeholder="Nombre del proveedor"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h5>Agregar Producto</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Select value={productoInput} onChange={(e) => setProductoInput(e.target.value)}>
              <option value="">Seleccionar producto...</option>
              {productosDisponibles.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} - C$ {p.precio}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
            />
          </Col>
          <Col md={3}>
            <Button variant="success" onClick={agregarProducto} style={{width: '100%'}}>
              Agregar
            </Button>
          </Col>
        </Row>

        {detalles.length > 0 && (
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, i) => (
                <tr key={i}>
                  <td>{d.nombre_producto}</td>
                  <td>{d.cantidad}</td>
                  <td>C$ {d.precio_unitario.toFixed(2)}</td>
                  <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => setDetalles(detalles.filter((_, idx) => idx !== i))}>
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="success" onClick={guardar}>Guardar Compra</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;