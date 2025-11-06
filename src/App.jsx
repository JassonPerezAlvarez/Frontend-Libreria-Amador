// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Encabezado from "./components/Navegacion/Encabezado";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Usuarios from "./views/Usuarios";
import Clientes from "./views/Clientes";
import Proveedores from "./views/Proveedores";
import Productos from "./views/Productos";
import Compras from "./views/Compras";
import Ventas from "./views/Ventas";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Encabezado />
        <div className="container mt-5 pt-4">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="*" element={<Navigate to="/inicio" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;