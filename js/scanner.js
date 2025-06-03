const discursos = [
  { numero: 1, titulo: 'O Amor Nunca Falha' },
  { numero: 2, titulo: 'Amor e Fé em Tempos Difíceis' },
  { numero: 3, titulo: 'O Maior dos Sentimentos: Amor' },
  { numero: 4, titulo: 'Tenha Fé em Tempos de Crise' },
  { numero: 5, titulo: 'Perseverança no Serviço a Deus' },
];

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', () => {
  const termo = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = '';

  if (!termo) {
    resultsContainer.innerHTML = '<p style="color: #888;">Digite algo para pesquisar.</p>';
    return;
  }

  const resultados = discursos.filter(d =>
    d.numero.toString() === termo || d.titulo.toLowerCase().includes(termo)
  );

  if (resultados.length === 0) {
    resultsContainer.innerHTML = '<p style="color: red;">Nenhum discurso encontrado.</p>';
    return;
  }

  resultados.forEach((d) => {
    const item = document.createElement('div');
    item.classList.add('result-item');
    item.innerHTML = `<strong>Discurso ${d.numero}</strong> — ${d.titulo}`;
    resultsContainer.appendChild(item);
  });
});
