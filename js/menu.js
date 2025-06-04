// Variável para armazenar os usuários carregados do JSON
let users = [];

const form = document.getElementById('loginForm');
const message = document.getElementById('message');

// Função para carregar os usuários do arquivo JSON
async function loadUsers() {
  try {
    const response = await fetch('/discursos_scan/js/users.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users = await response.json();
    console.log('Dados de usuários carregados com sucesso.');
  } catch (error) {
    console.error('Erro ao carregar dados de usuários:', error);
    message.style.color = 'red';
    message.textContent = 'Erro ao carregar dados de autenticação. Tente novamente mais tarde.';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); // evita recarregar

  const username = form.username.value.trim();
  const password = form.password.value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    message.style.color = 'green';
    message.textContent = 'Login autorizado! Entrando...';

    setTimeout(() => {
      window.location.href = 'component/homepage.html'; // caminho correto pra sua página
    }, 1000); // delay pra mostrar a mensagem antes de redirecionar

  } else {
    message.style.color = 'red';
    message.textContent = 'Usuário ou senha inválidos!';
  }
});

// Carrega os usuários quando a página é carregada
document.addEventListener('DOMContentLoaded', loadUsers);
