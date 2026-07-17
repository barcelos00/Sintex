import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const getCommentSentiment = (stars) => {
  if (stars >= 4) return "positive"; // ele verifica se a avaliação é 4 ou 5 estrelas
  return "negative"; // ele considera 1, 2 ou 3 estrelas como negativas e coloca no local em que elas irao aparecer como notas baixas
};

export default function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
  });
  const [newRestaurantError, setNewRestaurantError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();

  const handleToggleCreateForm = () => {
    setShowCreateForm((prev) => !prev);
    setNewRestaurant({ name: "", address: "", phone: "", email: "" });
  };

  const handleNewRestaurantChange = (field, value) => {
    setNewRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  const fetchRestaurants = async () => {
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`/Pi_Final/Sintex/backend/api/restaurants.php?admin_id=${adminId}`);
        
        if (response.ok) {
          const result = await response.json();
          const adminRestaurants = result.dados?.restaurantes || result.restaurantes || [];

          const formattedRestaurants = adminRestaurants.map(r => ({
            id: r.id,
            name: r.nome || "",
            address: r.endereco || "",
            phone: r.telefone || "",
            description: r.descricao || "",
            type: r.categoria || "",
            rating: r.avaliacao || "N/A",
            link: r.link || "",
            image: r.foto_url || "",
            
            menu: r.cardapio ? r.cardapio.map(item => ({
              id: item.id,
              dish: item.nome_item,
              price: item.preco,
              description: item.descricao
            })) : [], 
            
            feedback: r.feedbacks ? r.feedbacks.map(f => {
              let extractedStars = 5;
              let cleanText = f.comentario || "Sem comentário"; 
              
              const match = cleanText.match(/^\[(\d) Estrelas\] (.*)/);
              if (match) {
                extractedStars = Number(match[1]);
                cleanText = match[2];
              }

              return {
                id: f.id,
                user: f.nome_cliente || "Cliente Anônimo",
                text: cleanText,
                stars: extractedStars,
                timestamp: new Date(f.criado_em).toLocaleDateString('pt-BR')
              };
            }) : []
          }));

          setRestaurants(formattedRestaurants);
          if (formattedRestaurants.length > 0) {
            setSelectedId(String(formattedRestaurants[0].id));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do PHP.", error);
      }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminId");
    navigate("/login", { replace: true });
  };

  const handleSaveRestaurant = async (updatedRestaurant) => {
    const nextRestaurants = restaurants.map((r) =>
      r.id === updatedRestaurant.id ? updatedRestaurant : r
    );
    setRestaurants(nextRestaurants);

    const adminId = localStorage.getItem("adminId");

    const payload = {
      nome: updatedRestaurant.name,
      categoria: updatedRestaurant.type,
      descricao: updatedRestaurant.description,
      endereco: updatedRestaurant.address,
      telefone: updatedRestaurant.phone,
      link: updatedRestaurant.link,
      foto: updatedRestaurant.image,
      cardapio: updatedRestaurant.menu
    };

    setSaveError("");
    console.log('Enviando PUT para salvar restaurante', { id: updatedRestaurant.id, adminId, payload });

    try {
      const url = `/Pi_Final/Sintex/backend/api/restaurants.php?id=${encodeURIComponent(updatedRestaurant.id)}&admin_id=${encodeURIComponent(adminId)}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Resposta não OK ao salvar:', response.status, text);
        setSaveError('Erro ao salvar: servidor retornou ' + response.status);
        return;
      }

      const result = await response.json();
      console.log('Resposta do PUT:', result);
      if (!result.sucesso) {
        console.error(result.mensagem || "Erro ao salvar no banco de dados.");
        setSaveError(result.mensagem || 'Erro ao salvar alterações.');
        return;
      }

      setSaveError('Alterações salvas com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar no banco de dados.", error);
      setSaveError('Erro ao conectar com o servidor local.');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este restaurante? Esta ação não pode ser desfeita.");
    if (!confirmDelete) return;

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      navigate("/login");
      return;
    }

    console.log('Iniciando exclusão do restaurante', { restaurantId, adminId });

    try {
      const url = `/Pi_Final/Sintex/backend/api/restaurants.php?id=${encodeURIComponent(restaurantId)}&admin_id=${encodeURIComponent(adminId)}`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        const text = await response.text();
        console.error('Resposta não OK do servidor ao deletar:', response.status, text);
        setRestaurants(restaurants); // manter estado
        return;
      }

      const result = await response.json();
      console.log('Resposta do delete:', result);

      if (!result.sucesso) {
        console.error(result.mensagem || "Erro ao excluir restaurante.");
        setDeleteError(result.mensagem || "Erro ao excluir restaurante.");
        return;
      }

      console.log("Restaurante excluído com sucesso.");
      setDeleteError("");
      const updated = restaurants.filter((r) => r.id !== restaurantId);
      setRestaurants(updated);
      setSelectedId(updated.length > 0 ? String(updated[0].id) : "");
    } catch (error) {
      console.error("Erro ao conectar com o servidor local.", error);
      setDeleteError('Erro ao conectar com o servidor local.');
    }
  };

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => String(r.id) === selectedId),
    [selectedId, restaurants]
  );

  return (
    <main className="AdminPage">
      <section className="AdminHeader">
        <h1>Área do Administrador</h1>
        <p>Atualize as informações do seu restaurante, o cardápio e confira o Dashboard de avaliações.</p>
        <div className="AdminHeaderActions">
          <button onClick={handleToggleCreateForm} className="PrimaryButton">
            {showCreateForm ? 'Cancelar cadastro de restaurante' : 'Cadastrar novo restaurante'}
          </button>
          <button onClick={handleLogout} className="LogoutButton">Sair do Sistema</button>
        </div>
      </section>

      {showCreateForm && (
        <article className="AdminCard">
          <h2 style={{ marginBottom: '20px' }}>Cadastrar Novo Restaurante</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Nome do Restaurante</label>
              <input
                className="TextInput"
                type="text"
                value={newRestaurant.name}
                onChange={(e) => handleNewRestaurantChange('name', e.target.value)}
                placeholder="Ex: Pizzaria Mamma Mia"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Endereço</label>
              <input
                className="TextInput"
                type="text"
                value={newRestaurant.address}
                onChange={(e) => handleNewRestaurantChange('address', e.target.value)}
                placeholder="Rua, Número, Bairro"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Telefone</label>
                <input
                  className="TextInput"
                  type="text"
                  value={newRestaurant.phone}
                  onChange={(e) => handleNewRestaurantChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>E-mail</label>
                <input
                  className="TextInput"
                  type="email"
                  value={newRestaurant.email}
                  onChange={(e) => handleNewRestaurantChange('email', e.target.value)}
                  placeholder="contato@restaurante.com"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Cidade</label>
                <input
                  className="TextInput"
                  type="text"
                  value={newRestaurant.city}
                  onChange={(e) => handleNewRestaurantChange('city', e.target.value)}
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Estado (UF)</label>
                <input
                  className="TextInput"
                  type="text"
                  value={newRestaurant.state}
                  onChange={(e) => handleNewRestaurantChange('state', e.target.value)}
                  placeholder="Ex: SP"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              className="PrimaryButton"
              onClick={async () => {
                setNewRestaurantError("");
                const adminId = localStorage.getItem('adminId');
                if (!adminId) {
                  navigate('/login');
                  return;
                }

                if (!newRestaurant.name || !newRestaurant.address) {
                  console.log('Nome e endereço são obrigatórios.');
                  setNewRestaurantError('Nome e endereço são obrigatórios.');
                  return;
                }

                try {
                  console.log('Enviando novo restaurante', { adminId, payload: newRestaurant });
                  const response = await fetch(`/Pi_Final/Sintex/backend/api/restaurants.php?admin_id=${adminId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: newRestaurant.name,
                      address: newRestaurant.address,
                      phone: newRestaurant.phone,
                      email: newRestaurant.email,
                      city: newRestaurant.city,
                      state: newRestaurant.state,
                    }),
                  });

                  const result = await response.json();

                  if (!result.sucesso) {
                    console.log(result.mensagem || 'Erro ao cadastrar restaurante.');
                    setNewRestaurantError(result.mensagem || 'Erro ao cadastrar restaurante.');
                    return;
                  }

                  console.log('Restaurante cadastrado com sucesso!');
                  setNewRestaurantError('Restaurante cadastrado com sucesso!');
                  setShowCreateForm(false);
                  setNewRestaurant({ name: '', address: '', phone: '', email: '' });
                  fetchRestaurants();
                } catch (error) {
                  console.error('Erro ao conectar com o servidor local.');
                  setNewRestaurantError('Erro ao conectar com o servidor local.');
                }
              }}
            >
              Salvar Restaurante
            </button>
            {newRestaurantError && (
              <p style={{ color: newRestaurantError.includes('sucesso') ? 'green' : 'red', marginTop: '10px' }}>{newRestaurantError}</p>
            )}
          </div>
        </article>
      )}

      <article className="AdminCard">
        <div className="RestaurantSelect">
          <label htmlFor="restaurant-select">Seu Restaurante</label>
          <select
            id="restaurant-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name || "Sem Nome"}</option>
            ))}
          </select>
        </div>

        {selectedRestaurant && (
          <RestaurantEditor 
            key={selectedRestaurant.id} 
            restaurant={selectedRestaurant} 
            onSave={handleSaveRestaurant} 
            onDelete={handleDeleteRestaurant}
            deleteError={deleteError}
            saveError={saveError}
          />
        )}
      </article>
    </main>
  );
}

