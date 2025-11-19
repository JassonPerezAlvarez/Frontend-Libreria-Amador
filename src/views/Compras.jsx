// src/views/Compras.jsx
import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

import TablaCompras from "../components/Compras/TablaCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalDetallesCompra from "../components/detalles_compras/ModalDetallesCompra";
import ModalRegistroCompra from "../components/Compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/Compras/ModalEdicionCompra";
import ModalEliminacionCompra from "../components/Compras/ModalEliminacionCompra";

const Compras = () => {
  // Estados
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Modales
  const [showDetalle, setShowDetalle] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showEdicion, setShowEdicion] = useState(false);
  const [showEliminacion, setShowEliminacion] = useState(false);

  // Datos seleccionados
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [detallesParaMostrar, setDetallesParaMostrar] = useState([]);

  const API = "/api";

  // Cargar todas las compras al montar el componente
  useEffect(() => {
    cargarCompras();
  }, []);

  // Filtrado por texto de búsqueda
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setComprasFiltradas(compras);
      return;
    }

    const texto = textoBusqueda.toLowerCase();
    const filtradas = compras.filter((c) => {
      return (
        String(c.ID_Compra).includes(texto) ||
        (c.Proveedor && c.Proveedor.toLowerCase().includes(texto)) ||
        (c.Fecha_Compra && c.Fecha_Compra.includes(texto))
      );
    });

    setComprasFiltradas(filtradas);
  }, [textoBusqueda, compras]);

  // Función principal para cargar compras + sus detalles
  const cargarCompras = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API}/compras`);
      const comprasCrudas = res.data;

      const comprasConDetalles = await Promise.all(
        comprasCrudas.map(async (compra) => {
          const id =
            compra.ID_Compra || compra.id_compra || compra.Id_Compra || compra.id;

          let detalles = [];
          try {
            const { data } = await axios.get(`${API}/compras/${id}/detalles`);
            detalles = data || [];
          } catch (err) {
            console.warn(`No se pudieron cargar detalles de la compra ${id}`, err);
          }
// 🟢 TOTAL CORREGIDO - sin errores de sintaxis
const totalCalculado = detalles.reduce((sum, d) => {
  // Intentar primero obtener el subtotal directamente
  let subtotal = d.Subtotal ?? d.subtotal;

  // Si no existe Subtotal, calcular con cantidad y precio
  if (subtotal == null) {
    const cantidad = d.Cantidad ?? d.cantidad ?? 0;
    const precio = d.Precio_Unitario ?? d.precioUnitario ?? 0;
    subtotal = cantidad * precio;
  }

  return sum + subtotal;
}, 0);


          return {
            ...compra,
            ID_Compra: id,
            detalles,
            Total_Compra: compra.Total_Compra || totalCalculado,
            Proveedor: compra.Proveedor || "Sin proveedor",
            Fecha_Compra:
              compra.Fecha_Compra?.split("T")[0] || compra.Fecha_Compra || "",
          };
        })
      );

      setCompras(comprasConDetalles);
      setComprasFiltradas(comprasConDetalles);
    } catch (err) {
      console.error("Error cargando compras:", err);
      alert("No se pudieron cargar las compras. Verifica el backend.");
    } finally {
      setCargando(false);
    }
  };

  // Handlers
  const handleNuevaCompra = (nuevaCompra) => {
    setCompras((prev) => [...prev, nuevaCompra]);
    setShowRegistro(false);
  };

  const handleActualizarCompra = (compraActualizada) => {
    setCompras((prev) =>
      prev.map((c) =>
        c.ID_Compra === compraActualizada.ID_Compra ? compraActualizada : c
      )
    );
    setShowEdicion(false);
  };

  const handleEliminarCompra = async () => {
    if (!compraSeleccionada) return;

    try {
      await axios.delete(`${API}/compras/${compraSeleccionada.ID_Compra}`);
      setCompras((prev) =>
        prev.filter((c) => c.ID_Compra !== compraSeleccionada.ID_Compra)
      );
      setShowEliminacion(false);
      setCompraSeleccionada(null);
    } catch (err) {
      console.error("Error al eliminar la compra:", err);
      alert("Error al eliminar la compra");
    }
  };

  return (
    <Container className="mt-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">Gestión de Compras</h2>
        <Button variant="success" size="lg" onClick={() => setShowRegistro(true)}>
          + Nueva Compra
        </Button>
      </div>

      {/* Buscador */}
      <Row className="mb-4">
        <Col lg={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {/* Estados de carga y tabla */}
      {cargando ? (
        <Alert variant="info" className="text-center">
          Cargando compras...
        </Alert>
      ) : compras.length === 0 ? (
        <Alert variant="warning">No hay compras registradas aún.</Alert>
      ) : (
        <TablaCompras
          compras={comprasFiltradas}
          onVerDetalle={(compra) => {
            setDetallesParaMostrar(compra.detalles);
            setCompraSeleccionada(compra);
            setShowDetalle(true);
          }}
          onEditar={(compra) => {
            setCompraSeleccionada(compra);
            setShowEdicion(true);
          }}
          onEliminar={(compra) => {
            setCompraSeleccionada(compra);
            setShowEliminacion(true);
          }}
        />
      )}

      {/* Modales */}
      <ModalDetallesCompra
        mostrarModal={showDetalle}
        setMostrarModal={setShowDetalle}
        compra={compraSeleccionada}
        detalles={detallesParaMostrar}
      />

      <ModalRegistroCompra
        mostrar={showRegistro}
        setMostrar={setShowRegistro}
        onSuccess={handleNuevaCompra}
      />

      <ModalEdicionCompra
        mostrar={showEdicion}
        setMostrar={setShowEdicion}
        compra={compraSeleccionada}
        onUpdate={handleActualizarCompra}
      />

      <ModalEliminacionCompra
        mostrar={showEliminacion}
        setMostrar={setShowEliminacion}
        compra={compraSeleccionada}
        onConfirm={handleEliminarCompra}
      />
    </Container>
  );
};

export default Compras;
