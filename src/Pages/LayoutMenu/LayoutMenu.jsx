import { Outlet } from "react-router-dom";
import Banner from "../../Componentes/Banner/Banner";
import Footer from "../../Componentes/Footer/Footer";
export default function LayoutMenu() {
    return (
        <>
       <Banner />
       <Outlet />
         <Footer />
       </>
    )
}