function RestaurantEditor({ restaurant, onSave, onDelete, deleteError, saveError }) {
  const [editName, setEditName] = useState(restaurant.name || "");
  const [editType, setEditType] = useState(restaurant.type || "");
  const [editAddress, setEditAddress] = useState(restaurant.address || "");
  const [editPhone, setEditPhone] = useState(restaurant.phone || "");
  const [editDescription, setEditDescription] = useState(restaurant.description || "");
  const [editLink, setEditLink] = useState(restaurant.link || "");
  const [editImage, setEditImage] = useState(restaurant.image || "");
  const [editMenu, setEditMenu] = useState(restaurant.menu || []);
  const [editing, setEditing] = useState(false);
  const [backup, setBackup] = useState(null);

  const handleMenuItemChange = (index, field, value) => {
    setEditMenu((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const startEditing = () => {
    setBackup({
      name: editName,
      type: editType,
      address: editAddress,
      phone: editPhone,
      description: editDescription,
      link: editLink,
      image: editImage,
      menu: editMenu
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    if (backup) {
      setEditName(backup.name);
      setEditType(backup.type);
      setEditAddress(backup.address);
      setEditPhone(backup.phone);
      setEditDescription(backup.description);
      setEditLink(backup.link);
      setEditImage(backup.image);
      setEditMenu(backup.menu);
    }
    setEditing(false);
    setBackup(null);
  };

  const saveChanges = () => {
    onSave({
      ...restaurant,
      name: editName,
      type: editType,
      address: editAddress,
      phone: editPhone,
      description: editDescription,
      link: editLink,
      image: editImage,
      menu: editMenu
    });
    setEditing(false);
    setBackup(null);
  };

  return (
    <>
      <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
        Perfil do Estabelecimento
      </h2>

      <div className="BasicInfoSection" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nome do Restaurante</label>
          <input className="TextInput" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Ex: Pizzaria Mamma Mia" disabled={!editing} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoria</label>
            <input className="TextInput" type="text" value={editType} onChange={(e) => setEditType(e.target.value)} placeholder="Ex: Italiana, Japonês, Fast Food" disabled={!editing} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Telefone / WhatsApp</label>
            <input className="TextInput" type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Ex: (11) 99999-9999" disabled={!editing} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Endereço Completo</label>
          <input className="TextInput" type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Rua, Número, Bairro, Cidade" disabled={!editing} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descrição / Sobre o Restaurante</label>
          <textarea className="TextArea" rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Conte um pouco sobre a história e os diferenciais do seu restaurante..." disabled={!editing} />
        </div>
      </div>

      <div className="RestaurantLinkSection" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Mídia e Redes Sociais</h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Link da Foto de Capa</label>
          <input className="TextInput" type="url" placeholder="https://link-da-imagem.com/foto.jpg" value={editImage} onChange={(e) => setEditImage(e.target.value)} disabled={!editing} />
          {editImage && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Pré-visualização:</p>
              <img src={editImage} alt="Preview" style={{ width: '120px', height: '80px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ddd' }} />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Link do Google Maps (Opcional)</label>
          <input className="TextInput" type="url" placeholder="Cole aqui o link do seu negócio no Google Maps" value={editLink} onChange={(e) => setEditLink(e.target.value)} disabled={!editing} />
          <small style={{ color: '#666' }}>Se deixar em branco, usaremos o endereço para procurar no mapa.</small>
        </div>
      </div>

      <div className="MenuSection">
        <div className="MenuSectionHeader">
          <h3>Editar Cardápio</h3>
          <button type="button" className="AddMenuBtn" onClick={() => setEditMenu([...editMenu, { dish: "", price: "", description: "" }])} disabled={!editing}>
            + Adicionar Prato
          </button>
        </div>

        {editMenu.length === 0 ? (
          <p className="NoComments">Ainda não há itens no cardápio.</p>
        ) : (
          editMenu.map((item, index) => (
            <div key={index} className="MenuItem">
              <div className="MenuItemRow">
                <div>
                  <label>Nome do Prato</label>
                  <input className="TextInput" value={item.dish || ""} onChange={(e) => handleMenuItemChange(index, "dish", e.target.value)} placeholder="Ex: Pizza Calabresa" disabled={!editing} />
                </div>
                <div>
                  <label>Preço</label>
                  <input className="TextInput" value={item.price || ""} onChange={(e) => handleMenuItemChange(index, "price", e.target.value)} placeholder="Ex: R$ 39,90" disabled={!editing} />
                </div>
              </div>
              <div>
                <label>Descrição do prato (Opcional)</label>
                <textarea className="TextArea" rows={2} value={item.description || ""} onChange={(e) => handleMenuItemChange(index, "description", e.target.value)} placeholder="Ingredientes e detalhes..." disabled={!editing} />
              </div>
              <div className="MenuItemActions">
                <button type="button" className="MenuActionBtn danger" onClick={() => setEditMenu((prev) => prev.filter((_, i) => i !== index))} disabled={!editing}>
                  Remover
                </button>
              </div>
            </div>
          ))
        )}

        <div className="EditorActions">
          {!editing ? (
            <button type="button" className="PrimaryButton" onClick={startEditing}>
              Editar Todas as Alterações
            </button>
          ) : (
            <>
              <button type="button" className="SaveButton" onClick={saveChanges}>
                Salvar Todas as Alterações
              </button>
              <button type="button" className="MenuActionBtn" onClick={cancelEditing}>
                Cancelar Edição
              </button>
            </>
          )}
          <button type="button" className="MenuActionBtn danger" onClick={() => onDelete(restaurant.id)}>
            Excluir Restaurante
          </button>
          {deleteError && (
            <p style={{ color: 'red', marginTop: '8px', width: '100%' }}>{deleteError}</p>
          )}
          {saveError && (
            <p style={{ color: saveError.includes('sucesso') ? 'green' : 'red', marginTop: '8px', width: '100%' }}>{saveError}</p>
          )}
        </div>

      </div>

      <FeedbackViewer comments={restaurant.feedback || []} />
    </>
  );
}

function FeedbackViewer({ comments }) {
  const [filterType, setFilterType] = useState("all");

  const filteredComments = useMemo(() => {
    if (filterType === "all") return comments;
    return comments.filter((comment) => getCommentSentiment(comment.stars) === filterType);
  }, [comments, filterType]);

  const total = comments.length;
  const average = total === 0 ? 0 : (comments.reduce((acc, c) => acc + c.stars, 0) / total).toFixed(1);
  const positives = comments.filter(c => getCommentSentiment(c.stars) === "positive").length;
  const negatives = comments.filter(c => getCommentSentiment(c.stars) === "negative").length;

  return (
    <div className="FeedbackSection" style={{marginTop: '40px', borderTop: '2px solid #f0f0f0', paddingTop: '20px'}}>
      <h3>Dashboard de Avaliações</h3>
      
      <div className="DashboardGrid">
        <div className="DashCard">
          <h4>Nota Geral</h4>
          <span className="DashValue">{average} ⭐</span>
        </div>
        <div className="DashCard">
          <h4>Total de Avaliações</h4>
          <span className="DashValue">{total}</span>
        </div>
        <div className="DashCard positive">
          <h4>Positivos</h4>
          <span className="DashValue">{positives}</span>
        </div>
        <div className="DashCard negative">
          <h4>Atenção (Críticas)</h4>
          <span className="DashValue">{negatives}</span>
        </div>
      </div>

      <div className="FeedbackFilter" style={{ marginTop: '20px' }}>
        <button className={`FilterBtn ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>
          Todos
        </button>
        <button className={`FilterBtn positive ${filterType === "positive" ? "active" : ""}`} onClick={() => setFilterType("positive")}>
          ✅ Melhores (4 e 5 estrelas)
        </button>
        <button className={`FilterBtn negative ${filterType === "negative" ? "active" : ""}`} onClick={() => setFilterType("negative")}>
          ❌ Piores (1 e 3 estrelas)
        </button>
      </div>
      
      <div className="CommentsCarousel">
        {filteredComments?.length > 0 ? (
          filteredComments.map((comment) => (
            <div key={comment.id} className={`CommentCard ${getCommentSentiment(comment.stars)}`}>
              <div className="CommentHeader">
                <strong>{comment.user}</strong>
                <span className="CommentTime">{comment.stars} ⭐</span>
              </div>
              <p className="CommentText">{comment.text}</p>
              <small style={{display: 'block', marginTop: '10px', color: '#666'}}>{comment.timestamp}</small>
            </div>
          ))
        ) : (
          <p className="NoComments">Nenhum feedback nesta categoria.</p>
        )}
      </div>
    </div>
  );
}