// src/views/Clientes.jsx
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaClientes from "../components/Clientes/TablaClientes";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/Clientes/ModalRegistroCliente";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Cargar datos simulados
  useEffect(() => {
    setTimeout(() => {
      const datosSimulados = [
        {
          ID_Cliente: 1,
          Primer_Nombre: "Geme1",
          Segundo_Nombre: "JJ",
          Primer_Apellido: "Gómez",
          Segundo_Apellido: "Ruiz",
          Cedula: "1234567891",
          Contacto: "57917648",
          Direccion: "Rio San Juan",
        },
        {
          ID_Cliente: 2,
          Primer_Nombre: "Jasson",
          Segundo_Nombre: null,
          Primer_Apellido: "Pérez",
          Segundo_Apellido: "Álvarez",
          Cedula: "9876543210",
          Contacto: "88889999",
          Direccion: "Managua",
        },
      ];
      setClientes(datosSimulados);
      setClientesFiltrados(datosSimulados);
      setCargando(false);
    }, 800);
  }, []);

  // Búsqueda
  useEffect(() => {
    const texto = textoBusqueda.toLowerCase().trim();
    if (!texto) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtrados = clientes.filter((c) => {
      const nombreCompleto = [
        c.Primer_Nombre,
        c.Segundo_Nombre,
        c.Primer_Apellido,
        c.Segundo_Apellido,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        c.Cedula.includes(texto) ||
        c.Contacto.includes(texto) ||
        c.Direccion.toLowerCase().includes(texto)
      );
    });
    setClientesFiltrados(filtrados);
  }, [textoBusqueda, clientes]);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Guardar nuevo cliente
  const guardarCliente = (nuevo) => {
    const nuevoCliente = {
      ID_Cliente: clientes.length + 1,
      ...nuevo,
    };
    const nuevaLista = [...clientes, nuevoCliente];
    setClientes(nuevaLista);
    setClientesFiltrados(nuevaLista);
  };

  return (
    <Container className="mt-4">
      {/* Título + Botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Clientes</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Nuevo Cliente
        </Button>
      </div>

      {/* Búsqueda */}
      <Row className="mb-3">
        <Col lg={6} md={8} sm={10} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {/* Tabla */}
      <TablaClientes clientes={clientesFiltrados} cargando={cargando} />

      {/* Modal */}
      <ModalRegistroCliente
        show={showModal}
        onHide={() => setShowModal(false)}
        onGuardar={guardarCliente}
      />
    </Container>
  );
};

export default Clientes;