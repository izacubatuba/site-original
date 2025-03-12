function salvarProduto(event) {
    event.preventDefault(); // Previne o envio do formulário

    const nome = document.getElementById('productName').value;
    const codigoBarras = document.getElementById('productCode').value;
    
    // Verifica qual opção de imagem foi escolhida
    let imagem = '';
    const imageOption = document.querySelector('input[name="imageOption"]:checked') ? document.querySelector('input[name="imageOption"]:checked').value : '';

    if (imageOption === 'upload') {
        const imagemFile = document.getElementById('productImage').files[0];
        if (imagemFile) {
            imagem = URL.createObjectURL(imagemFile); // Cria uma URL temporária para o arquivo
        }
    } else if (imageOption === 'link') {
        imagem = document.getElementById('productImageUrl').value; // Obtém o link da imagem
    }

    // Verifica se o produto já foi cadastrado
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtoExistente = produtos.find(produto => produto.codigoBarras === codigoBarras);

    if (produtoExistente) {
        alert("Este produto já foi cadastrado com esse código de barras!");
    } else {
        // Cria o novo produto
        const novoProduto = {
            nome: nome,
            codigoBarras: codigoBarras,
            imagem: imagem || 'imagem_default.jpg' // Se não for fornecida uma imagem, usa uma imagem padrão
        };

        // Adiciona o novo produto ao array
        produtos.push(novoProduto);

        // Salva novamente no localStorage
        localStorage.setItem('produtos', JSON.stringify(produtos));

        alert("Produto cadastrado com sucesso!");
        
        // Recarrega a lista de produtos na página de listagem
        window.location.href = 'index.html'; // Redireciona para a página de produtos
    }
}
