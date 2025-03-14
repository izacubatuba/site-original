// Obtém os elementos necessários
const scanButton = document.getElementById('scanBarcode');
const barcodeField = document.getElementById('codigoBarras');
const scannerContainer = document.getElementById('scanner-container');
const videoElement = document.getElementById('scanner');

// Inicia o scanner de QR Code
const scanner = new QrScanner(videoElement, result => {
    // Preenche o campo de código de barras com o valor escaneado
    barcodeField.value = result;
    scanner.stop(); // Para a câmera após escanear
    scannerContainer.style.display = 'none'; // Esconde o vídeo da câmera
});

// Função para iniciar a câmera e o scanner
scanButton.addEventListener('click', () => {
    // Exibe a área do scanner
    scannerContainer.style.display = 'block';
    scanner.start();
});
