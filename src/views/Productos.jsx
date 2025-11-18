import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas.jsx";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto.jsx";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto.jsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

   const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre: "",
    Descripcion: "",
    Cantidad: "",
    Precio_Comp: "",
    Precio_Vent: "",
  });

  // CARGAR PRODUCTOS
  const obtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/obtenerProductos");
      const data = await res.json();

      const normalizados = data.map(p => ({
        id_producto: p.ID_Producto,
        Nombre: p.Nombre,
        Descripcion: p.Descripcion || "",
        Cantidad: p.Cantidad || 0,
        Precio_Comp: p.Precio_Comp || 0,
        Precio_Vent: p.Precio_Vent || 0,
      }));

      setProductos(normalizados);
      setProductosFiltrados(normalizados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  // BÚSQUEDA
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    setPaginaActual(1);

    const filtrados = productos.filter(p =>
      p.Nombre?.toLowerCase().includes(texto) ||
      p.Descripcion?.toLowerCase().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  // PAGINACIÓN
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // REGISTRAR PRODUCTO
  const agregarProducto = async () => {
    try {
      await fetch("http://localhost:3000/api/RegistrarProductos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      setMostrarModalRegistro(false);
      setNuevoProducto({
        Nombre: "",
        Descripcion: "",
        Cantidad: "",
        Precio_Comp: "",
        Precio_Vent: "",
      });
      obtenerProductos(); // Recarga la lista
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert("No se pudo registrar el producto");
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    // Evitar crash si el objeto tiene nombres de campos distintos (p. ej. Nombre vs nombre_producto)
    if (!(productoEditado?.nombre_producto?.trim() || productoEditado?.Nombre?.trim())) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarProductoPatch/${productoEditado.id_producto}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar producto");
      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarProducto/${productoAEliminar.id_producto}`,
        {
          method: "DELETE",
        }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar producto");
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const generarPDFProductos = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(
      "Lista de Productos",
      doc.internal.pageSize.getWidth() / 2,
      18,
      { align: "center" }
    );

    // Usar los mismos campos que muestra la tabla de productos
    const columnas = ["ID", "Nombre", "Descripción", "Stock", "Precio Compra", "Precio Venta"];
    const filas = productosFiltrados.map((producto) => {
      const id = producto.id_producto ?? "";
      const nombre = producto.Nombre ?? "";
      const descripcion = producto.Descripcion ?? "";
      const stock = producto.Cantidad ?? 0;
      const precioCompra = `C$ ${Number(producto.Precio_Comp ?? 0).toFixed(2)}`;
      const precioVenta = `C$ ${Number(producto.Precio_Vent ?? 0).toFixed(2)}`;
      return [id, nombre, descripcion, stock, precioCompra, precioVenta];
    });

    const totalPaginas = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();

        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  

  return (
  <>
    <Container className="mt-4">
      <h4>Productos</h4>

      <Row className="mb-3 align-items-center">
        <Col lg={5} md={8}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button
            className="color-boton-registro"
            onClick={() => setMostrarModalRegistro(true)}
          >
            + Nuevo Producto
          </Button>
        </Col>
      </Row>

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={productosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={(e) =>
          setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })
        }
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          productoEditado={productoEditado}
          setProductoEditado={setProductoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionProducto
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          producto={productoAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
    </Container>
    <Col lg={3} md={4} sm={4} xs={5} >
        <Button
          className="mb-3"
          onClick={generarPDFProductos}
          variant="secondary"
          style={{ width: '100%' }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
};

export default Productos;