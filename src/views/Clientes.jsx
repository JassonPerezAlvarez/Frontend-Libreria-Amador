// src/views/Clientes.jsx
import { useState, useEffect } from "react";
import { Container, Button, Pagination } from "react-bootstrap";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/Clientes/ModalRegistroCliente";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const porPagina = 6; // Cambiado a 6

  // Obtener clientes
  const obtenerClientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/clientes");
      if (!res.ok) throw new Error("Error al cargar clientes");
      const data = await res.json();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  // Filtrar
  useEffect(() => {
    const texto = textoBusqueda.toLowerCase().trim();
    if (!texto) {
      setClientesFiltrados(clientes);
      return;
    }
    const filtrados = clientes.filter((c) => {
      const nombre = [
        c.Primer_Nombre,
        c.Segundo_Nombre,
        c.Primer_Apellido,
        c.Segundo_Apellido,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        nombre.includes(texto) ||
        c.Cedula?.includes(texto) ||
        c.Contacto?.includes(texto)
      );
    });
    setClientesFiltrados(filtrados);
    setPagina(1);
  }, [textoBusqueda, clientes]);

  // Paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actuales = clientesFiltrados.slice(inicio, inicio + porPagina);

  const guardarCliente = async (nuevo) => {
    try {
      const res = await fetch("http://localhost:3000/api/RegistrarCliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) throw new Error("Error al guardar");
      obtenerClientes();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) obtenerClientes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-4 pb-5">
      {/* Título */}
      <h2 className="mb-4 fw-bold text-primary">Clientes</h2>

      {/* Búsqueda + Botón */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ width: "320px" }}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
            placeholder="Buscar por nombre, cédula, contacto..."
          />
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center gap-2 px-4"
        >
          + Nuevo Cliente
        </Button>
      </div>

      {/* Tabla */}
      <div className="border rounded shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-center">ID</th>
                <th>Nombre Completo</th>
                <th>Cédula</th>
                <th>Contacto</th>
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
                    No hay clientes registrados.
                  </td>
                </tr>
              ) : (
                actuales.map((c) => (
                  <tr key={c.ID_Cliente}>
                    <td className="text-center fw-bold">{c.ID_Cliente}</td>
                    <td>
                      {c.Primer_Nombre} {c.Segundo_Nombre || ""}{" "}
                      {c.Primer_Apellido} {c.Segundo_Apellido || ""}
                    </td>
                    <td>{c.Cedula || "-"}</td>
                    <td>{c.Contacto || "-"}</td>
                    <td className="text-muted small">{c.Direccion || "-"}</td>
                    <td className="text-center">
                      <Button variant="outline-info" size="sm" className="me-1">
                        Ver
                      </Button>
                      <Button variant="outline-warning" size="sm" className="me-1">
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarCliente(c.ID_Cliente)}
                      >
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

      {/* Paginación fija en la parte inferior y centrada */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">
            Mostrando {inicio + 1} -{" "}
            {Math.min(inicio + porPagina, clientesFiltrados.length)} de{" "}
            {clientesFiltrados.length}
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
      </div>

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