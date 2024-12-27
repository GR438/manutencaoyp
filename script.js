// Lista de placas dos veículos
const placas = [
    "PNE6975", "PNE6925", "PNE6855", "PND9445", "PMX1039", "PMX0959", "PMX0879",
    "OSU4375", "OSU4025", "NUX8074", "HWX4232", "HWX4222", "HWK8419"
  ];
  
  // Inicializa o Firebase
  const db = getDatabase(app);
  
  // Função para inicializar botões de placas
  function inicializarPlacas(tipo) {
    const divPlacas = document.getElementById(tipo);
    divPlacas.innerHTML = ""; // Limpar a div
    placas.forEach(placa => {
      const button = document.createElement("button");
      button.innerText = placa;
      button.classList.add("placa-button");
      button.onclick = () => {
        if (tipo === "placas-pendentes") {
          mostrarManutencaoPorPlaca(placa);
        } else if (tipo === "placas-cadastro") {
          cadastrarManutencao(placa);
        }
      };
      divPlacas.appendChild(button);
    });
  }
  
  // Função para entrar na tela de manutenção corretiva
  function entrarCorretiva() {
    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-opcoes-corretiva").style.display = "block";
  }
  
  // Função para voltar para a tela inicial
  function voltarParaTelaInicial() {
    document.getElementById("tela-opcoes-corretiva").style.display = "none";
    document.getElementById("tela-inicial").style.display = "block";
  }
  
  // Função para mostrar manutenções pendentes
  function mostrarManutencaoPendentes() {
    document.getElementById("tela-opcoes-corretiva").style.display = "none";
    document.getElementById("manutencao-pendentes").style.display = "block";
    inicializarPlacas("placas-pendentes");
  }
  
  // Função para cadastrar manutenção
  function mostrarCadastrarManutencao() {
    document.getElementById("tela-opcoes-corretiva").style.display = "none";
    document.getElementById("cadastrar-manutencao").style.display = "block";
    inicializarPlacas("placas-cadastro");
  }
  
  // Cadastrar manutenção para uma placa específica
  function cadastrarManutencao(placa) {
    const descricao = prompt("Qual necessidade de manutenção você visualizou para este veículo?");
    if (descricao) {
      // Referência do banco de dados Firebase para a placa
      const manutencaoRef = ref(db, 'manutencoes/' + placa);
  
      // Obter as manutenções existentes da placa
      get(manutencaoRef).then((snapshot) => {
        const manutencoes = snapshot.val() || [];
        
        // Adicionar a nova manutenção à lista
        manutencoes.push({ descricao, encerrada: false });
  
        // Salvar a lista de manutenções no Firebase
        set(manutencaoRef, manutencoes).then(() => {
          alert("Manutenção cadastrada com sucesso!");
        }).catch((error) => {
          alert("Erro ao cadastrar manutenção: " + error.message);
        });
      });
    }
  }
  
  // Função para mostrar manutenções pendentes para uma placa
  function mostrarManutencaoPorPlaca(placa) {
    const manutencaoRef = ref(db, 'manutencoes/' + placa);
    get(manutencaoRef).then((snapshot) => {
      const manutencoesDaPlaca = snapshot.val() || [];
      const divPlacas = document.getElementById("placas-pendentes");
      divPlacas.innerHTML = `<h3>Manutenções para ${placa}</h3>`;
  
      manutencoesDaPlaca.forEach((manutencao, index) => {
        if (!manutencao.encerrada) {
          const div = document.createElement("div");
          div.classList.add("manutencao-list");
          div.innerHTML = `
            <p>${manutencao.descricao}</p>
            <button onclick="encerrarManutencao('${placa}', ${index})" class="manutencao-button">Encerrar</button>
          `;
          divPlacas.appendChild(div);
        }
      });
    });
  }
  
  // Função para encerrar manutenção
  function encerrarManutencao(placa, index) {
    const manutencaoRef = ref(db, 'manutencoes/' + placa);
    get(manutencaoRef).then((snapshot) => {
      const manutencoesDaPlaca = snapshot.val() || [];
      
      // Marcar a manutenção como encerrada
      manutencoesDaPlaca[index].encerrada = true;
  
      // Salvar as mudanças no Firebase
      set(manutencaoRef, manutencoesDaPlaca).then(() => {
        alert("Manutenção encerrada com sucesso!");
        mostrarManutencaoPendentes();
      }).catch((error) => {
        alert("Erro ao encerrar manutenção: " + error.message);
      });
    });
  }
  
  // Função para voltar para a tela de opções da manutenção corretiva
  function voltarParaOpcoesCorretiva() {
    document.getElementById("manutencao-pendentes").style.display = "none";
    document.getElementById("tela-opcoes-corretiva").style.display = "block";
  }
  



























