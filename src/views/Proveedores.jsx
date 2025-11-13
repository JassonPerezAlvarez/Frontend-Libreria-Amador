// src/views/Proveedores.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Button,
  Pagination,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

// === MODAL INTERNO ===
const ModalProveedor = ({ show, onHide, proveedor, esEdicion, onGuardar }) => {
  const [formData, setFormData] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Contacto: "",
    Correo: "",
    Direccion: "",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (proveedor) {
      setFormData({
        Primer_Nombre: proveedor.Primer_Nombre || "",
        Segundo_Nombre: proveedor.Segundo_Nombre || "",
        Primer_Apellido: proveedor.Primer_Apellido || "",
        Segundo_Apellido: proveedor.Segundo_Apellido || "",
        Contacto: proveedor.Contacto || "",
        Correo: proveedor.Correo || "",
        Direccion: proveedor.Direccion || "",
      });
    } else {
      setFormData({
        Primer_Nombre: "",
        Segundo_Nombre: "",
        Primer_Apellido: "",
        Segundo_Apellido: "",
        Contacto: "",
        Correo: "",
        Direccion: "",
      });
    }
    setErrores({});
  }, [proveedor, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.Primer_Nombre.trim()) nuevosErrores.Primer_Nombre = "Requerido";
    if (!formData.Primer_Apellido.trim()) nuevosErrores.Primer_Apellido = "Requerido";
    if (!formData.Contacto.trim()) nuevosErrores.Contacto = "Requerido";
    if (!formData.Correo.trim()) nuevosErrores.Correo = "Requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.Correo)) nuevosErrores.Correo = "Correo inválido";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    onGuardar(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {esEdicion
            ? proveedor
              ? "Editar Proveedor"
              : "Nuevo Proveedor"
            : "Detalles del Proveedor"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>Primer Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="Primer_Nombre"
                value={formData.Primer_Nombre}
                onChange={handleChange}
                disabled={!esEdicion}
                isInvalid={!!errores.Primer_Nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errores.Primer_Nombre}
              </Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Segundo Nombre</Form.Label>
              <Form.Control
                type="text"
                name="Segundo_Nombre"
                value={formData.Segundo_Nombre}
                onChange={handleChange}
                disabled={!esEdicion}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Primer Apellido *</Form.Label>
              <Form.Control
                type="text"
                name="Primer_Apellido"
                value={formData.Primer_Apellido}
                onChange={handleChange}
                disabled={!esEdicion}
                isInvalid={!!errores.Primer_Apellido}
              />
              <Form.Control.Feedback type="invalid">
                {errores.Primer_Apellido}
              </Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Segundo Apellido</Form.Label>
              <Form.Control
                type="text"
                name="Segundo_Apellido"
                value={formData.Segundo_Apellido}
                onChange={handleChange}
                disabled={!esEdicion}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Contacto *</Form.Label>
              <Form.Control
                type="text"
                name="Contacto"
                value={formData.Contacto}
                onChange={handleChange}
                disabled={!esEdicion}
                isInvalid={!!errores.Contacto}
              />
              <Form.Control.Feedback type="invalid">
                {errores.Contacto}
              </Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Correo *</Form.Label>
              <Form.Control
                type="email"
                name="Correo"
                value={formData.Correo}
                onChange={handleChange}
                disabled={!esEdicion}
                isInvalid={!!errores.Correo}
              />
              <Form.Control.Feedback type="invalid">
                {errores.Correo}
              </Form.Control.Feedback>
            </div>
            <div className="col-12">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="Direccion"
                value={formData.Direccion}
                onChange={handleChange}
                disabled={!esEdicion}
              />
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        {esEdicion && (
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

// === COMPONENTE PRINCIPAL ===
const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [esEdicion, setEsEdicion] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Cargar proveedores (usamos useCallback para evitar warning)
  const obtenerProveedores = useCallback(async () => {
    try {
      setCargando(true);
      const respuesta = await fetch("http://localhost:3000/api/proveedores");
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      const datos = await respuesta.json();
      setProveedores(datos);
      setProveedoresFiltrados(datos);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      mostrarMensaje("danger", "No se pudo conectar al servidor. Verifica que esté en http://localhost:3000");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerProveedores();
  }, [obtenerProveedores]);

  // Búsqueda
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
    setPagina(1);
  }, [textoBusqueda, proveedores]);

  // Paginación
  const totalPaginas = Math.ceil(proveedoresFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actuales = proveedoresFiltrados.slice(inicio, inicio + porPagina);

  // === ACCIONES ===
  const handleNuevo = () => {
    setProveedorSeleccionado(null);
    setEsEdicion(true);
    setShowModal(true);
  };

  const handleVer = (id) => {
    const prov = proveedores.find((p) => p.ID_Proveedor === id);
    setProveedorSeleccionado(prov);
    setEsEdicion(false);
    setShowModal(true);
  };

  const handleEditar = (id) => {
    const prov = proveedores.find((p) => p.ID_Proveedor === id);
    setProveedorSeleccionado(prov);
    setEsEdicion(true);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/proveedores/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      setProveedores((prev) => prev.filter((p) => p.ID_Proveedor !== id));
      mostrarMensaje("success", "Proveedor eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarMensaje("danger", "Error al eliminar. Verifica el servidor.");
    }
  };

  const handleGuardar = async (datos) => {
    try {
      let respuesta;
      if (proveedorSeleccionado?.ID_Proveedor) {
        // Editar
        respuesta = await fetch(
          `http://localhost:3000/api/proveedores/${proveedorSeleccionado.ID_Proveedor}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
          }
        );
      } else {
        // Crear
        respuesta = await fetch("http://localhost:3000/api/proveedores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
      }

      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      await obtenerProveedores();
      setShowModal(false);
      mostrarMensaje("success", proveedorSeleccionado ? "Proveedor actualizado" : "Proveedor creado");
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarMensaje("danger", "Error al guardar. Verifica el backend en puerto 3000.");
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
  };

  return (
    <Container className="mt-4 pb-5">
      {/* Mensaje flotante */}
      {mensaje.texto && (
        <Alert
          variant={mensaje.tipo}
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 2000 }}
          onClose={() => setMensaje({ tipo: "", texto: "" })}
          dismissible
        >
          {mensaje.texto}
        </Alert>
      )}

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Gestión de Proveedores</h2>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 px-4"
          onClick={handleNuevo}
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

      {/* Tabla */}
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
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleVer(p.ID_Proveedor)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditar(p.ID_Proveedor)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleEliminar(p.ID_Proveedor)}
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

      {/* Paginación fija */}
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
          <Pagination.First onClick={() => setPagina(1)} disabled={pagina === 1} />
          <Pagination.Prev onClick={() => setPagina(pagina - 1)} disabled={pagina === 1} />
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
          <Pagination.Next onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas} />
          <Pagination.Last onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} />
        </Pagination>
      </div>

      {/* Modal integrado */}
      <ModalProveedor
        show={showModal}
        onHide={() => setShowModal(false)}
        proveedor={proveedorSeleccionado}
        esEdicion={esEdicion}
        onGuardar={handleGuardar}
      />
    </Container>
  );
};

export default Proveedores;