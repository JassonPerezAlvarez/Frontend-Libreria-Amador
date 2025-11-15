import { Modal, Table, Button } from "react-bootstrap";

const DetalleCompraModal = ({ show, compra, onHide }) => {
  if (!compra) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Detalle de Compra #{compra.ID_Compra}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha:</strong> {new Date(compra.Fecha_Compra).toLocaleDateString()}</p>
        <p><strong>Proveedor:</strong> {compra.Proveedor}</p>
        <p><strong>Total:</strong> ${compra.Total_Compra?.toFixed(2)}</p>

        <h5 className="mt-4">Productos</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {compra.detalles?.map((d, i) => (
              <tr key={i}>
                <td>{d.Nombre_Producto}</td>
                <td>{d.Cantidad_Com}</td>
                <td>${d.Precio_Com?.toFixed(2)}</td>
                <td>${(d.Cantidad_Com * d.Precio_Com).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleCompraModal;