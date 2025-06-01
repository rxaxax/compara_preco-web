import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    // Tenta obter o usuário do localStorage
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login"); // Se não estiver logado, redireciona
    } else {
      try {
        const usuario = JSON.parse(user);
        setNomeUsuario(usuario.nome || "Usuário");
      } catch (e) {
        console.error("Erro ao ler usuário:", e);
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">
        Bem-vindo {nomeUsuario}
      </h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/estabelecimentos")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Estabelecimentos
        </button>
        <button
          onClick={() => navigate("/produtos")}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Produtos
        </button>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Sair
      </button>
    </div>
  );
};

export default Home;
