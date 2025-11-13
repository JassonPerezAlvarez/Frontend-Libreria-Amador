import { Table, Spinner, Button } from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProductos = ({
  productos,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {

  const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  // Ordenamos una copia del array
  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Cargando productos...</span>
      </div>
    );
  }

  if (productos.length === 0) {
    return <p className="text-center">No hay productos registrados.</p>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="Nombre" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>
            <BotonOrden campo="Descripcion" orden={orden} manejarOrden={manejarOrden}>
              Descripción
            </BotonOrden>
            <BotonOrden campo="Cantidad" orden={orden} manejarOrden={manejarOrden}>
              Stock
            </BotonOrden>
            <BotonOrden campo="Precio_Comp" orden={orden} manejarOrden={manejarOrden}>
              Precio Compra
            </BotonOrden>
            <BotonOrden campo="Precio_Vent" orden={orden} manejarOrden={manejarOrden}>
              Precio Venta
            </BotonOrden>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.Nombre}</td>
              <td>{producto.Descripcion}</td>
              <td>{producto.Cantidad}</td>
              <td>{producto.Precio_Comp}</td>
              <td>{producto.Precio_Vent}</td>
              <td className="text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaProductos;