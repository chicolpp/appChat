import React, { useState, useEffect } from 'react';
import apiClient from "../apiClient";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
        try {
            const resposta = await apiClient.get('/transacao/MostrarDados');
            
            // CORREÇÃO SEGURA: Garante que só salva no estado se o backend enviar uma lista/array
            if (Array.isArray(resposta.data)) {
                setUsuarios(resposta.data);
            } else if (resposta.data && Array.isArray(resposta.data.usuarios)) {
                // Caso seu Flask envie os dados envelopados como { usuarios: [...] }
                setUsuarios(resposta.data.usuarios);
            } else {
                // Se o backend enviar um objeto de erro ou formato estranho
                console.error("O backend não retornou uma lista válida:", resposta.data);
                setErro("O servidor retornou dados em um formato inválido.");
            }
        } catch (err) {
            setErro(err.message);
        }
    };

    buscarDados();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {/* CORREÇÃO: Removidos todos os espaços em branco ocultos de dentro da tag tr */}
          <tr style={{ backgroundColor: '#f2f2f2' }}><th>ID</th><th>Nome</th><th>CPF</th><th>RG</th></tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum usuário encontrado</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.rg}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
