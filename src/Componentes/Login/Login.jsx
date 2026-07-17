import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // O link absoluto correto apontando para a pasta Pi_FinalSintex
      const resposta = await fetch("http://localhost/Sintex/backend/php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }), 
      });

      const resultado = await resposta.json();

      if (!resultado.success) {
        setMensagem(resultado.message);
        return;
      }

      // Salva a permissão E o ID do usuário retornado pelo PHP
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminId", resultado.user.id); 
      
      const paginaAnterior = location.state?.from?.pathname || "/admin";
      navigate(paginaAnterior, { replace: true });

    } catch (erro) {
      setMensagem("Erro ao conectar com o servidor local.");
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleLogin}>
        <div className="LoginLogoBox">
          <div className="BackLinkBox">
            <Link className="BackLink" to="/"><img src={seta} alt="Voltar" /></Link>
            <img src={logo} alt="Sintex Logo" className="LoginLogo" />
          </div>
        </div>

        <h2>Entrar no Sintex</h2>

        <div className="InputGroup">
          <label>E-mail</label>
          <input type="email" placeholder="seu-email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="InputGroup">
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <button type="submit" className="LoginButton">Acessar</button>

        {mensagem && <div className="LoginMessage">{mensagem}</div>}
        
        <div className="LoginFooter">
          <a href="#recuperar">Esqueceu a senha?</a>
          <span>
            <a className="HighlightLink" onClick={() => navigate('/register-admin', { state: { from: location.state?.from } })} style={{ cursor: 'pointer' }}>
              Cadastre-se
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}