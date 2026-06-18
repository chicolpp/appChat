import React from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import apiClient from "../apiClient";
import "../style/Login.css";

// Validação dos campos com Zod
const loginSchema = z.object({
    nome: z.string().min(1, 'O nome é obrigatório!'),
    senha: z.string().min(6, 'A senha tem que ter pelo menos 6 caracteres')
});

export default function Login() {
    const {
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({ resolver: zodResolver(loginSchema) });

    const navigate = useNavigate();    
    
    const VerificarLogin = async (dados) => {
        
        try {
            const resposta = await apiClient.post('/api/usuarios/Login', dados);
            if (resposta.status === 201) {
                // 🛠️ WHATSAPP PERSISTÊNCIA: Grava o nome do usuário de forma limpa para o chat não exibir "Anônimo"
                localStorage.setItem('usuario_nome', dados.nome);
                localStorage.setItem('token_usuario', JSON.stringify(resposta.data));
                navigate('/Home');
            }
        } catch (error) {
            console.error("Erro interno no login:", error.response?.data || error.message);
        }
    };

    return (
        // CORRIGIDO: Alterado de width: "100vh" para "100%" para alinhar no meio exato do celular e do PC
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            
            <div className="areaLogin">
                
                <form className="forms_content" onSubmit={handleSubmit(VerificarLogin)} noValidate>
                    
                    <div className="areaTitulo">
                        <label className="titulo">Login</label>
                    </div>

                    <div className="areaInputLogin">
                        <input 
                            type="text"
                            className="inputLogin"
                            placeholder="Digite seu nome"
                            {...register("nome")}
                        />
                        {/* Exibe o erro do nome logo abaixo do próprio input */}
                        {errors.nome && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: '-10px 0 5px 0', width: '100%', textAlign: 'left' }}>{errors.nome.message}</p>}
                    
                        <input 
                            type="password" 
                            className="inputSenha"
                            placeholder="Digite sua senha"
                            {...register("senha")}
                        />    
                        {/* Exibe o erro da senha logo abaixo do próprio input */}
                        {errors.senha && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: '-10px 0 5px 0', width: '100%', textAlign: 'left' }}>{errors.senha.message}</p>}            
                    </div>

                    <div className="areaBotaoSubmit">
                        <button className="buttonSubmit" type="submit">
                            Login
                        </button>
                    </div>

                </form>    

            </div>
        </div>
    );
}
