import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../../RestauranteCard/RestauranteCard";
import { useContext } from "react";
import { FavoritarContext } from "../../Context/FavoritarContext";
import "./Home.css";

const calculateAverageRating = (feedbackList) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) return null;
  const sum = feedbackList.reduce(
    (acc, feedback) => acc + Number(feedback.stars || 5),
    0
  );
  return (sum / feedbackList.length).toFixed(1);
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const { favoritos } = useContext(FavoritarContext);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        // CORREÇÃO 1: Caminho absoluto apontando para o XAMPP
        const response = await fetch(
          "http://localhost/Sintex/backend/api/restaurants.php"
        );

        if (response.ok) {
          const result = await response.json();

          const backendRestaurants =
            result.dados?.restaurantes || result.restaurantes || [];

          const formattedRestaurants = backendRestaurants.map((r) => ({
            id: r.id,
            name: r.nome || "Restaurante sem nome",
            address: r.endereco || "",
            type: r.categoria || "Categoria não definida",
            description: r.descricao || "Nenhuma descrição cadastrada.",
            link: r.link || "",
            image: r.foto_url || "",

            menu: r.cardapio
              ? r.cardapio.map((item) => ({
                  id: item.id,
                  dish: item.nome_item,
                  price: item.preco,
                  description: item.descricao,
                }))
              : [],

            feedback: r.feedbacks
              ? r.feedbacks.map((f) => {
                  let stars = 5;
                  let cleanText = f.comentario || "Sem comentário";

                  const match = cleanText.match(/^\[(\d) Estrelas\] (.*)/);
                  if (match) {
                    stars = Number(match[1]);
                    cleanText = match[2];
                  }

                  return {
                    id: f.id,
                    user: f.nome_cliente || "Cliente Anônimo",
                    comment: cleanText,
                    stars,
                    timestamp: new Date(
                      f.criado_em
                    ).toLocaleDateString("pt-BR"),
                  };
                })
              : [],
          }));

          formattedRestaurants.forEach((r) => {
            r.rating = calculateAverageRating(r.feedback) || "N/A";
          });

          setRestaurants(formattedRestaurants);
        }
      } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
      }
    }

    loadRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!query) return restaurants;

    return restaurants.filter((r) => {
      return [r.name, r.type, r.description].some((field) =>
        field.toLowerCase().includes(query)
      );
    });
  }, [query, restaurants]);

  const handleAddFeedback = async (restaurantId, newFeedback) => {
    const payload = {
      restaurante_id: restaurantId,
      nome_cliente: newFeedback.user,
      comentario: `[${newFeedback.stars} Estrelas] ${newFeedback.comment}`,
    };

    try {
      // CORREÇÃO 2: Caminho absoluto limpo e correto
      const response = await fetch(
        "http://localhost/Sintex/backend/api/feedbacks.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.sucesso || result.success) {
        const updated = restaurants.map((r) => {
          if (r.id !== restaurantId) return r;

          const newComment = {
            id: result.dados?.id || Date.now(),
            user: newFeedback.user,
            comment: newFeedback.comment,
            stars: newFeedback.stars,
            timestamp: new Date().toLocaleDateString("pt-BR"),
          };

          const updatedFeedback = [newComment, ...r.feedback];

          return {
            ...r,
            feedback: updatedFeedback,
            rating: calculateAverageRating(updatedFeedback),
          };
        });

        setRestaurants(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="ClientPage">
      <section className="ClientHeader">
        <h1>Área do Cliente</h1>
        <p>Escolha um restaurante e veja os detalhes.</p>
      </section>

      <section className="ClientList">
        <p className="SearchInfo">
          {query
            ? `Resultados para "${query}"`
            : "Todos os restaurantes disponíveis."}
        </p>

        {filteredRestaurants.length === 0 ? (
          <div className="EmptyState">
            <p>Nenhum restaurante encontrado.</p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant) => {
            const isFavorite = favoritos.some((item) => item.id === restaurant.id);

            return (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isOpen={selectedId === restaurant.id}
                onToggle={() =>
                  setSelectedId((prev) =>
                    prev === restaurant.id ? null : restaurant.id
                  )
                }
                favoritar={isFavorite ? "Desfavoritar" : "Favoritar"}
                onSubmitFeedback={handleAddFeedback}
              />
            );
          })
        )}
      </section>
    </main>
  );
}