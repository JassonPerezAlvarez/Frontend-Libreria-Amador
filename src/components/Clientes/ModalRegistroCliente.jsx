// src/components/Clientes/ModalRegistroCliente.jsx
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroCliente = ({
  show,
  onHide,
  onGuardar,
  clienteEditar,
  soloLectura = false,
  titulo = "Registrar Cliente",
}) => {
  const [formData, setFormData] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Cedula: "",
    Contacto: "",
    Direccion: "",
  });

  // CARGAR DATOS AL ABRIR
  useEffect(() => {
    if (show && clienteEditar) {
      setFormData({
        Primer_Nombre: clienteEditar.Primer_Nombre || "",
        Segundo_Nombre: clienteEditar.Segundo_Nombre || "",
        Primer_Apellido: clienteEditar.Primer_Apellido || "",
        Segundo_Apellido: clienteEditar.Segundo_Apellido || "",
        Cedula: clienteEditar.Cedula || "",
        Contacto: clienteEditar.Contacto || "",
        Direccion: clienteEditar.Direccion || "",
      });
    } else if (show && !clienteEditar) {
      setFormData({
        Primer_Nombre: "",
        Segundo_Nombre: "",
        Primer_Apellido: "",
        Segundo_Apellido: "",
        Cedula: "",
        Contacto: "",
        Direccion: "",
      });
    }
  }, [clienteEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>Primer Nombre</Form.Label>
              <Form.Control
                name="Primer_Nombre"
                value={formData.Primer_Nombre}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Segundo Nombre</Form.Label>
              <Form.Control
                name="Segundo_Nombre"
                value={formData.Segundo_Nombre}
                onChange={handleChange}
                disabled={soloLectura}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Primer Apellido</Form.Label>
              <Form.Control
                name="Primer_Apellido"
                value={formData.Primer_Apellido}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Segundo Apellido</Form.Label>
              <Form.Control
                name="Segundo_Apellido"
                value={formData.Segundo_Apellido}
                onChange={handleChange}
                disabled={soloLectura}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Cédula</Form.Label>
              <Form.Control
                name="Cedula"
                value={formData.Cedula}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                name="Contacto"
                value={formData.Contacto}
                onChange={handleChange}
                disabled={soloLectura}
              />
            </div>
            <div className="col-12">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                name="Direccion"
                value={formData.Direccion}
                onChange={handleChange}
                disabled={soloLectura}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
          {!soloLectura && (
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroCliente;