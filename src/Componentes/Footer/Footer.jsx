import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContent">
                <div className="footerSection">
                    <h3>Sintex</h3>
                    <p>Plataforma de busca e gerenciamento de restaurantes.</p>
                </div>

                <div className="footerSection">
                    <h4>Navegação</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/favoritos">Favoritos</Link></li>
                        <li><Link to="/admin">Admin</Link></li>
                    </ul>
                </div>

                <div className="footerSection">
                    <h4>Contato</h4>
                    <ul>
                        <li><a href="mailto:contato@sintex.com">contato@sintex.com</a></li>
                        <li><a href="tel:+55-1234-5678">(61) 9999-9999</a></li>
                    </ul>
                </div>
            </div>

            <div className="footerBottom">
                <p>© 2026 Sintex. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}