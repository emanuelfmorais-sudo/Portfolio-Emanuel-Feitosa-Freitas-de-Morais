// Seleciona todos os links (<a>) que estão dentro da classe '.title' (os nomes que coloquei no index linkados ao instagram)
const devLinks = document.querySelectorAll('.title a');

// Seleciona a imagem principal que está dentro da classe '.hero' para que eu possa modificar de acordo com o necessário
const heroImg = document.querySelector('.hero img');

// Inicia um laço que percorre cada um dos links encontrados na lista 'devLinks'
devLinks.forEach(link => {

  // Adiciona um "observador" para detectar quando o mouse entra na área do link
  link.addEventListener('mouseenter', () => {
    // Aplica filtros CSS via JS: deixa a imagem em preto e branco (grayscale) e com 50% de brilho (ou seja, 0.5)
    heroImg.style.filter = 'grayscale(100%) brightness(0.5)';
    
    // Define que qualquer mudança visual na imagem deve levar meio segundo (0.5) para acontecer (é pra deixar com um acabamento mais suave)
    heroImg.style.transition = '0.5s';
  });

  // Adiciona um "observador" novamente para detectar quando o mouse sai da área do link
  link.addEventListener('mouseleave', () => {
    // Remove todos os filtros aplicados anteriormente, voltando a imagem antes de modificar
    heroImg.style.filter = 'none';
  });

});

const yearElement = document.getElementById('year');

const currentDate = new Date();

yearElement.textContent = currentDate.getFullYear();