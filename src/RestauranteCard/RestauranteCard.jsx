import { useState, useContext } from "react";
import { FavoritarContext } from "../Context/FavoritarContext";
import "../Pages/Home/Home.css";

export default function RestaurantCard({
  restaurant,
  isOpen,
  onToggle,
  onSubmitFeedback,
  favoritar
}) {

  const [detailTab, setDetailTab] = useState("view");

  const [form, setForm] = useState({
    name: "",
    stars: 5,
    text: ""
  });

  const { setFavoritos } = useContext(FavoritarContext);

  const AoClicar = () => {

    if (favoritar === "Favoritar") {

      setFavoritos(prev => {

        if (prev.some(item => item.id === restaurant.id)) {
          return prev;
        }

        return [...prev, restaurant];

      });

    } else {

      setFavoritos(prev =>
        prev.filter(item => item.id !== restaurant.id)
      );

    }

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.name.trim() || !form.text.trim()) return;

    onSubmitFeedback(restaurant.id, {

      user: form.name.trim(),

      comment: form.text.trim(),

      stars: Number(form.stars),

    });

    setForm({

      name: "",

      stars: 5,

      text: ""

    });

    setDetailTab("view");

  };

  const bannerImage =
    restaurant.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

  return (

    <article className="ClientCard">

      <div
        className="ClientCardHeader"
        style={{
          backgroundImage: `url(${bannerImage})`
        }}
      >

        <div className="HeaderOverlay"></div>

        <div className="HeaderContent">

          <div className="HeaderInfo">

            <h2>{restaurant.name}</h2>

            <p>{restaurant.type}</p>

          </div>

          <button
            className="ActionBtn"
            onClick={onToggle}
          >

            {isOpen

              ? "Ocultar detalhes"

              : "Ver detalhes"}

          </button>

        </div>

        <button
          type="button"
          className="FavoriteBtn"
          onClick={AoClicar}
          aria-label={favoritar === "Favoritar" ? "Adicionar aos favoritos" : "Remover dos favoritos"}
          title={favoritar === "Favoritar" ? "Adicionar aos favoritos" : "Remover dos favoritos"}
        >
          <span className="FavoriteStarIcon">
            {favoritar === "Favoritar" ? "☆" : "★"}
          </span>
        </button>

      </div>

      {isOpen && (

        <div className="ClientDetails">

          <p className="Description">

            {restaurant.description}

          </p>

          <div className="ClientMeta">

            <span>

              Avaliação:

              {restaurant.rating || "N/A"} ⭐

            </span>

            <span>

              {restaurant.type}

            </span>

          </div>

          <div className="DetailTabs">

            <button

              className={`TabBtn ${
                detailTab === "view"
                  ? "active"
                  : ""
              }`}

              onClick={() =>
                setDetailTab("view")
              }

            >

              Cardápio e feedback

            </button>

            <button

              className={`TabBtn ${
                detailTab === "add"
                  ? "active"
                  : ""
              }`}

              onClick={() =>
                setDetailTab("add")
              }

            >

              Adicionar feedback

            </button>

            {(() => {

              const mapLink =

                restaurant.link

                  ? restaurant.link

                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

                    restaurant.address ||

                    restaurant.name

                  )}`;

              return (

                <a

                  href={mapLink}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="ActionBtn MapLink"

                >

                  Ver no mapa

                </a>

              );

            })()}

          </div>

          {detailTab === "view"

            ?

            <>

              <div className="ClientMenu">

                <h3>

                  Cardápio

                </h3>

                <ul>

                  {

                    restaurant.menu?.map(

                      (item,index)=>(

                      <li

                        key={

                          item.id ||

                          index

                        }

                      >

                        <span>

                          {item.dish}

                        </span>

                        <span>

                          {item.price}

                        </span>

                      </li>

                    ))

                  }

                </ul>

              </div>

              <div className="FeedbackList">

                <h3>

                  Feedback dos clientes

                </h3>

                <div className="CommentsCarousel">

                  {

                    restaurant.feedback?.length > 0

                    ?

                    restaurant.feedback.map(

                      fb => (

                      <div

                        key={fb.id}

                        className="CommentCard"

                      >

                        <div className="CommentHeader">

                          <strong>

                            {fb.user}

                          </strong>

                          <span>

                            {fb.stars} ⭐

                          </span>

                        </div>

                        <p className="CommentText">

                          {fb.comment}

                        </p>

                      </div>

                    ))

                    :

                    <p>

                      Nenhum feedback disponível.

                    </p>

                  }

                </div>

              </div>

            </>

            :

            <form

              className="FeedbackForm"

              onSubmit={handleSubmit}

            >

              <h3>

                Deixe seu feedback

              </h3>

              <input

                type="text"

                value={form.name}

                placeholder="Seu nome"

                onChange={(e)=>

                  setForm({

                    ...form,

                    name:e.target.value

                  })

                }

              />

              <select

                value={form.stars}

                onChange={(e)=>

                  setForm({

                    ...form,

                    stars:e.target.value

                  })

                }

              >

                {

                  [5,4,3,2,1]

                  .map(v=>(

                    <option

                      key={v}

                      value={v}

                    >

                      {v}

                    </option>

                  ))

                }

              </select>

              <textarea

                value={form.text}

                rows={4}

                placeholder="Comentário"

                onChange={(e)=>

                  setForm({

                    ...form,

                    text:e.target.value

                  })

                }

              />

              <button

                className="SubmitFeedbackBtn"

                type="submit"

              >

                Enviar feedback

              </button>

            </form>

          }

        </div>

      )}

    </article>

  );

}