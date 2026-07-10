import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  // Pega a rota atual. Isso serve para lembrar de onde o usuário veio.
  // Se ele não estiver autorizado, o app pode mandar ele de volta a essa página
  // depois que fizer login.
  const location = useLocation();

  // Checa se estamos no navegador antes de acessar localStorage.
  // Em algumas renderizações do React, `window` não existe.
  const role = typeof window !== "undefined"
    ? localStorage.getItem("userRole")
    : null;

  // Se o usuário já é administrador, permite mostrar o conteúdo protegido.
  // O `children` é o componente que está dentro deste RequireAdmin.
  if (role === "admin") {
    return children;
  }

  // Se não for admin, redireciona para a página de login.
  // Também passa a rota original em `state.from`.
  // Isso permite que, depois de fazer login, o usuário volte para a página
  // que tentou acessar inicialmente.
  return <Navigate to="/login" state={{ from: location }} replace />;
}
