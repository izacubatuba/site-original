// Função para carregar as informações do produto a ser editado
function carregarProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoBarras = urlParams.get("codigoBarras");

    if (codigoBarras) {
        // Tenta carregar da API
        fetch(`http://127.0.0.1:5000/api/produto/${codigoBarras}`)
            .then(response => {
                if (!response.ok) throw new Error("Produto não encontrado na API");
                return response.json();
            })
            .then(produto => {
                console.log("Produto carregado com sucesso:", produto); // Log para verificar o produto retornado
                
                // Preenche os campos de texto com as informações do produto
                document.getElementById("productName").value = produto.descricao_produto;
                document.getElementById("productCode").value = produto.cod_barras;

                // Preenche a imagem, se existir
                if (produto.imagem) {
                    document.getElementById("productImageUrl").value = produto.imagem;
                    document.getElementById("linkOption").checked = true;
                } else {
                    document.getElementById("uploadOption").checked = true;
                }

                // Salva o produto carregado no LocalStorage para fallback
                localStorage.setItem("produto_editando", JSON.stringify(produto));
            })
            .catch(error => {
                console.error("Erro ao carregar o produto:", error);

                // Tenta carregar do LocalStorage como fallback
                const produtoLocal = localStorage.getItem("produto_editando");
                if (produtoLocal) {
                    const produto = JSON.parse(produtoLocal);
                    document.getElementById("productName").value = produto.descricao_produto;
                    document.getElementById("productCode").value = produto.cod_barras;
                    document.getElementById("productImageUrl").value = produto.imagem || "";
                    document.getElementById("linkOption").checked = !!produto.imagem;
                } else {
                    alert("Produto não encontrado!");
                    window.location.href = "index.html"; // Redireciona caso o produto não seja encontrado
                }
            });
    } else {
        alert("Código de barras não fornecido.");
        window.location.href = "index.html"; // Redireciona se o código de barras não for fornecido
    }
}

// Função para salvar as alterações no produto na API e LocalStorage
function salvarAlteracoes(event) {
    event.preventDefault(); // Evita que o formulário seja enviado de forma tradicional

    const nome = document.getElementById("productName").value;
    const codigoBarras = document.getElementById("productCode").value;

    let imagem = "";
    const imageOption = document.querySelector('input[name="imageOption"]:checked').value;

    if (imageOption === "upload") {
        const imagemFile = document.getElementById("productImage").files[0];
        if (imagemFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagem = e.target.result; // Salva a imagem como base64
                atualizarProduto(codigoBarras, nome, imagem);
            };
            reader.readAsDataURL(imagemFile);
        } else {
            atualizarProduto(codigoBarras, nome, imagem);
        }
    } else if (imageOption === "link") {
        imagem = document.getElementById("productImageUrl").value;
        atualizarProduto(codigoBarras, nome, imagem);
    }
}

// Função para atualizar o produto na API e no LocalStorage
function atualizarProduto(codigoBarras, nome, imagem) {
    let produtoOriginal = JSON.parse(localStorage.getItem("produto_editando")) || {};

    // Criando objeto com os dados atualizados
    const produtoAtualizado = {
        descricao_produto: nome,
        cod_barras: codigoBarras,
        imagem: imagem || produtoOriginal.imagem,
    };

    // Atualiza o produto na API
    fetch(`http://127.0.0.1:5000/api/produto/${codigoBarras}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado),
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            alert("Erro ao atualizar o produto: " + data.erro);
        } else {
            alert("Produto alterado com sucesso!");

            // Atualiza o produto no LocalStorage
            const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
            const index = produtos.findIndex(p => p.cod_barras === codigoBarras);

            if (index !== -1) {
                produtos[index] = produtoAtualizado;
                localStorage.setItem("produtos", JSON.stringify(produtos));
            }

            localStorage.removeItem("produto_editando");
            window.location.href = "index.html"; // Redireciona após salvar
        }
    })
    .catch(error => {
        console.warn("Erro ao atualizar na API, salvando no LocalStorage.");

        // Se a API falhar, atualiza apenas no LocalStorage
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        const index = produtos.findIndex(p => p.cod_barras === codigoBarras);

        if (index !== -1) {
            produtos[index] = produtoAtualizado;
            localStorage.setItem("produtos", JSON.stringify(produtos));
        }

        alert("Produto atualizado localmente, mas a API não respondeu.");
        window.location.href = "index.html"; // Redireciona para garantir atualização
    });
}

// Escuta o envio do formulário
document.getElementById("productForm").addEventListener("submit", salvarAlteracoes);

// Carrega as informações do produto ao carregar a página
window.onload = carregarProduto;
