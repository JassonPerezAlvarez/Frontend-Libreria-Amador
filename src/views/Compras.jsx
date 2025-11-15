import { useState } from "react";
import { Container, Button, Table, Modal, Form } from "react-bootstrap";

const Compras = () => {
  const [compras, setCompras] = useState([
    { 
      id: 1, 
      fecha: "05/01/2025", 
      proveedor: "Carlos Ruiz", 
      total: 105.00,
      detalles: [
        { producto: "Libro Matemáticas", cantidad: 10, precio: 10.50 }
      ]
    },
    { 
      id: 2, 
      fecha: "10/01/2025", 
      proveedor: "Laura Vargas", 
      total: 60.00,
      detalles: [
        { producto: "Lápiz HB", cantidad: 100, precio: 0.10 },
        { producto: "Borrador", cantidad: 50, precio: 0.15 }
      ]
    },
  ]);

  // MODAL REGISTRAR
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState("");
  const [nuevoTotal, setNuevoTotal] = useState("");

  // MODAL EDITAR
  const [showEditar, setShowEditar] = useState(false);
  const [compraEditar, setCompraEditar] = useState(null);

  // MODAL ELIMINAR
  const [showEliminar, setShowEliminar] = useState(false);
  const [compraEliminar, setCompraEliminar] = useState(null);

  // MODAL DETALLE
  const [showDetalle, setShowDetalle] = useState(false);
  const [compraDetalle, setCompraDetalle] = useState(null);

  // REGISTRAR
  const abrirRegistrar = () => setShowRegistrar(true);
  const cerrarRegistrar = () => {
    setShowRegistrar(false);
    setNuevaFecha("");
    setNuevoProveedor("");
    setNuevoTotal("");
  };

  const guardarNueva = () => {
    if (!nuevaFecha || !nuevoProveedor || !nuevoTotal) return;
    const nueva = {
      id: compras.length + 1,
      fecha: nuevaFecha,
      proveedor: nuevoProveedor,
      total: parseFloat(nuevoTotal),
      detalles: []
    };
    setCompras([...compras, nueva]);
    cerrarRegistrar();
  };

  // EDITAR
  const abrirEditar = (c) => {
    setCompraEditar({ ...c });
    setShowEditar(true);
  };

  const guardarEdicion = () => {
    setCompras(compras.map(c => c.id === compraEditar.id ? compraEditar : c));
    setShowEditar(false);
  };

  // ELIMINAR
  const abrirEliminar = (c) => {
    setCompraEliminar(c);
    setShowEliminar(true);
  };

  const confirmarEliminar = () => {
    setCompras(compras.filter(c => c.id !== compraEliminar.id));
    setShowEliminar(false);
  };

  // DETALLE
  const abrirDetalle = (c) => {
    setCompraDetalle(c);
    setShowDetalle(true);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">Gestión de Compras</h2>
        <Button variant="success" size="lg" onClick={abrirRegistrar}>
          + Nueva Compra
        </Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.fecha}</td>
              <td>{c.proveedor}</td>
              <td>${c.total.toFixed(2)}</td>
              <td>
                <Button variant="info" size="sm" className="me-1" onClick={() => abrirDetalle(c)}>
                  Ver
                </Button>
                <Button variant="warning" size="sm" className="me-1" onClick={() => abrirEditar(c)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => abrirEliminar(c)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL REGISTRAR */}
      <Modal show={showRegistrar} onHide={cerrarRegistrar}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Nueva Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="text" placeholder="dd/mm/aaaa" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor</Form.Label>
              <Form.Control type="text" value={nuevoProveedor} onChange={e => setNuevoProveedor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total</Form.Label>
              <Form.Control type="number" step="0.01" value={nuevoTotal} onChange={e => setNuevoTotal(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarRegistrar}>Cancelar</Button>
          <Button variant="success" onClick={guardarNueva}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal show={showEditar} onHide={() => setShowEditar(false)}>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Editar Compra #{compraEditar?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {compraEditar && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="text" value={compraEditar.fecha} onChange={e => setCompraEditar({ ...compraEditar, fecha: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Proveedor</Form.Label>
                <Form.Control type="text" value={compraEditar.proveedor} onChange={e => setCompraEditar({ ...compraEditar, proveedor: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control type="number" step="0.01" value={compraEditar.total} onChange={e => setCompraEditar({ ...compraEditar, total: parseFloat(e.target.value) })} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditar(false)}>Cancelar</Button>
          <Button variant="warning" onClick={guardarEdicion}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={showEliminar} onHide={() => setShowEliminar(false)} size="sm" centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>¿Eliminar compra de <strong>{compraEliminar?.proveedor}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEliminar(false)}>No</Button>
          <Button variant="danger" onClick={confirmarEliminar}>Sí</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DETALLE */}
      <Modal show={showDetalle} onHide={() => setShowDetalle(false)} size="lg">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Detalle de Compra #{compraDetalle?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {compraDetalle && (
            <>
              <p><strong>Fecha:</strong> {compraDetalle.fecha}</p>
              <p><strong>Proveedor:</strong> {compraDetalle.proveedor}</p>
              <p><strong>Total:</strong> ${compraDetalle.total.toFixed(2)}</p>

              <h5 className="mt-4">Productos Comprados</h5>
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {compraDetalle.detalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.producto}</td>
                      <td>{d.cantidad}</td>
                      <td>${d.precio.toFixed(2)}</td>
                      <td>${(d.cantidad * d.precio).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalle(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Compras;