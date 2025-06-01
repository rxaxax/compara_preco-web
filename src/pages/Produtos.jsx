import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Produtos = () => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estabelecimentoId, setEstabelecimentoId] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = React.useState("");
  const [filtroHistorico, setFiltroHistorico] = useState("data_recente");
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoEstabelecimentoId, setNovoEstabelecimentoId] = useState("");

  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const buscarEstabelecimentos = async () => {
      try {
        const resposta = await fetch("/api/estabelecimentos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await resposta.json();
        console.log("Estabelecimentos carregados:", dados);
        setEstabelecimentos(dados);
      } catch (erro) {
        console.error("Erro ao buscar estabelecimentos:", erro);
      }
    };

    if (token) buscarEstabelecimentos();
  }, [token]);

  const buscarProdutos = async () => {
    try {
      const resposta = await fetch("/api/produtos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();
      console.log("Resposta da API (produtos):", dados);
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  useEffect(() => {
    if (token) buscarProdutos();
  }, [token]);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const excluirProduto = async (id) => {
    try {
      const resposta = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resposta.ok) {
        setMensagem("Produto excluído com sucesso.");
        buscarProdutos(); // Atualiza a lista
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao excluir produto.");
      }
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      setMensagem("Erro de conexão com o servidor.");
    }
  };
  const salvarEdicao = async (id) => {
    try {
      const body = {
        nome: nomeEditado,
      };

      // Só adiciona novo item ao histórico se fornecido
      if (novoPreco && novoEstabelecimentoId) {
        body.historicoPrecos = [
          {
            preco: parseFloat(novoPreco),
            estabelecimento: novoEstabelecimentoId,
          },
        ];
      }

      const resposta = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (resposta.ok) {
        setMensagem("Produto atualizado com sucesso!");
        setEditandoId(null);
        buscarProdutos();
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao atualizar produto.");
      }
    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Estabelecimento selecionado (ID):", estabelecimentoId);
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          historicoPrecos: [
            {
              preco: parseFloat(preco),
              estabelecimento: estabelecimentoId,
            },
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Produto cadastrado com sucesso!");
        setNome("");
        setPreco("");
        setEstabelecimentoId("");
        buscarProdutos();
      } else {
        setMensagem(data.mensagem || "Erro ao cadastrar produto.");
      }
    } catch (erro) {
      console.error("Erro:", erro);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-10">
      <button
        onClick={() => navigate("/home")}
        className="self-start mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        ← Voltar para Home
      </button>

      <h1 className="text-2xl font-bold mb-6">Cadastrar Produto</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <div>
          <label className="block font-medium">Nome do Produto</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Preço</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Estabelecimento</label>
          <select
            value={estabelecimentoId}
            onChange={(e) => setEstabelecimentoId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            required
          >
            <option value="">Selecione um estabelecimento</option>
            {estabelecimentos.map((estab) => (
              <option key={estab.id} value={estab.id}>
                {estab.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Cadastrar Produto
        </button>

        {mensagem && (
          <p className="text-center text-sm text-gray-700 mt-2">{mensagem}</p>
        )}
      </form>

      <div className="mt-10 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Buscar produto pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        />
        <div className="mb-4">
          <label className="mr-2 font-medium">Ordenar histórico por:</label>
          <select
            value={filtroHistorico}
            onChange={(e) => setFiltroHistorico(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="nome_az">Estabelecimento (A-Z)</option>
            <option value="nome_za">Estabelecimento (Z-A)</option>
            <option value="preco_crescente">Preço (menor → maior)</option>
            <option value="preco_decrescente">Preço (maior → menor)</option>
            <option value="data_recente">Data (mais recente)</option>
            <option value="data_antiga">Data (mais antiga)</option>
          </select>
        </div>

        <h2 className="text-xl font-semibold mb-4">Produtos cadastrados</h2>
        {produtos.length === 0 ? (
          <p className="text-gray-600">Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="space-y-6">
            {produtosFiltrados.map((produto) => {
              console.log(
                "Renderizando produto:",
                produto.nome,
                produto.historicoPrecos
              );

              return (
                <li
                  key={produto.id}
                  className="bg-white p-4 shadow rounded border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    {editandoId === produto.id ? (
                      <div className="space-y-2 w-full">
                        <input
                          type="text"
                          value={nomeEditado}
                          onChange={(e) => setNomeEditado(e.target.value)}
                          placeholder="Novo nome"
                          className="border p-2 rounded w-full"
                        />
                        <input
                          type="number"
                          value={novoPreco}
                          onChange={(e) => setNovoPreco(e.target.value)}
                          placeholder="Novo preço"
                          className="border p-2 rounded w-full"
                        />
                        <select
                          value={novoEstabelecimentoId}
                          onChange={(e) =>
                            setNovoEstabelecimentoId(e.target.value)
                          }
                          className="border p-2 rounded w-full"
                        >
                          <option value="">
                            Selecione novo estabelecimento
                          </option>
                          {estabelecimentos.map((estab) => (
                            <option key={estab.id} value={estab.id}>
                              {estab.nome}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => salvarEdicao(produto.id)}
                            className="bg-green-500 text-white px-4 py-1 rounded"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="bg-gray-400 text-white px-4 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-bold text-blue-600">
                          {produto.nome}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditandoId(produto.id);
                              setNomeEditado(produto.nome);
                              setNovoPreco("");
                              setNovoEstabelecimentoId("");
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluirProduto(produto.id)}
                            className="text-red-600 hover:underline"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {produto.historicoPrecos &&
                  produto.historicoPrecos.length > 0 ? (
                    <ul className="space-y-2">
                      {[...produto.historicoPrecos]
                        .sort((a, b) => {
                          switch (filtroHistorico) {
                            case "nome_az":
                              return a.estabelecimento?.nome.localeCompare(
                                b.estabelecimento?.nome
                              );
                            case "nome_za":
                              return b.estabelecimento?.nome.localeCompare(
                                a.estabelecimento?.nome
                              );
                            case "preco_crescente":
                              return a.preco - b.preco;
                            case "preco_decrescente":
                              return b.preco - a.preco;
                            case "data_recente":
                              return new Date(b.data) - new Date(a.data);
                            case "data_antiga":
                              return new Date(a.data) - new Date(b.data);
                            default:
                              return 0;
                          }
                        })
                        .map((item, index) => (
                          <li
                            key={index}
                            className="border border-gray-100 rounded p-2 bg-gray-50"
                          >
                            <p>
                              <strong>Preço:</strong> R${item.preco.toFixed(2)}
                            </p>
                            <p>
                              <strong>Estabelecimento:</strong>{" "}
                              {item.estabelecimento?.nome || "N/A"}
                            </p>
                            <p>
                              <strong>Data:</strong>{" "}
                              {item.data
                                ? new Date(item.data).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Nenhum histórico disponível.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Produtos;
