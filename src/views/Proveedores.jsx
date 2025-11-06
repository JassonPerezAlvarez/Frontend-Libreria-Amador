// src/views/Proveedores.jsx
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaProveedores from "../components/Proveedores/TablaProveedores";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProveedores([
        {
          ID_Proveedor: 1,
          Primer_Nombre: "jasson", Segundo_Nombre: null,
          Primer_Apellido: "Perez", Segundo_Apellido: null,
          Contacto: "57917648", Correo: "jassongeme23j@gmail.com"
        },
        {
          ID_Proveedor: 2,
          Primer_Nombre: "Jeyson", Segundo_Nombre: "JR",
          Primer_Apellido: "", Segundo_Apellido: "",
          Contacto: "57917648", Correo: "jassongeme23@gmail.com"
        },
      ]);
      setCargando(false);
    }, 800);
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary fw-bold">Gestión de Proveedores</h2>
      <TablaProveedores proveedores={proveedores} cargando={cargando} />
    </Container>
  );
};

export default Proveedores;