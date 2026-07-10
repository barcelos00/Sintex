import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Admin from "./Pages/Admin/Admin";
import RequireAdmin from "./Routes/RequireAdmin";
import Menu from "./Componentes/Menu/Menu";
import LayoutMenu from "./Pages/LayoutMenu/LayoutMenu";
import PaginaDeErro from "./PaginaDeErro/paginaderro";
import ScrollToTop from "./Pages/ScrollToTop/ScrollToTop";
import Login from "./Componentes/Login/Login";
import RegisterAdmin from "./Componentes/Login/RegisterAdmin";
import Favorita from "./Pages/favoritos/Favoritos";

export default function App() {
  return (
    <>
      <Menu />
      <ScrollToTop />

      <Routes>
        {/* Grupo de rotas que compartilham o mesmo Layout de Menu */}
        <Route path="/" element={<LayoutMenu />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          {/* Rota do Admin protegida pelo componente RequireAdmin */}
          <Route path="admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="favoritos" element={<Favorita />} />
        </Route>

        {/* Rotas autônomas (sem o LayoutMenu poluindo o visual) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="*" element={<PaginaDeErro />} />
      </Routes>
    </>
  );
}