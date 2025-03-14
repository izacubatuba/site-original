const API_URL = "https://minha-api-produto.fly.dev/api/produtos"; // A URL correta para a API

// Função para iniciar o escaneamento de código de barras
function iniciarEscaneamento() {
    // Inicia o Quagga com as configurações corretas
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
            readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"], // Tipos de códigos de barras a serem lidos
            multiple: false // Impede múltiplas leituras
        }
    }, function(err) {
        if (err) {
            console.log(err);
            alert("Erro ao iniciar o scanner.");
            return;
        }
        console.log("Quagga iniciado!");
        Quagga.start(); // Inicia a leitura do código de barras
    });

    // Variável para controlar se o scanner está lendo corretamente
    let scanning = false;

    // Quando o código de barras for detectado
    Quagga.onDetected(function(result) {
        if (scanning) return; // Impede múltiplas leituras consecutivas

        scanning = true; // Marca como lendo para evitar leituras duplicadas

        // Verifica se o código de barras foi detectado corretamente
        if (result && result.codeResult && result.codeResult.code) {
            const codBarras = result.codeResult.code;
            document.getElementById("productCode").value = codBarras; // Preenche o campo do código de barras com o valor escaneado
            console.log("Código de barras detectado:", codBarras);
        } else {
            console.log("Código de barras não detectado corretamente.");
        }

        // Após a leitura, o scanner é interrompido para evitar leituras múltiplas
        Quagga.stop();

        // Após 2 segundos, o scanner é reiniciado para permitir nova leitura
        setTimeout(() => {
            scanning = false; // Libera para próxima leitura
            Quagga.start(); // Reinicia o scanner
        }, 2000);
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
