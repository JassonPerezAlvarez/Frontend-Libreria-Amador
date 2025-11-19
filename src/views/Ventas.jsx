import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaVentas from '../components/ventas/TablaVentas';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import ModalEdicionVenta from '../components/ventas/ModalEdicionVenta';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta';
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVenta';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split('T')[0];

  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: '',
    id_empleado: '',
    fecha_venta: hoy,
    total_venta: 0
  });

  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // ====== NOMBRES (sin localhost) ======
  const obtenerNombreCliente = async (idCliente) => {
    if (!idCliente) return '—';
    try {
      const resp = await fetch(`/api/clientes/${idCliente}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return `${data.primer_nombre} ${data.primer_apellido}`;
    } catch { return '—'; }
  };

  const obtenerNombreEmpleado = async (idEmpleado) => {
    if (!idEmpleado) return '—';
    try {
      const resp = await fetch(`/api/empleados/${idEmpleado}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return `${data.primer_nombre} ${data.primer_apellido}`;
    } catch { return '—'; }
  };

  const obtenerNombreProducto = async (idProducto) => {
    if (!idProducto) return '—';
    try {
      const resp = await fetch(`/api/productos/${idProducto}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.nombre_producto || '—';
    } catch { return '—'; }
  };

  // ====== CARGAR VENTAS ======
  const obtenerVentas = async () => {
    try {
      setCargando(true);
      const resp = await fetch('/api/ventas');
      if (!resp.ok) throw new Error('Error al cargar ventas');
      const ventasRaw = await resp.json();

      const ventasConNombres = await Promise.all(
        ventasRaw.map(async (v) => ({
          ...v,
          nombre_cliente: await obtenerNombreCliente(v.id_cliente),
          nombre_empleado: await obtenerNombreEmpleado(v.id_empleado)
        }))
      );

      setVentas(ventasConNombres);
      setVentasFiltradas(ventasConNombres);
    } catch (error) {
      console.error(error);
      alert("Error al cargar ventas.");
    } finally {
      setCargando(false);
    }
  };

  // ====== DETALLES DE VENTA ======
  const obtenerDetallesVenta = async (id_venta) => {
    try {
      const resp = await fetch('/api/detalle_ventas');
      if (!resp.ok) throw new Error();
      const todos = await resp.json();
      const filtrados = todos.filter(d => d.id_venta === parseInt(id_venta));

      const detalles = await Promise.all(
        filtrados.map(async (d) => ({
          ...d,
          nombre_producto: await obtenerNombreProducto(d.id_producto)
        }))
      );

      setDetallesVenta(detalles);
      setMostrarModalDetalles(true);
    } catch (error) {
      alert("No se pudieron cargar los detalles.");
    }
  };

  // ====== CATÁLOGOS ======
  const cargarCatalogos = async () => {
    try {
      const [c, e, p] = await Promise.all([
        fetch('/api/clientes').then(r => r.json()),
        fetch('/api/empleados').then(r => r.json()),
        fetch('/api/productos').then(r => r.json())
      ]);
      setClientes(c);
      setEmpleados(e);
      setProductos(p);
    } catch (error) {
      console.error("Error cargando catálogos", error);
    }
  };

  // ====== BÚSQUEDA ======
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = ventas.filter(v =>
      v.id_venta.toString().includes(texto) ||
      v.nombre_cliente?.toLowerCase().includes(texto) ||
      v.nombre_empleado?.toLowerCase().includes(texto)
    );
    setVentasFiltradas(filtrados);
    setPaginaActual(1);
  };

  // ====== REGISTRO ======
  const agregarVenta = async () => {
    if (!nuevaVenta.id_cliente || !nuevaVenta.id_empleado || detallesNuevos.length === 0) {
      alert("Completa cliente, empleado y al menos un detalle.");
      return;
    }

    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

    try {
      const ventaResp = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevaVenta, total_venta: total })
      });
      const { id_venta } = await ventaResp.json();

      for (const d of detallesNuevos) {
        await fetch('/api/detalle_ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_venta })
        });
      }

      await obtenerVentas();
      cerrarModalRegistro();
    } catch (error) {
      alert("Error al registrar venta.");
    }
  };

  // ====== EDICIÓN ======
  const abrirModalEdicion = async (venta) => {
    setVentaAEditar(venta);
    setVentaEnEdicion({
      id_cliente: venta.id_cliente,
      id_empleado: venta.id_empleado,
      fecha_venta: new Date(venta.fecha_venta).toISOString().split("T")[0]
    });

    const resp = await fetch('/api/detalle_ventas');
    const todos = await resp.json();
    const detallesRaw = todos.filter(d => d.id_venta === venta.id_venta);

    const detalles = await Promise.all(
      detallesRaw.map(async (d) => ({
        id_producto: d.id_producto,
        nombre_producto: await obtenerNombreProducto(d.id_producto),
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario
      }))
    );

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

  const actualizarVenta = async () => {
    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
    try {
      await fetch(`/api/ventas/${ventaAEditar.id_venta}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ventaEnEdicion, total_venta: total })
      });

      // Borrar detalles antiguos
      const resp = await fetch('/api/detalle_ventas');
      const todos = await resp.json();
      const actuales = todos.filter(d => d.id_venta === ventaAEditar.id_venta);
      for (const d of actuales) {
        await fetch(`/api/detalle_ventas/${d.id_detalle_venta}`, { method: 'DELETE' });
      }

      // Crear nuevos
      for (const d of detallesNuevos) {
        await fetch('/api/detalle_ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_venta: ventaAEditar.id_venta })
        });
      }

      await obtenerVentas();
      cerrarModalEdicion();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  // ====== ELIMINACIÓN ======
  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminar(true);
  };

  const eliminarVenta = async () => {
    try {
      await fetch(`/api/ventas/${ventaAEliminar.id_venta}`, { method: 'DELETE' });
      await obtenerVentas();
      setMostrarModalEliminar(false);
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  // ====== LIMPIAR MODALES ======
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevaVenta({ id_cliente: '', id_empleado: '', fecha_venta: hoy, total_venta: 0 });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setVentaAEditar(null);
    setVentaEnEdicion(null);
    setDetallesNuevos([]);
  };

  useEffect(() => {
    obtenerVentas();
    cargarCatalogos();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Ventas</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>
            + Nueva Venta
          </Button>
        </Col>
      </Row>

      <TablaVentas
        ventas={ventasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesVenta}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroVenta
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        agregarVenta={agregarVenta}
        hoy={hoy}
      />

      <ModalEdicionVenta
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        venta={ventaAEditar}
        ventaEnEdicion={ventaEnEdicion}
        setVentaEnEdicion={setVentaEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        actualizarVenta={actualizarVenta}
      />

      <ModalEliminacionVenta
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        venta={ventaAEliminar}
        confirmarEliminacion={eliminarVenta}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesVenta}
      />
    </Container>
  );
};

export default Ventas;