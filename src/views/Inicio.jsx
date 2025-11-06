// src/views/Inicio.jsx
import React from "react";

const Inicio = () => {
  return (
    <div className="mt-5 pt-4 text-center">
      <h1 className="display-4 fw-bold text-primary">Bienvenido a</h1>
      <h2 className="display-5 text-dark">Librería Amador</h2>
      <p className="lead text-muted mt-3">
        Gestión completa de productos, clientes, ventas y más.
      </p>
      <hr className="my-4" />
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
  );
};

export default Inicio;