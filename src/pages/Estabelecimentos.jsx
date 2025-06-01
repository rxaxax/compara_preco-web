import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Estabelecimentos = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const buscarEstabelecimentos = async () => {
    try {
      const resposta = await fetch("/api/estabelecimentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();
      console.log(dados);
      setEstabelecimentos(dados);
    } catch (erro) {
      console.error("Erro ao buscar estabelecimentos:", erro);
    }
  };

  useEffect(() => {
    if (token) buscarEstabelecimentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editandoId
      ? `/api/estabelecimentos/${editandoId}`
      : "/api/estabelecimentos";

    const method = editandoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, endereco }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(data.mensagem || "Operação realizada com sucesso!");
        setNome("");
        setEndereco("");
        setEditandoId(null);
        buscarEstabelecimentos();
      } else {
        setMensagem(data.mensagem || "Erro ao salvar estabelecimento");
      }
    } catch (err) {
      console.error("Erro:", err);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  const handleEditar = (estab) => {
    setNome(estab.nome);
    setEndereco(estab.endereco);
    setEditandoId(estab.id);
    setMensagem("Editando estabelecimento");
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este estabelecimento?"))
      return;

    try {
      const response = await fetch(`/api/estabelecimentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(data.mensagem || "Estabelecimento excluído");
        buscarEstabelecimentos();
      } else {
        setMensagem(data.mensagem || "Erro ao excluir");
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome("");
    setEndereco("");
    setMensagem("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-10">
      <button
        onClick={() => navigate("/home")}
        className="self-start mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        ← Voltar para Home
      </button>
      <h1 className="text-2xl font-bold mb-6">
        {editandoId ? "Editar Estabelecimento" : "Cadastrar Estabelecimento"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4 mb-10"
      >
        <div>
          <label className="block font-medium">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            required
          />
        </div>

        <div className="flex justify-between gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editandoId ? "Atualizar" : "Cadastrar"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          )}
        </div>

        {mensagem && (
          <p className="text-center text-sm text-gray-700 mt-2">{mensagem}</p>
        )}
      </form>

      {/* Lista */}
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Estabelecimentos Cadastrados
        </h2>
        {estabelecimentos.length === 0 ? (
          <p className="text-gray-600">Nenhum estabelecimento cadastrado.</p>
        ) : (
          <ul className="space-y-3">
            {estabelecimentos.map((estab) => (
              <li
                key={estab.id}
                className="border-b pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>{estab.nome}</strong>
                  <div className="text-sm text-gray-600">{estab.endereco}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(estab)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(estab.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Estabelecimentos;
