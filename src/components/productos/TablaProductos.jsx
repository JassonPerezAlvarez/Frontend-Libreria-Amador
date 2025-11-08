import { Table, Spinner, Button } from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";


const TablaProductos = ({ productos,
  cargando, 
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual }) => {

  const [orden, setOrden] = useState({ campo: "ID_Producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA ?? "").localeCompare(String(valorB ?? ""));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <>
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="ID_Producto" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>

            <BotonOrden campo="Nombre" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>

            <BotonOrden campo="Descripcion" orden={orden} manejarOrden={manejarOrden}>
              Descripcion
            </BotonOrden>

            <BotonOrden campo="Cantidad" orden={orden} manejarOrden={manejarOrden}>
              Categoria
            </BotonOrden>

            <BotonOrden campo="Precio_Comp" orden={orden} manejarOrden={manejarOrden}>
              Precio
            </BotonOrden>

            <BotonOrden campo="Precio_Vent" orden={orden} manejarOrden={manejarOrden}>
              Stock
            </BotonOrden>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.map((producto) => {
            return (
              <tr key={producto.ID_Producto}>
                <td>{producto.ID_Producto}</td>
                <td>{producto.Nombre}</td>
                <td>{producto.Descripcion}</td>
                <td>{producto.Cantidad}</td>
                <td>{producto.Precio_Comp}</td>
                <td>{producto.Precio_Vent}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion && abrirModalEdicion(producto)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion && abrirModalEliminacion(producto)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
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