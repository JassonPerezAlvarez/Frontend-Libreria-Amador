// src/components/Busquedas/CuadroBusquedas.jsx
import { Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda }) => {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        <Search size={18} />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={textoBusqueda}
        onChange={manejarCambioBusqueda}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;