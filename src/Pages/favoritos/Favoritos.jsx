import { useContext, useState } from "react";
import { FavoritarContext } from "../../Context/FavoritarContext";
import RestaurantCard from "../../RestauranteCard/RestauranteCard";

export default function Favorita() {

  const { favoritos } = useContext(FavoritarContext);

  const [selectedId, setSelectedId] = useState(null);

  return (

    <main className="ClientPage">

      <section className="ClientHeader">

        <h1>Favoritos</h1>

      </section>

      <section className="ClientList">

        {favoritos.length === 0 ? (

          <p>Nenhum restaurante favoritado.</p>

        ) : (

          favoritos.map((restaurant) => (

            <RestaurantCard

              key={restaurant.id}

              restaurant={restaurant}

              isOpen={selectedId === restaurant.id}

              onToggle={() =>
                setSelectedId(prev =>
                  prev === restaurant.id
                    ? null
                    : restaurant.id
                )
              }

              favoritar="Desfavoritar"

              onSubmitFeedback={() => {}}

            />

          ))

        )}

      </section>

    </main>

  );

}