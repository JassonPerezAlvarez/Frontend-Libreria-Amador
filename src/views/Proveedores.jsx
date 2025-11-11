// src/views/Proveedores.jsx
import { useState, useEffect } from "react";
import { Container, Button, Pagination } from "react-bootstrap";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const porPagina = 6; // 6 por página

  // Obtener proveedores
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/proveedores");
        if (!respuesta.ok) throw new Error("Error al obtener los proveedores");
        const datos = await respuesta.json();
        setProveedores(datos);
        setProveedoresFiltrados(datos);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProveedores();
  }, []);

  // Filtrar por búsqueda
  useEffect(() => {
    const busqueda = textoBusqueda.toLowerCase().trim();
    if (!busqueda) {
      setProveedoresFiltrados(proveedores);
      return;
    }

    const filtrados = proveedores.filter((p) => {
      const nombreCompleto = [
        p.Primer_Nombre,
        p.Segundo_Nombre,
        p.Primer_Apellido,
        p.Segundo_Apellido,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        nombreCompleto.includes(busqueda) ||
        p.Contacto?.toLowerCase().includes(busqueda) ||
        p.Correo?.toLowerCase().includes(busqueda)
      );
    });

    setProveedoresFiltrados(filtrados);
    setPagina(1); // Resetear a página 1 al buscar
  }, [textoBusqueda, proveedores]);

  // Paginación
  const totalPaginas = Math.ceil(proveedoresFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actuales = proveedoresFiltrados.slice(inicio, inicio + porPagina);

  return (
    <Container className="mt-4 pb-5">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Proveedores</h2>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4"
        >
          + Nuevo Proveedor
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="mb-3" style={{ maxWidth: "400px" }}>
        <CuadroBusquedas
          textoBusqueda={textoBusqueda}
          manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar por nombre, contacto o correo..."
        />
      </div>

      {/* Tabla con estilo */}
      <div className="border rounded shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-center">ID</th>
                <th>Nombre Completo</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : actuales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay proveedores registrados.
                  </td>
                </tr>
              ) : (
                actuales.map((p) => (
                  <tr key={p.ID_Proveedor}>
                    <td className="text-center fw-bold">{p.ID_Proveedor}</td>
                    <td>
                      {p.Primer_Nombre} {p.Segundo_Nombre || ""}{" "}
                      {p.Primer_Apellido} {p.Segundo_Apellido || ""}
                    </td>
                    <td>{p.Contacto || "-"}</td>
                    <td>{p.Correo || "-"}</td>
                    <td className="text-muted small">{p.Direccion || "-"}</td>
                    <td className="text-center">
                      <Button variant="outline-info" size="sm" className="me-1">
                        Ver
                      </Button>
                      <Button variant="outline-warning" size="sm" className="me-1">
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación fija abajo y centrada */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div className="text-muted small">
          Mostrando {inicio + 1} -{" "}
          {Math.min(inicio + porPagina, proveedoresFiltrados.length)} de{" "}
          {proveedoresFiltrados.length}
        </div>
        <Pagination size="sm">
          <Pagination.First
            onClick={() => setPagina(1)}
            disabled={pagina === 1}
          />
          <Pagination.Prev
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina === 1}
          />
          {[...Array(Math.min(totalPaginas, 5))].map((_, i) => {
            const numPagina = i + 1;
            return (
              <Pagination.Item
                key={numPagina}
                active={numPagina === pagina}
                onClick={() => setPagina(numPagina)}
              >
                {numPagina}
              </Pagination.Item>
            );
          })}
          {totalPaginas > 5 && (
            <>
              <Pagination.Ellipsis />
              <Pagination.Item
                active={pagina === totalPaginas}
                onClick={() => setPagina(totalPaginas)}
              >
                {totalPaginas}
              </Pagination.Item>
            </>
          )}
          <Pagination.Next
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
          />
          <Pagination.Last
            onClick={() => setPagina(totalPaginas)}
            disabled={pagina === totalPaginas}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default Proveedores;