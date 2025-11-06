// src/components/Clientes/ModalRegistroCliente.jsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroCliente = ({ show, onHide, onGuardar }) => {
  const [formData, setFormData] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Cedula: "",
    Contacto: "",
    Direccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoCliente = {
      ...formData,
      Segundo_Nombre: formData.Segundo_Nombre || null,
      Segundo_Apellido: formData.Segundo_Apellido || null,
    };
    onGuardar(nuevoCliente);
    onHide();
    setFormData({
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Cedula: "",
      Contacto: "",
      Direccion: "",
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Primer_Nombre"
              value={formData.Primer_Nombre}
              onChange={handleChange}
              placeholder="Ej. Juan"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Segundo Nombre (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="Segundo_Nombre"
              value={formData.Segundo_Nombre}
              onChange={handleChange}
              placeholder="Ej. Carlos"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Primer_Apellido"
              value={formData.Primer_Apellido}
              onChange={handleChange}
              placeholder="Ej. Pérez"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Segundo Apellido (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="Segundo_Apellido"
              value={formData.Segundo_Apellido}
              onChange={handleChange}
              placeholder="Ej. Gómez"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="Cedula"
              value={formData.Cedula}
              onChange={handleChange}
              placeholder="000-000000-0000N"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="Contacto"
              value={formData.Contacto}
              onChange={handleChange}
              placeholder="8888-9999"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={formData.Direccion}
              onChange={handleChange}
              placeholder="Barrio, ciudad..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="success" type="submit">
            Guardar Cliente
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroCliente;