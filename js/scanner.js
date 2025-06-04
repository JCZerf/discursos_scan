let allDiscursos = []; // Variável para armazenar todos os discursos
const localStorageKey = 'discursosData'; // Chave para o localStorage
const itemsPerPage = 20; // Número de itens por página
let currentPage = 1; // Página atual
let filteredDiscursos = []; // Discursos filtrados pela busca

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const searchIcon = document.querySelector('.search-icon'); // Novo elemento da lupa
const mascotLupa = document.querySelector('.mascot-lupa'); // Nova referência

// Função para carregar os dados (do localStorage ou do JSON inicial)
async function loadDiscursosData() {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
        console.log('Carregando dados do localStorage...');
        allDiscursos = JSON.parse(storedData);
        filteredDiscursos = [...allDiscursos]; // Inicialmente, todos os discursos
        displayResults(filteredDiscursos); // Exibe todos inicialmente
    } else {
        console.log('Carregando dados do JSON inicial...');
        try {
            const response = await fetch('discursos_data.json'); // Caminho relativo para servir via HTTP
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allDiscursos = await response.json();
            localStorage.setItem(localStorageKey, JSON.stringify(allDiscursos)); // Salva no localStorage pela primeira vez
            console.log('Dados carregados do JSON e salvos no localStorage.');
            filteredDiscursos = [...allDiscursos]; // Inicialmente, todos os discursos
            displayResults(filteredDiscursos); // Exibe todos inicialmente
        } catch (error) {
            console.error('Erro ao carregar dados dos discursos:', error);
            resultsContainer.innerHTML = '<div class="status-message error">Erro ao carregar dados dos discursos. Verifique o console.</div>';
        }
    }
}

// Função para exibir os resultados na tela como tabela
function displayResults(resultados) {
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    if (resultados.length === 0) {
        resultsContainer.innerHTML = '<div class="status-message info">Nenhum discurso encontrado.</div>';
        return;
    }

    // Calcula os índices para paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, resultados.length);
    const pageResults = resultados.slice(startIndex, endIndex);

    // Cria a tabela
    const table = document.createElement('table');
    table.className = 'results-table';
    
    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const thNumero = document.createElement('th');
    thNumero.textContent = 'Nº';
    
    const thTitulo = document.createElement('th');
    thTitulo.textContent = 'Título do Discurso';
    
    const thAnotacoes = document.createElement('th');
    thAnotacoes.textContent = 'Anotações';
    
    headerRow.appendChild(thNumero);
    headerRow.appendChild(thTitulo);
    headerRow.appendChild(thAnotacoes);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    
    pageResults.forEach((d, index) => {
        const row = document.createElement('tr');
        row.className = 'result-row';
        row.id = `discurso-${d.numero}`; // Adiciona ID para navegação
        
        // Célula do número
        const tdNumero = document.createElement('td');
        tdNumero.className = 'discurso-numero';
        tdNumero.textContent = d.numero;
        
        // Célula do título
        const tdTitulo = document.createElement('td');
        tdTitulo.className = 'discurso-titulo';
        tdTitulo.textContent = d.titulo;
        
        // Célula das anotações
        const tdAnotacoes = document.createElement('td');
        
        const anotacoesInput = document.createElement('textarea');
        anotacoesInput.className = 'anotacoes-field';
        anotacoesInput.value = d.anotacoes || ''; // Usa valor existente ou string vazia
        anotacoesInput.placeholder = 'Adicione suas anotações aqui...';
        anotacoesInput.dataset.numero = d.numero; // Liga ao número do discurso
        
        // Evento para salvar anotações ao perder o foco
        anotacoesInput.addEventListener('blur', handleAnotacaoChange);
        
        tdAnotacoes.appendChild(anotacoesInput);
        
        row.appendChild(tdNumero);
        row.appendChild(tdTitulo);
        row.appendChild(tdAnotacoes);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    resultsContainer.appendChild(table);
    
    // Adiciona paginação se necessário
    if (resultados.length > itemsPerPage) {
        addPagination(resultados.length);
    }
}

// Função para adicionar paginação
function addPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    // Botão anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = '«';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults(filteredDiscursos);
        }
    });
    paginationDiv.appendChild(prevButton);
    
    // Botões de página
    const maxButtons = 5; // Máximo de botões de página para mostrar
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayResults(filteredDiscursos);
        });
        paginationDiv.appendChild(pageButton);
    }
    
    // Botão próximo
    const nextButton = document.createElement('button');
    nextButton.textContent = '»';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayResults(filteredDiscursos);
        }
    });
    paginationDiv.appendChild(nextButton);
    
    resultsContainer.appendChild(paginationDiv);
}

// Função para lidar com a mudança nas anotações
function handleAnotacaoChange(event) {
    const numero = parseInt(event.target.dataset.numero, 10);
    const newAnotacao = event.target.value;

    // Encontra o índice do discurso no array allDiscursos
    const index = allDiscursos.findIndex(d => d.numero === numero);

    if (index !== -1) {
        allDiscursos[index].anotacoes = newAnotacao;
        // Salva o array atualizado no localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(allDiscursos));
        console.log(`Anotação para discurso ${numero} salva.`);
    } else {
        console.error(`Discurso com número ${numero} não encontrado para salvar anotação.`);
    }
}

// Event listener para o botão de busca (com animação da lupa)
searchButton.addEventListener('click', function() {
    const termo = searchInput.value.trim().toLowerCase();
    
    
    
    // Ativa estado de busca com animação
    //
    this.classList.add('searching');
    mascotLupa.classList.add('searching');
    
    // Simula tempo de processamento (remova em produção)
    setTimeout(() => {
        if (!termo) {
        filteredDiscursos = [...allDiscursos];
        currentPage = 1;
        displayResults(filteredDiscursos);
        } else {
        filteredDiscursos = allDiscursos.filter(d =>
            d.numero.toString() === termo || d.titulo.toLowerCase().includes(termo)
        );
        currentPage = 1;
        displayResults(filteredDiscursos);
    }
        
        // Feedback visual diferente se encontrou resultados
        if (filteredDiscursos.length > 0) {
            mascotLupa.classList.remove('searching');
            mascotLupa.classList.add('found');
            setTimeout(() => {
                mascotLupa.classList.remove('found');
            }, 1000);
            } else {
            mascotLupa.classList.remove('searching');
        }
        // Desativa estado de busca
        this.classList.remove('searching');
        
        // Destaque do resultado único
          // Destaque do resultado único
    if (filteredDiscursos.length === 1) {
      const targetElement = document.getElementById(`discurso-${filteredDiscursos[0].numero}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.style.backgroundColor = '#e8f0fa';
        targetElement.style.boxShadow = '0 0 8px rgba(0, 115, 206, 0.5)';
        setTimeout(() => {
          targetElement.style.backgroundColor = '';
          targetElement.style.boxShadow = '';
        }, 2000);
      }
    }
  }, 800);
});

// Event listener para pesquisar ao pressionar Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Carrega os dados ao iniciar a página
document.addEventListener('DOMContentLoaded', loadDiscursosData);