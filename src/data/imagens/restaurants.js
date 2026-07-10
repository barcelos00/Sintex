// ============================================
// dados/restaurants.js
// Banco de dados local para uso no React
// Substitui a API enquanto o back-end não está pronto
// ============================================


// ─── RESTAURANTES ────────────────────────────────────────────


export const restaurantes = [
  {
    id: 1,
    nome: "Fortunata",
    endereco: "SHIS QI 09, Bloco C,Loja 6 - Lago Sul, Brasília.",
    descricao: "Comida Italina de verdade, feita com amor.",
    ImageData: "/fortuna.png",
    categoria: "com inspiração francesa, italiana e com apelo afetivo.",
    criado_em: "2024-01-10T10:00:00Z",
  },
  {
  id: 2,
  nome: "Pizza Roma",
  endereco: "Av. Brasil, 456 - Jardim Europa",
  descricao: "As melhores pizzas artesanais da cidade.",
  ImageData: "/pizzaroma.png",
  categoria: "Italiana",
  criado_em: "2024-01-12T10:00:00Z",
},

  {
    id: 3,
    nome: "Burger Station",
    endereco: "Rua 7 de Setembro, 789 - Centro",
    descricao: "Hambúrgueres artesanais e batatas crocantes.",
    ImageData: "/BurgerStation.png",
    categoria: "Americana",
    criado_em: "2024-01-15T10:00:00Z",
  },

   {
    id: 4,
    nome: "Maria Do Sertão",
    endereco: "R. do Forró, 120 - Setor Central, Brasília - DF",
    descricao: "Comida nordestina caseira: carne de sol, baião e tapioca.",
    ImageData: "/MariaDoSertao.png",
    categoria: "Nordestina",
    criado_em: "2024-03-05T11:20:00Z",
  },

   {
    id: 5,
    nome: "São Paulo 21",
    endereco: "Av. Paulista, 2100 - Bela Vista, São Paulo - SP",
    descricao: "Cozinha contemporânea com petiscos gourmet e drinks especiais.",
    ImageData: "/SaoPaulo21.png",
    categoria: "Contemporânea",
    criado_em: "2024-04-18T19:45:00Z",
  },
];
 
// ─── PRODUTOS ─────────────────────────────────────────────────
export const produtos = [
  {
    id: 1,
    restaurante_id: 1,
    nome: "Baião de Dois",
    preco: 28.90,
    imagem_url: "https://exemplo.com/img/baiao.jpg",
    descricao: "Arroz, feijão verde, carne seca e queijo coalho.",
    criado_em: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    restaurante_id: 1,
    nome: "Carne de Sol",
    preco: 35.00,
    imagem_url: "https://exemplo.com/img/carne-sol.jpg",
    descricao: "Carne de sol grelhada com manteiga de garrafa.",
    criado_em: "2024-01-10T10:00:00Z",
  },
  {
    id: 3,
    restaurante_id: 2,
    nome: "Pizza Margherita",
    preco: 42.00,
    imagem_url: "https://exemplo.com/img/margherita.jpg",
    descricao: "Molho de tomate, mussarela e manjericão fresco.",
    criado_em: "2024-01-12T10:00:00Z",
  },
  {
    id: 4,
    restaurante_id: 2,
    nome: "Pizza Calabresa",
    preco: 45.00,
    imagem_url: "https://exemplo.com/img/calabresa.jpg",
    descricao: "Calabresa fatiada com cebola roxa e azeitona.",
    criado_em: "2024-01-12T10:00:00Z",
  },
  {
    id: 5,
    restaurante_id: 3,
    nome: "Classic Burger",
    preco: 32.00,
    imagem_url: "https://exemplo.com/img/classic.jpg",
    descricao: "Blend 180g, queijo cheddar, alface e tomate.",
    criado_em: "2024-01-15T10:00:00Z",
  },
  {
    id: 6,
    restaurante_id: 3,
    nome: "Batata Frita",
    preco: 15.00,
    imagem_url: "https://exemplo.com/img/batata.jpg",
    descricao: "Batatas crocantes com tempero especial da casa.",
    criado_em: "2024-01-15T10:00:00Z",
  },
  {
    id: 7,
    restaurante_id: 4,
    nome: "Carne de Sol com Macaxeira",
    preco: 38.50,
    imagem_url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    descricao: "Carne de sol desfiada com macaxeira na manteiga de garrafa.",
    criado_em: "2024-03-10T13:00:00Z",
  },
  {
    id: 8,
    restaurante_id: 4,
    nome: "Tapioca com Coco",
    preco: 18.00,
    imagem_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    descricao: "Tapioca doce com coco ralado e leite condensado.",
    criado_em: "2024-03-10T13:00:00Z",
  },
  {
    id: 9,
    restaurante_id: 5,
    nome: "Risoto de Funghi",
    preco: 48.00,
    imagem_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    descricao: "Risoto cremoso de funghi com parmesão e azeite trufado.",
    criado_em: "2024-04-20T18:30:00Z",
  },
  {
    id: 10,
    restaurante_id: 5,
    nome: "Bruschetta de Tomate",
    preco: 22.00,
    imagem_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    descricao: "Pão crocante com tomate, manjericão e azeite.",
    criado_em: "2024-04-20T18:30:00Z",
  },
];
 
