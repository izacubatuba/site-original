const API_URL = "https://minha-api-produto.fly.dev/api/produtos"; // A URL correta para a API

async function salvarProduto(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const descricao = document.getElementById("productName").value;
    const codBarras = document.getElementById("productCode").value;
    const categoria = document.getElementById("productCategory").value;
    const imagem = document.getElementById("productImageUrl").value || document.getElementById("productImage").files[0];

    if (!descricao || !codBarras || !categoria) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const novoProduto = {
        descricao_produto: descricao,
        cod_barras: codBarras,
        categoria: categoria,
        imagem: imagem ? imagem : null
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST", // Método para criar um novo produto
            headers: {
                "Content-Type": "application/json", // Definindo o tipo como JSON
            },
            body: JSON.stringify(novoProduto), // Enviando os dados no formato JSON
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro ao salvar o produto na API:", errorText);
            alert(`Erro ao salvar o produto: ${errorText}`);
            return;
        }

        // Exibe a mensagem de sucesso na tela
        const messageElement = document.getElementById("message");
        messageElement.textContent = "Produto cadastrado com sucesso!";
        messageElement.style.display = "block";

        // Após 2 segundos, redireciona para a página inicial
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        console.error("Erro ao salvar produto na API:", error);
        alert("Erro ao salvar produto. Verifique o console para mais detalhes.");
    }
}

document.getElementById("productForm").addEventListener("submit", salvarProduto);
