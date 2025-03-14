const API_URL = "https://minha-api-produto.fly.dev/api/produtos"; // A URL correta para a API

// Função para iniciar o escaneamento de código de barras
function iniciarEscaneamento() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("barcode-scanner"), // Elemento para exibir a câmera
            constraints: {
                facingMode: "environment" // Usar a câmera traseira
            }
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"] // Tipos de códigos de barras a serem lidos
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Quagga iniciado!");
        Quagga.start(); // Inicia a leitura do código de barras
    });

    // Quando o código de barras for detectado
    Quagga.onDetected(function(result) {
        const codBarras = result.codeResult.code;
        document.getElementById("productCode").value = codBarras; // Preenche o campo do código de barras com o valor escaneado
        console.log("Código de barras detectado:", codBarras);
        Quagga.stop(); // Para o scanner após detectar o código de barras
    });
}

// Função para salvar o produto
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

// Inicializa o escaneamento quando a página carrega
document.addEventListener("DOMContentLoaded", iniciarEscaneamento);

// Adiciona o evento de envio do formulário
document.getElementById("productForm").addEventListener("submit", salvarProduto);
