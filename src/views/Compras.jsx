import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import TablaCompras from "../components/Compras/TablaCompras";
import ModalRegistroCompra from "../components/Compras/ModalRegistroCompra";
import ModalEditarCompra from "../components/Compras/ModalEditarCompra";
import ModalEliminarCompra from "../components/Compras/ModalEliminarCompra";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [showRegistro, setShowRegistro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const obtenerCompras = async () => {
    setCargando(true);
    try {
      const res = await fetch("http://localhost:3000/api/compras");
      if (!res.ok) throw new Error("Error al cargar compras");
      const data = await res.json();
      setCompras(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const guardarCompra = async (nuevaCompra) => {
    try {
      const res = await fetch("http://localhost:3000/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCompra),
      });
      if (!res.ok) throw new Error("Error al guardar compra");
      setShowRegistro(false);
      obtenerCompras();
    } catch (error) {
      alert(error.message);
    }
  };

  const actualizarCompra = async (compraActualizada) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/compras/${compraSeleccionada.ID_Compra}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compraActualizada),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar compra");
      setShowEditar(false);
      setCompraSeleccionada(null);
      obtenerCompras();
    } catch (error) {
      alert(error.message);
    }
  };

  const eliminarCompra = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta compra?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/compras/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar compra");
      setShowEliminar(false);
      setCompraSeleccionada(null);
      obtenerCompras();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Compras</h2>
      <Button variant="primary" onClick={() => setShowRegistro(true)} className="mb-3">
        + Nueva Compra
      </Button>

      <TablaCompras
        compras={compras}
        cargando={cargando}
        onEditar={(compra) => {
          setCompraSeleccionada(compra);
          setShowEditar(true);
        }}
        onEliminar={(id) => {
          setCompraSeleccionada(compras.find((c) => c.ID_Compra === id));
          setShowEliminar(true);
        }}
      />

      <ModalRegistroCompra
        show={showRegistro}
        onHide={() => setShowRegistro(false)}
        onGuardar={guardarCompra}
      />

      <ModalEditarCompra
        show={showEditar}
        onHide={() => {
          setShowEditar(false);
          setCompraSeleccionada(null);
        }}
        compra={compraSeleccionada}
        onActualizar={actualizarCompra}
      />

      <ModalEliminarCompra
        show={showEliminar}
        onHide={() => {
          setShowEliminar(false);
          setCompraSeleccionada(null);
        }}
        compra={compraSeleccionada}
        onConfirmar={eliminarCompra}
      />
    </Container>
  );
};

export default Compras;