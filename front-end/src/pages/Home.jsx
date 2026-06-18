import React from 'react';
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🛠️ IMPORTAÇÃO ADICIONADA: Ajuste a quantidade de pontos (../) se o arquivo apiClient estiver em outra pasta
import apiClient from "../apiClient"; 

import "../style/Home.css";

export default function Home(){
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [sair, setSair] = useState(false);

    useEffect(() => {
      const verificarSessaoSegura = async () => {
        const tokenRaw = localStorage.getItem('token_usuario');

        // 1. Se não houver token no navegador, expulsa direto
        if (!tokenRaw) {
          navigate('/');
          return;
        }

        try {
          const usuarioObjeto = JSON.parse(tokenRaw);
          
          // 2. BUSCA A VALIDAÇÃO NO BACKEND: Agora o apiClient está definido e vai funcionar
          const resposta = await apiClient.post('/api/usuarios/VerificarUsuario', { 
            id: usuarioObjeto.id 
          });

          // 3. Se o Flask confirmar que o usuário existe (Status 201 ou 200), libera o acesso
          if (resposta.status === 201 || resposta.status === 200) {
            setUsuario(usuarioObjeto);
          } else {
            localStorage.removeItem('token_usuario');
            navigate('/');
          }

        } catch (error) {
          console.error("Sessão inválida ou fraudada:", error.response?.data || error.message);
          localStorage.removeItem('token_usuario');
          navigate('/');
        }
      };

      // Se o estado 'sair' virar verdadeiro, nem valida, limpa e expulsa direto
      if (sair) {
        localStorage.removeItem('token_usuario');
        localStorage.removeItem('usuario_nome');
        navigate('/');
        return;
      }

      verificarSessaoSegura();
    }, [sair, navigate]);

    return (
        <div className="conteiner">

            <button onClick={() => {navigate('/ChatGlobal')}}>
                Entrar chat global
            </button>

            <button>
                Chat server
            </button>

            <button onClick={() => {setSair(true)}}>
                Sair
            </button>

            <button>
                Apagar tudo
            </button>
            
        </div>
    );
}
