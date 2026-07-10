import "./paginaderro.css";

export default function PaginaDeErro() {
  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <h2 className="error-title">Página não encontrada</h2>
      <p className="error-text">
        Opa! A página que você tentou acessar não existe ou foi removida.
      </p>

      <a href="/" className="error-button">
        Voltar para a página inicial
      </a>
    </div>
  );
}