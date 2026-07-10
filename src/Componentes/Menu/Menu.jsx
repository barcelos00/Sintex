import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import MenuLink from "../MenuLink/MenuLink";
import logo from "./imagens/logo.png";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Sincroniza a barra de pesquisa se a URL mudar por fora
  const initialSearch = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    
    // Envia para a Home (ou a rota onde o componente Home está renderizado)
    if (query) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="Menu">
      <div className="MenuLogo">
        <Link to="/">
          <img src={logo} alt="Sintex Logo" className="MenuLogoImage" />
        </Link>
      </div> 

      <div className="MenuLinks">
        <MenuLink to="/">Home</MenuLink>
        <MenuLink to="/about">About</MenuLink>
        <MenuLink to="/favoritos">Favoritos</MenuLink>
        <MenuLink to="/admin">Administrador</MenuLink>

      </div>

      <form className="MenuSearch" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar restaurante"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}