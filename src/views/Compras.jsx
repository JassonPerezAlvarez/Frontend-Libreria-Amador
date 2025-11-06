// src/views/Compras.jsx
import { Container, Button } from "react-bootstrap";
import TablaCompras from "../components/Compras/TablaCompras";

const Compras = () => {
  // Datos de ejemplo (simula tu base de datos)
  const compras = [
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

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Compras</h2>
        <Button variant="success">+ Nueva Compra</Button>
      </div>
      <TablaCompras compras={compras} cargando={false} />
    </Container>
  );
};

export default Compras;