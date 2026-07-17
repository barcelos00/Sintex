import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

export default function RegisterAdmin() {
  const routeState = useLocation().state || {};
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState("");

  const [formData, setFormData] = useState({
    email: routeState.email || "",
    senha: routeState.password || "",
    restaurant: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // O link absoluto correto apontando para a pasta Pi_FinalSintex
      const response = await fetch("http://localhost/Sintex/backend/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,
          restaurant: formData.restaurant,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMensagem(result.message || "Falha ao cadastrar administrador.");
        return;
      }

      setMensagem(result.message || "Cadastro realizado com sucesso!");
      localStorage.setItem("userRole", "admin");
      if (result.admin_id) {
        localStorage.setItem("adminId", result.admin_id);
      }

      navigate(routeState.from?.pathname || "/admin", { replace: true });

    } catch (error) {
      console.error(error);
      setMensagem("Erro ao conectar com o servidor local.");
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleSubmit}>
        <div className="LoginLogoBox">
          <div className="BackLinkBox">
            <Link className="BackLink" onClick={() => navigate(-1)}><img src={seta} alt="Voltar" /></Link>
            <img src={logo} alt="Sintex Logo" className="LoginLogo" />
          </div>
        </div>

        <h2>Cadastrar Administrador</h2>

        <div className="InputGroup">
          <label>E-mail</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="InputGroup">
          <label>Senha</label>
          <input name="senha" type="password" value={formData.senha} onChange={handleChange} required />
        </div>

        <div className="InputGroup">
          <label>Restaurante</label>
          <input name="restaurant" type="text" value={formData.restaurant} onChange={handleChange} required />
        </div>

        <button type="submit" className="LoginButton">Cadastrar</button>
        {mensagem && <div className="LoginMessage">{mensagem}</div>}
      </form>
    </div>
  );
}   