// ─── FEEDBACKS ────────────────────────────────────────────────
export const feedbacks = [
  {
    id: 1,
    restaurante_id: 1,
    nota: 6,
    ponto_positivo: "Comida deliciosa e atendimento ótimo!",
    ponto_negativo: "Fila um pouco longa no almoço.",
    criado_em: "2024-02-01T14:30:00Z",
  },
  {
    id: 2,
    restaurante_id: 1,
    nota: 7,
    ponto_positivo: "Sabor autêntico, voltarei com certeza.",
    ponto_negativo: null,
    criado_em: "2024-02-05T18:00:00Z",
  },
  {
    id: 3,
    restaurante_id: 2,
    nota: 5,
    ponto_positivo: "Pizza chegou quentinha e bem montada.",
    ponto_negativo: "Demora um pouco no delivery.",
    criado_em: "2024-02-03T20:00:00Z",
  },
  {
    id: 4,
    restaurante_id: 3,
    nota: 4,
    ponto_positivo: "Hambúrguer suculento e bem temperado.",
    ponto_negativo: "Poderia ter mais opções vegetarianas.",
    criado_em: "2024-02-07T13:00:00Z",
  },
  {
    id: 5,
    restaurante_id: 4,
    nota: 5,
    ponto_positivo: "O sabor do baião de dois é incrível e o tempero é autêntico.",
    ponto_negativo: "Ambiente um pouco barulhento na hora do jantar.",
    criado_em: "2024-03-08T20:15:00Z",
  },
  {
    id: 6,
    restaurante_id: 4,
    nota: 4,
    ponto_positivo: "Atendimento rápido e a tapioca com coco estava deliciosa.",
    ponto_negativo: "Poderia ter uma opção de sobremesa salgada.",
    criado_em: "2024-03-10T14:40:00Z",
  },
  {
    id: 7,
    restaurante_id: 5,
    nota: 5,
    ponto_positivo: "Os petiscos gourmet estavam impecáveis e muito bem apresentados.",
    ponto_negativo: "As opções de drinks são boas, mas ainda faltam coquetéis mais clássicos.",
    criado_em: "2024-04-22T19:25:00Z",
  },
  {
    id: 8,
    restaurante_id: 5,
    nota: 4,
    ponto_positivo: "O risoto estava cremoso e muito saboroso.",
    ponto_negativo: "O preço é um pouco alto, mas a qualidade compensa.",
    criado_em: "2024-04-23T21:10:00Z",
  },
];

// ============================================
// FUNÇÕES AUXILIARES
// Simulam as chamadas que virão da API futuramente
// ============================================
 
function formatPrice(value) {
  return typeof value === "number" ? `R$ ${value.toFixed(2)}` : value;
}
 
function createRestaurantData(restaurant) {
  const products = getProdutosByRestaurante(restaurant.id);
  const feedbackList = getFeedbacksByRestaurante(restaurant.id);
 
  return {
    ...restaurant,
    link: restaurant.link || "",
    name: restaurant.nome,
    description: restaurant.descricao,
    type: restaurant.categoria,
    rating: getMediaNota(restaurant.id),
    menu: products.map((product) => ({
      dish: product.nome,
      price: formatPrice(product.preco),
      description: product.descricao,
      imagem_url: product.imagem_url,
    })),
    feedback: feedbackList.map((item) => ({
      user: `Cliente ${item.id}`,
      comment: item.ponto_positivo || item.ponto_negativo || "Nenhum comentário",
      stars: item.nota,
    })),
    positives: feedbackList
      .map((item) => item.ponto_positivo)
      .filter(Boolean),
    negatives: feedbackList
      .map((item) => item.ponto_negativo)
      .filter(Boolean),
  };
}
 
/** Retorna todos os restaurantes */
export function getRestaurantes() {
  return restaurantes.map(createRestaurantData);
}
 
export function getRestaurants() {
  return getRestaurantes();
}
 
/** Retorna um restaurante pelo id */
export function getRestauranteById(id) {
  const restaurant = restaurantes.find((r) => r.id === Number(id)) || null;
  return restaurant ? createRestaurantData(restaurant) : null;
}
 
/** Retorna os produtos de um restaurante */
export function getProdutosByRestaurante(restauranteId) {
  return produtos.filter((p) => p.restaurante_id === Number(restauranteId));
}
 
/** Retorna os feedbacks de um restaurante */
export function getFeedbacksByRestaurante(restauranteId) {
  return feedbacks.filter((f) => f.restaurante_id === Number(restauranteId));
}
 
/** Calcula a média de nota de um restaurante */
export function getMediaNota(restauranteId) {
  const lista = getFeedbacksByRestaurante(restauranteId);
  if (lista.length === 0) return null;
  const soma = lista.reduce((acc, f) => acc + f.nota, 0);
  return (soma / lista.length).toFixed(1);
}
 
/** Retorna todos os restaurantes com a média de nota calculada */
export function getRestaurantesComMedia() {
  return restaurantes.map((r) => ({
    ...r,
    media_nota: getMediaNota(r.id),
    total_avaliacoes: getFeedbacksByRestaurante(r.id).length,
  }));
}