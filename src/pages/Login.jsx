import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import "../style/Login.css"

export default function Login(){
    const {register, handleSubmit } = useForm()

    const [senha, setSenha] = useState(null)
    const [name, setName] = useState(null)
    
    
    const VerificarLogin = (dados) => {
        console.log("dados enviados no onSubmit", dados)

        if(dados.nome){
            alert("o nome foi pego. Nome:", dados.nome)
        }else return
    }


    return(
        <div style={{
            width: "100%vh",
            height: "100vh"
            }}>


                <div className="areaLogin" onSubmit={VerificarLogin}>

    
                    
                    <form className="forms_content">
                        <div className="areaTitulo">
                            <label className="titulo">Login
                            </label>
                        </div>

                        <div className="areaInputLogin">
                            
                            <input 
                            type="text"
                            className="inputLogin"
                            placeholder="Digite seu nome"
                            {...register("nome")}
                            />
                            
                            <input 
                            type="password" 
                            className="inputSenha"
                            {...register("senha")}
                            />    
                        </div>

                        <div className="areaBotaoSubmit">
                            <button
                            className="buttonSubmit"
                            type="submit"
                            >
                                Login
                            </button>
                        </div>

                    </form>                
                </div>

        </div>
    )
}