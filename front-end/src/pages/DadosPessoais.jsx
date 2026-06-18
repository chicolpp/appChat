import { useState, useEffect } from 'react';
import apiClient from "../apiClient";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
        try {
            // Mantido o .get pois alteramos o Flask para receber GET
            const resposta = await apiClient.get('/transacao/MostrarDados');
            setUsuarios(resposta.data);
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
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th> {/* CORREÇÃO: Atualizado cabeçalho */}
            <th>RG</th>  {/* CORREÇÃO: Atualizado cabeçalho */}
          </tr>
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
                <td>{usuario.cpf}</td> {/* CORREÇÃO: Pega o CPF do JSON */}
                <td>{usuario.rg}</td>  {/* CORREÇÃO: Pega o RG do JSON */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
