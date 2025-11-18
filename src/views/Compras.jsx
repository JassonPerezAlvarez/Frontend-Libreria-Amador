// src/views/Compras.jsx
import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalDetallesCompra from "../components/detalles_compras/ModalDetallesCompra";
import ModalRegistroCompra from "../components/compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/compras/ModalEdicionCompra";
import ModalEliminacionCompra from "../components/compras/ModalEliminacionCompra";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [showDetalle, setShowDetalle] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showEdicion, setShowEdicion] = useState(false);
  const [showEliminacion, setShowEliminacion] = useState(false);

  const [detallesCompra, setDetallesCompra] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const API = "http://localhost:3000/api";

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`${API}/compras`);
        const comprasCrudas = res.data;

        const comprasListas = await Promise.all(
          comprasCrudas.map(async (c) => {
            // 1. ENCONTRAR EL ID (da igual cómo se llame)
            const id =
              c.ID_Compra || c.id_compra || c.idCompra || c.id || c._id || c.Id_Compra;

            // 2. BUSCAR DETALLES (si falla, no pasa nada)
            let detalles = [];
            try {
              const det = await axios.get(`${API}/compras/${id}/detalles`);
              detalles = det.data;
            } catch (e) {
              console.log("No hay detalles para compra", id);
            }

            // 3. SI FALTA PROVEEDOR O TOTAL → LO BUSCAMOS (opcional, pero queda bonito)
            let proveedor = c.Proveedor;
            let total = c.Total_Compra;

            if (!proveedor && c.ID_Proveedor) {
              try {
                const prov = await axios.get(`${API}/proveedores/${c.ID_Proveedor}`);
                proveedor = `${prov.data.Primer_Nombre} ${prov.data.Primer_Apellido}`;
              } catch {}
            }

            return {
              ...c,
              ID_Compra: id,
              Proveedor: proveedor || "Proveedor no encontrado",
              Total_Compra: total || 0,
              detalles,
            };
          })
        );

        setCompras(comprasListas);
        setComprasFiltradas(comprasListas);
      } catch (err) {
        console.error(err);
        alert("ERROR: Backend apagado o ruta mala");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // Búsqueda
  useEffect(() => {
    if (!textoBusqueda) {
      setComprasFiltradas(compras);
    } else {
      setComprasFiltradas(
        compras.filter((c) =>
          c.ID_Compra?.toString().includes(textoBusqueda) ||
          c.Proveedor?.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
          c.Fecha_Compra?.includes(textoBusqueda)
        )
      );
    }
  }, [textoBusqueda, compras]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">Gestión de Compras</h2>
        <Button variant="success" size="lg" onClick={() => setShowRegistro(true)}>
          + Nueva Compra
        </Button>
      </div>

      <Row className="mb-4">
        <Col lg={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {cargando ? (
        <Alert variant="info">Cargando compras...</Alert>
      ) : (
        <TablaCompras
          compras={comprasFiltradas}
          cargando={cargando}
          onVerDetalle={(c) => {
            setDetallesCompra(c.detalles);
            setShowDetalle(true);
          }}
          onEditar={(c) => {
            setCompraSeleccionada(c);
            setShowEdicion(true);
          }}
          onEliminar={(c) => {
            setCompraSeleccionada(c);
            setShowEliminacion(true);
          }}
        />
      )}

      <ModalDetallesCompra mostrarModal={showDetalle} setMostrarModal={setShowDetalle} detalles={detallesCompra} />
      <ModalRegistroCompra mostrar={showRegistro} setMostrar={setShowRegistro} />
      <ModalEdicionCompra mostrar={showEdicion} setMostrar={setShowEdicion} compra={compraSeleccionada} />
      <ModalEliminacionCompra mostrar={showEliminacion} setMostrar={setShowEliminacion} compra={compraSeleccionada} />
    </Container>
  );
};

export default Compras;