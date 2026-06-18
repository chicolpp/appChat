import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import "../style/ChatGlobal.css"



// URL do seu servidor Flask rodando no Tailscale
const SOCKET_URL = "https://xiqo-h510.taile2f50f.ts.net:10000"; 

export default function ChatGlobal() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([]);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Recupera o nome do usuário que fez login (ou usa Anônimo caso não ache)
  const obterOuDefinirUsuario = () => {
    let nome = localStorage.getItem('usuario_nome');
    
    if (!nome || nome.trim() === '' || nome === 'Anônimo') {
      nome = prompt("Qual o seu nome para entrar no chat?");
      if (!nome || !nome.trim()) {
        nome = "Usuário_" + Math.floor(1000 + Math.random() * 9000);
      }
      localStorage.setItem('usuario_nome', nome.trim());
    }
    return nome;
  };

  const usuarioLogado = obterOuDefinirUsuario();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      upgrade: true,
      forceNew: true,
      secure: true
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Conectado com sucesso ao Chat Global!');
      socketRef.current.emit('pedir_historico');
    });

    socketRef.current.on('enviar_historico', (dadosHistorico) => {
      if (Array.isArray(dadosHistorico)) {
        setHistorico(dadosHistorico);
      }
    });

    socketRef.current.on('receber_mensagem', (novaMensagem) => {
      setHistorico((prev) => [...prev, novaMensagem]);
    });

    // 🛠️ NOVO OUVINTE: Limpa a tela de todo mundo quando o servidor avisa que o banco foi zerado
    socketRef.current.on('historico_limpo', () => {
      setHistorico([]);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Erro na conexão do chat:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('enviar_historico');
        socketRef.current.off('receber_mensagem');
        socketRef.current.off('historico_limpo');
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historico]);

  const formatarHora = (isoString) => {
    if (!isoString) return '';
    try {
      const data = new Date(isoString);
      return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    const payload = {
      usuario: usuarioLogado,
      texto: mensagem 
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('enviar_mensagem', payload);
      setMensagem(''); 
    } else {
      console.error("❌ Erro: O chat não está conectado no servidor.");
    }
  };

  // 🛠️ NOVA FUNÇÃO: Dispara o comando de limpar banco para o Flask
  const limparTodasMensagens = () => {
    if (window.confirm("Você tem certeza que deseja apagar TODAS as mensagens do banco de dados? Esta ação não pode ser desfeita.")) {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('limpar_historico');
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Topo do chat com layout flexível para o botão de apagar */}
      <div className="chat-header">
        <h2 className="chat-title">💬 Chat Global</h2>
        
        {/* Botão Vermelho de Limpeza */}
        <button onClick={limparTodasMensagens} className="btn-delete-all">
          🗑️ Apagar Tudo
        </button>
      </div>

      <p className="user-logged-info">
        Logado como: <strong>{usuarioLogado}</strong>
      </p>
      
      {/* Caixa do Histórico Estilo WhatsApp */}
      <div className="chat-history-box">
        {historico.map((msg, index) => (
          <div 
            key={index} 
            className={`message-wrapper ${msg.usuario === usuarioLogado ? 'my-message' : 'other-message'}`}
          >
            <span className="message-balloon">
              <strong className="message-username">
                {msg.usuario}
              </strong>
              
              <div className="message-text">
                {msg.texto}
              </div>

              {/* Exibe a hora formatada no canto inferior direito do balão */}
              <span className="message-time">
                {formatarHora(msg.data_envio)}
              </span>
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Caixa de Entrada de Mensagens */}
      <form onSubmit={enviarMensagem} className="chat-form">
        <input 
          type="text" 
          value={mensagem} 
          onChange={(e) => setMensagem(e.target.value)} 
          placeholder="Digite sua mensagem..." 
          className="chat-input"
        />
        <button type="submit" className="btn-send">
          Enviar
        </button>
      </form>
    </div>
  );

}
