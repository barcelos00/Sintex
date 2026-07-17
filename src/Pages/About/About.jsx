import './About.css';
import daniel from './fotos/daniel.jpg';
import victor from './fotos/barcelos.jpg';
import layanne from './fotos/layanne.jpg';

const desenvolvedores = [
  {
    name: 'Victor Barcelos',
    role: 'Full Stack Developer',
    img: victor,
    profile: 'https://github.com/barcelos00',
    initials: 'VB',
    social: {
      linkedin: 'https://www.linkedin.com/in/victor-santos-barcelos-1381ba17b/',
      instagram: 'https://www.instagram.com/barcelos_9/',
    },
  },
  {
    name: 'Daniel Ferreira',
    role: 'Full Stack Developer',
    img: daniel,
    profile: 'https://github.com/Daniel-Ferreira19',
    initials: 'DF',
    social: {
      linkedin: 'https://www.linkedin.com/in/danielferreira-dev/',
      instagram: 'https://www.instagram.com/danieldev_07/',
    },
  },
  {
    name: 'Layanne Sousa',
    role: 'Full Stack Developer',
    img: layanne,
    profile: 'https://github.com/layannesousa2025',
    initials: 'LS',
    social: {
      linkedin: 'https://www.linkedin.com/in/layanne-sousa-ab64bb336/',
      instagram: 'https://www.instagram.com/layanne_souza_slv/',
    },
  },
];

const IconeGitHub = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const CartaoDesenvolvedor = ({
  name,
  role,
  img,
  profile,
  initials,
  social,
}) => (
  <div className="cartao-desenvolvedor">
    <div className="avatar-desenvolvedor-container">
      <img
        src={img}
        alt={name}
        className="avatar-desenvolvedor"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling.style.display = 'flex';
        }}
      />
      <div className="avatar-desenvolvedor-fallback" aria-hidden="true">
        {initials}
      </div>
    </div>

    <div className="info-desenvolvedor">
      <h3 className="nome-desenvolvedor">{name}</h3>
      <p className="cargo-desenvolvedor">{role}</p>
    </div>

    <div className="redes-sociais-dev">
      <a
        href={profile}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
      >
        <IconeGitHub />
      </a>

      {social.linkedin && (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      )}

      {social.facebook && (
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      )}

      {social.instagram && (
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      )}
    </div>
  </div>
);

const CartaoPilar = ({ title, children }) => (
  <div className="cartao-pilar">
    <h3 className="titulo-pilar">{title}</h3>
    <p className="texto-pilar">{children}</p>
  </div>
);

export default function About() {
  return (
    <main className="container-sobre">
      <header className="hero-sobre">
        <div className="hero-etiqueta">Sobre o projeto</div>
        <h1 className="hero-titulo">Sintex</h1>
        <p className="hero-subtitulo">
          Sistema Integrado de Tecnologia e Experiência
        </p>
      </header>

      <section className="introducao-sobre">
        <p>
          O <strong>Sintex</strong> é uma plataforma inteligente projetada para
          estreitar o laço entre clientes e estabelecimentos gastronômicos,
          transformando avaliações em dados estratégicos e facilitando a
          descoberta de novas experiências.
        </p>
      </section>

      <section className="secao-pilares" aria-label="Missão e visão">
        <CartaoPilar title="Missão">
          Capacitar donos de restaurantes com ferramentas de análise precisas e
          oferecer aos consumidores um espaço transparente para compartilhar e
          encontrar opiniões reais.
        </CartaoPilar>

        <CartaoPilar title="Visão">
          Tornar-se o ecossistema padrão para gestão de feedback e visibilidade
          digital no setor de alimentação, unindo tecnologia de ponta à
          simplicidade de uso.
        </CartaoPilar>

        <CartaoPilar title="Valores">
          Foco na experiência do usuário, transparência absoluta nas avaliações e
          a humanização dos dados para o fortalecimento do comércio local.
        </CartaoPilar>
      </section>

      <section className="secao-desenvolvedores">
        <div className="cabecalho-desenvolvedores">
          <h2 className="titulo-desenvolvedores">Equipe</h2>
          <p className="subtitulo-desenvolvedores">
            As pessoas por trás do Sintex
          </p>
        </div>

        <div className="grade-desenvolvedores">
          {desenvolvedores.map((dev) => (
            <CartaoDesenvolvedor key={dev.name} {...dev} />
          ))}
        </div>
      </section>
    </main>
  );
}