// src/views/Proveedores.jsx
import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import TablaProveedores from "../components/Proveedores/TablaProveedores";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Proveedores = () => {
  const [proveedoresOriginales, setProveedoresOriginales] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const datos = [
        {
          ID_Proveedor: 1,
          Primer_Nombre: "jasson",
          Segundo_Nombre: null,
          Primer_Apellido: "Perez",
          Segundo_Apellido: null,
          Contacto: "57917648",
          Correo: "jassongeme23j@gmail.com"
        },
        {
          ID_Proveedor: 2,
          Primer_Nombre: "Jeyson",
          Segundo_Nombre: "JR",
          Primer_Apellido: "",
          Segundo_Apellido: "",
          Contacto: "57917648",
          Correo: "jassongeme23@gmail.com"
        },
      ];
      setProveedoresOriginales(datos);
      setProveedoresFiltrados(datos);
      setCargando(false);
    }, 800);
  }, []);

  useEffect(() => {
    const busqueda = textoBusqueda.toLowerCase().trim();
    if (!busqueda) {
      setProveedoresFiltrados(proveedoresOriginales);
      return;
    }

    const filtrados = proveedoresOriginales.filter(p => {
      const nombreCompleto = [
        p.Primer_Nombre,
        p.Segundo_Nombre,
        p.Primer_Apellido,
        p.Segundo_Apellido
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        nombreCompleto.includes(busqueda) ||
        p.Contacto.includes(busqueda) ||
        p.Correo.toLowerCase().includes(busqueda)
      );
    });

    setProveedoresFiltrados(filtrados);
  }, [textoBusqueda, proveedoresOriginales]);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Proveedores</h2>
        <Button variant="success">+ Nuevo Proveedor</Button>
      </div>

      {/* Cuadro de búsqueda */}
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />

      {/* Tabla con datos filtrados */}
      <TablaProveedores proveedores={proveedoresFiltrados} cargando={cargando} />
    </Container>
  );
};

export default Proveedores;