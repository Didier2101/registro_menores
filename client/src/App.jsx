import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componentes/Login";
import Administrativo from "./componentes/Administrativo";
import Vigilantes from "./componentes/Vigilantes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/administrativo" element={<Administrativo />} />
        <Route path="/vigilantes" element={<Vigilantes />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
