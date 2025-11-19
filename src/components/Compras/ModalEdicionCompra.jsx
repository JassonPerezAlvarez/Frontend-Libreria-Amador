// src/components/Compras/ModalEdicionCompra.jsx
import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Row,
  Col,
} from "react-bootstrap";

const ModalEdicionCompra = ({ mostrar, setMostrar, compra, onUpdate }) => {
  // Estados locales del formulario
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState("");
  const [detalles, setDetalles] = useState([]);

  // Cargar datos cuando cambia la compra seleccionada
  useEffect(() => {
    if (compra) {
      setProveedor(compra.Proveedor || "");
      setFecha(compra.Fecha_Compra?.split("T")[0] || "");

      const detallesPreparados = (compra.detalles || []).map((d) => ({
        id: d.ID_Detalle || d.id || Date.now() + Math.random(), // clave única
        nombre_producto: d.nombre_producto || d.producto || "Producto sin nombre",
        cantidad: Number(d.cantidad) || 1,
        precio_unitario: Number(d.precio_unitario) || 0,
      }));

      setDetalles(detallesPreparados);
    }
  }, [compra]);

  // Calcular total general
  const total = detalles.reduce(
    (sum, d) => sum + d.cantidad * d.precio_unitario,
    0
  );

  // Actualizar un campo específico de un detalle
  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][campo] = campo === "cantidad" ? Math.max(1, Number(valor)) : Number(valor) || 0;
    setDetalles(nuevosDetalles);
  };

  // Eliminar un detalle de la lista
  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  // Guardar cambios y notificar al componente padre
  const guardarCambios = () => {
    if (!compra) return;

    const compraActualizada = {
      ...compra,
      Proveedor: proveedor.trim(),
      Fecha_Compra: fecha,
      Total_Compra: total,
      detalles: detalles.map((d) => ({
        ...d,
        subtotal: d.cantidad * d.precio_unitario,
      })),
    };

    onUpdate(compraActualizada);
    setMostrar(false);
  };

  const handleClose = () => setMostrar(false);

  return (
    <Modal show={mostrar} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>Editar Compra #{compra?.ID_Compra}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {compra ? (
          <>
            {/* Proveedor y Fecha */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="proveedor">
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
                <Form.Group controlId="fecha">
                  <Form.Label>Fecha de Compra</Form.Label>
                  <Form.Control
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tabla de detalles */}
            <h5 className="mb-3">Detalles de Productos</h5>

            <Table striped bordered hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th style={{ width: "120px" }}>Cantidad</th>
                  <th style={{ width: "160px" }}>Precio Unitario</th>
                  <th style={{ width: "130px" }}>Subtotal</th>
                  <th style={{ width: "80px" }}>Acción</th>
                </tr>
              </thead>

              <tbody>
                {detalles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No hay productos en esta compra
                    </td>
                  </tr>
                ) : (
                  detalles.map((detalle, i) => (
                    <tr key={detalle.id}>
                      <td className="align-middle">
                        {detalle.nombre_producto}
                      </td>

                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={detalle.cantidad}
                          onChange={(e) =>
                            actualizarDetalle(i, "cantidad", e.target.value)
                          }
                          style={{ width: "100px" }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          value={detalle.precio_unitario}
                          onChange={(e) =>
                            actualizarDetalle(
                              i,
                              "precio_unitario",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td className="align-middle text-end">
                        C$ {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                      </td>

                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarDetalle(i)}
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    TOTAL:
                  </td>
                  <td className="fw-bold text-end">
                    C$ {total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>

            {/* Opción futura para agregar productos nuevos */}
            {/* <Button variant="outline-success" size="sm" className="mt-2">
              + Agregar Producto
            </Button> */}
          </>
        ) : (
          <p className="text-center text-muted">Cargando datos de la compra...</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="warning" onClick={guardarCambios}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;