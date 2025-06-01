import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Produtos from "./pages/Produtos";
import Estabelecimentos from "./pages/Estabelecimentos";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/estabelecimentos" element={<Estabelecimentos />} />
      <Route path="/produtos" element={<Produtos />} />
    </Routes>
  );
}

export default App;
