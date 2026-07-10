import style from "./MenuLink.module.css"
import { Link, useLocation } from "react-router-dom";

// Componente de link do menu. Marca o link ativo.
export default function MenuLink({ to, children }) {
    const localizacao = useLocation();
    const activeClass = localizacao.pathname === to ? style.active : "";

    return (
        <Link
          to={to}
          className={`${style.link} ${activeClass}`}
        >
            {children}
        </Link>
    )
} 