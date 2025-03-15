async function carregarProdutos() {
    const container = document.getElementById("productsContainer");
    const loadingMessage = document.createElement("div");
    loadingMessage.innerHTML = "Carregando produtos...";
    container.appendChild(loadingMessage);  // Adiciona a mensagem ao container
    let produtos = [];

    try {
        // Tenta buscar os produtos da API
        localStorage.clear(); // Limpa o LocalStorage antes de buscar novos produtos
        const response = await fetch(`${API_URL}/produtos`);  // Requisição para listar os produtos da API
        if (!response.ok) throw new Error("API não disponível");
        produtos = await response.json();

        // Atualiza o LocalStorage com os produtos da API
        localStorage.setItem("produtos", JSON.stringify(produtos));
        alert("Todos os produtos foram salvos localmente. Agora você pode desligar a API.");
    } catch (error) {
        console.error("Erro ao carregar produtos da API:", error);

        // Carrega os produtos do LocalStorage se a API estiver offline
        const produtosSalvos = localStorage.getItem("produtos");
        if (produtosSalvos) {
            produtos = JSON.parse(produtosSalvos);
        } else {
            container.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }
    }

    // Após os produtos serem carregados, remove a mensagem de carregamento
    loadingMessage.style.display = "none";
    
    // Garantir que os produtos não sejam duplicados antes de renderizar
    produtos = removerDuplicados(produtos);

    renderizarProdutos(produtos);  // Função para renderizar os produtos na tela
}

// Função para remover duplicados de produtos com base no código de barras
function removerDuplicados(produtos) {
    const produtosUnicos = [];
    const codigosBarras = new Set();

    produtos.forEach(produto => {
        if (!codigosBarras.has(produto.cod_barras)) {
            produtosUnicos.push(produto);
            codigosBarras.add(produto.cod_barras);
        }
    });

    return produtosUnicos;
}

// Função para deletar um produto na API e removê-lo do LocalStorage
async function deletarProduto(codigoBarras) {
    try {
        const response = await fetch(`${API_URL}/produto/${codigoBarras}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao deletar produto");
        
        // Remove o produto do LocalStorage
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        produtos = produtos.filter(produto => produto.cod_barras !== codigoBarras);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        
        alert("Produto deletado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
    }
}
