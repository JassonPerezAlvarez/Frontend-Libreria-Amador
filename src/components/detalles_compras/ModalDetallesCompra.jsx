// src/components/detalles_compras/ModalDetallesCompra.jsx
import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, compra, detalles }) => {
  // Si no hay detalles o está vacío
  const hayDetalles = detalles && detalles.length > 0;

  // Cálculo seguro del total
  const totalCompra = hayDetalles
    ? detalles.reduce((sum, item) => {
        const cantidad = Number(item.cantidad) || 0;
        const precio = Number(item.precio_unitario) || 0;
        return sum + cantidad * precio;
      }, 0)
    : 0;

  const handleClose = () => setMostrarModal(false);

  return (
    <Modal show={mostrarModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>
          Detalles de la Compra #{compra?.ID_Compra || "..."}
          {compra?.Proveedor && ` - ${compra.Proveedor}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Información adicional de la compra */}
        {compra && (
          <div className="mb-4 p-3 bg-light rounded">
            <small className="text-muted">Información general</small>
            <div className="d-flex flex-wrap gap-4 mt-2">
              <div>
                <strong>Proveedor:</strong> {compra.Proveedor || "No especificado"}
              </div>
              <div>
                <strong>Fecha:</strong>{" "}
                {compra.Fecha_Compra
                  ? new Date(compra.Fecha_Compra).toLocaleDateString("es-NI")
                  : "No disponible"}
              </div>
            </div>
          </div>
        )}

        {hayDetalles ? (
          <Table striped bordered hover responsive className="table-sm">
            <thead className="table-info">
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Precio Unitario</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item, index) => {
                const cantidad = Number(item.cantidad) || 0;
                const precio = Number(item.precio_unitario) || 0;
                const subtotal = cantidad * precio;

                return (
                  <tr key={item.ID_Detalle || item.id || index}>
                    <td className="text-muted small">{index + 1}</td>
                    <td className="fw-medium">
                      {item.nombre_producto || item.producto || "Sin nombre"}
                    </td>
                    <td className="text-center">{cantidad}</td>
                    <td className="text-end">
                      C$ {precio.toFixed(2)}
                    </td>
                    <td className="text-end fw-bold text-success">
                      C$ {subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="table-warning">
                <td colSpan={4} className="text-end fw-bold fs-5">
                  TOTAL:
                </td>
                <td className="text-end fw-bold fs-5 text-primary">
                  C$ {totalCompra.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </Table>
        ) : (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No hay detalles disponibles para esta compra.</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;