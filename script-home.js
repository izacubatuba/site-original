async function carregarProdutos() {
    const container = document.getElementById("productsContainer");
    let produtos = [];

    try {
        const response = await fetch(`${API_URL}/produtos`);
        if (!response.ok) throw new Error("API não disponível");
        produtos = await response.json();

        // Verifica se os produtos da API são diferentes dos do LocalStorage
        const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
        if (JSON.stringify(produtosSalvos) !== JSON.stringify(produtos)) {
            // Atualiza o LocalStorage com os produtos da API
            localStorage.setItem("produtos", JSON.stringify(produtos));
            alert("Todos os produtos foram salvos localmente. Agora você pode desligar a API.");
        }
    } catch (error) {
        console.error("Erro ao carregar produtos da API:", error);

        // Carrega do LocalStorage se a API estiver offline
        const produtosSalvos = localStorage.getItem("produtos");
        if (produtosSalvos) {
            produtos = JSON.parse(produtosSalvos);
        } else {
            container.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }
    }

    renderizarProdutos(produtos);
}
