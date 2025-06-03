const users = [
  { username: 'jose', password: '1234' },
  { username: 'admin', password: 'admin' },
];

const form = document.getElementById('loginForm');
const message = document.getElementById('message');

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
