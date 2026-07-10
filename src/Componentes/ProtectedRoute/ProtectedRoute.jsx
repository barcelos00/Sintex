import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Verifica se a flag "userRole" no localStorage é "admin"
  const userRole = localStorage.getItem("userRole");

  // Se for admin, o <Outlet /> renderiza a rota filha (<Admin />)
  // Se não for, redireciona o usuário para a tela de login
  return userRole === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
}