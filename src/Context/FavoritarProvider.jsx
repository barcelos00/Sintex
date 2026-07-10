import { useState } from "react";
import { FavoritarContext } from "./FavoritarContext";

export default function FavoritarProvider({ children }) {

    const [favoritos, setFavoritos] = useState([]);

    return (
        <FavoritarContext.Provider
            value={{ favoritos, setFavoritos }}
        >
            {children}
        </FavoritarContext.Provider>
    );
}