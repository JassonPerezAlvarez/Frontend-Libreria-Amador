// src/views/Clientes.jsx
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaClientes from "../components/Clientes/TablaClientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setClientes([
        {
          ID_Cliente: 1,
          Primer_Nombre: "geme1", Segundo_Nombre: "jj",
          Primer_Apellido: "Gómez", Segundo_Apellido: "Ruiz",
          Cedula: "1234567891", Contacto: "57917648", Direccion: "Rio san juan"
        },
        {
          ID_Cliente: 2,
          Primer_Nombre: "Jasson", Segundo_Nombre: null,
          Primer_Apellido: "Pérez", Segundo_Apellido: "Alvares",
          Cedula: "1234567891", Contacto: "57917648", Direccion: "Rio san juan"
        },
      ]);
      setCargando(false);
    }, 800);
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary fw-bold">Gestión de Clientes</h2>
      <TablaClientes clientes={clientes} cargando={cargando} />
    </Container>
  );
};

export default Clientes;