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
    imagen: "",
  });

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      // Normalizar IDs: algunos endpoints devuelven `id_producto`, otros `ID_Producto`
      const normalizados = datos.map((p) => ({
        ...p,
        ID_Producto: p.ID_Producto ?? p.id_producto,
        id_producto: p.id_producto ?? p.ID_Producto,
      }));
      setProductos(normalizados);
      setProductosFiltrados(normalizados);
      setCargando(false);
    } catch (error) {
      console.log(error.message);
      setCargando(false);
    }
  };

  // BUSQUEDA
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    setPaginaActual(1);

    const filtrados = productos.filter(
      (p) =>
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

  // REGISTRAR
  const agregarProducto = async () => {
    try {
      await fetch("http://localhost:3000/api/registrarproducto", {
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
        imagen: "",
      });
      obtenerProductos();
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert("No se pudo registrar el producto");
    }
  };

  // Abrir modal edición
  const abrirModalEdicion = (producto) => {
    // Aseguramos que tenga ID_Producto
    setProductoEditado({ ...producto, ID_Producto: producto.ID_Producto ?? producto.id_producto });
    setMostrarModalEdicion(true);
  };

  // Guardar edición
  const guardarEdicion = async () => {
    try {
      // Log para depuración: revisar que productoEditado contenga la imagen en Base64
      console.log('Enviando edición producto:', productoEditado);
      // Si hay un File (imagenFile), enviamos FormData (multipart/form-data)
      let response;
      const idParaEnviar = productoEditado?.ID_Producto ?? productoEditado?.id_producto;
      if (!idParaEnviar) throw new Error('ID de producto no definido');

      if (productoEditado?.imagenFile) {
        const fd = new FormData();
        // Añadimos los campos del producto (ajusta nombres según tu backend)
        fd.append('Nombre', productoEditado.Nombre ?? '');
        fd.append('Descripcion', productoEditado.Descripcion ?? '');
        fd.append('Cantidad', productoEditado.Cantidad ?? '0');
        fd.append('Precio_Comp', productoEditado.Precio_Comp ?? '0');
        fd.append('Precio_Vent', productoEditado.Precio_Vent ?? '0');
        // Añadimos el archivo
        fd.append('imagen', productoEditado.imagenFile, productoEditado.imagenFile.name);

        console.log('Enviando FormData con archivo, campos:', Array.from(fd.entries()).slice(0, 5));

        response = await fetch(`http://localhost:3000/api/actualizarproducto/${idParaEnviar}`, { method: 'PATCH', body: fd });
      } else {
        // Envío tradicional JSON (cuando no hay archivo nuevo)
        response = await fetch(`http://localhost:3000/api/actualizarproducto/${idParaEnviar}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoEditado),
        });
      }

      if (!response.ok) {
        const text = await response.text();
        console.error('Error en respuesta al actualizar producto:', response.status, text);
        throw new Error('Error en respuesta del servidor');
      }

      console.log('Edición enviada correctamente, status:', response.status);
      setMostrarModalEdicion(false);
      obtenerProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  // Abrir modal eliminar
  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar({ ...producto, ID_Producto: producto.ID_Producto ?? producto.id_producto });
    setMostrarModalEliminar(true);
  };

  // Eliminar producto
  const confirmarEliminacion = async () => {
    try {
      const idParaEliminar = productoAEliminar?.ID_Producto ?? productoAEliminar?.id_producto;
      if (!idParaEliminar) throw new Error('ID de producto no definido para eliminar');
      await fetch(`http://localhost:3000/api/eliminarproducto/${idParaEliminar}`, { method: 'DELETE' });

      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
      obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  // Generar PDF
  const generarPDFProductos = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, {
      align: "center",
    });

    const columnas = [
      "ID",
      "Nombre",
      "Descripción",
      "Stock",
      "Precio Compra",
      "Precio Venta",
      
    ];

    const filas = productosFiltrados.map((p) => [
      p.ID_Producto,
      p.Nombre,
      p.Descripcion,
      p.Cantidad,
      `C$ ${Number(p.Precio_Comp).toFixed(2)}`,
      `C$ ${Number(p.Precio_Vent).toFixed(2)}`,
      
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
    });

    const fecha = new Date();
    const nombreArchivo = `productos_${fecha.getDate()}${fecha.getMonth() + 1
      }${fecha.getFullYear()}.pdf`;

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
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
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

      <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={generarPDFProductos}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
};

export default Productos;
