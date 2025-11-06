// src/views/Compras.jsx
import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import TablaCompras from "../components/Compras/TablaCompras";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Compras = () => {
  // Datos de ejemplo
  const comprasOriginales = [
    {
      ID_Compra: 1,
      Fecha_Compra: "2025-03-15",
      Proveedor_Nombre: "Editorial Norma",
      Empleado_Nombre: "Ana Gómez",
      Total_Compra: 125000.50
    },
    {
      ID_Compra: 2,
      Fecha_Compra: "2025-03-20",
      Proveedor_Nombre: "Librería Nacional",
      Empleado_Nombre: "Luis Pérez",
      Total_Compra: 98000.00
    },
    {
      ID_Compra: 3,
      Fecha_Compra: "2025-04-01",
      Proveedor_Nombre: "Distribuidora Sur",
      Empleado_Nombre: "Ana Gómez",
      Total_Compra: 210000.75
    }
  ];

  // Estado para búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Función de manejo
  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Filtrar compras
  const comprasFiltradas = comprasOriginales.filter(compra =>
    compra.ID_Compra.toString().includes(textoBusqueda) ||
    compra.Proveedor_Nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
    compra.Empleado_Nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
    compra.Fecha_Compra.includes(textoBusqueda)
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Compras</h2>
        <Button variant="success">+ Nueva Compra</Button>
      </div>

      {/* Cuadro de búsqueda */}
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />

      {/* Tabla con datos filtrados */}
      <TablaCompras compras={comprasFiltradas} cargando={false} />
    </Container>
  );
};

export default Compras;