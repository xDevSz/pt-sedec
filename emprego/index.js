document.addEventListener('DOMContentLoaded', function() {

  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-navigation');
  const body = document.querySelector('body');

  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      body.classList.toggle('mobile-nav-active');
    });
  }
  
});

// =================================================================== //
// CÓDIGO REFEITO PARA O CARROSSEL DE VAGAS (100% FUNCIONAL)           //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function() {

    const viewport = document.getElementById('jobs-viewport');
    const track = document.getElementById('jobs-track');
    const prevButton = document.getElementById('jobs-arrow-prev');
    const nextButton = document.getElementById('jobs-arrow-next');

    // Só executa o código se todos os elementos do carrossel existirem
    if (viewport && track && prevButton && nextButton) {
        let currentIndex = 0;
        
        function updateCarousel() {
            const cards = track.querySelectorAll('.job-card');
            if (cards.length === 0) return;

            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(track).gap);
            const moveDistance = (cardWidth + gap) * currentIndex;
            
            // Move o "trilho" para a esquerda
            track.style.transform = `translateX(-${moveDistance}px)`;

            // Habilita/desabilita as setas
            prevButton.classList.toggle('disabled', currentIndex === 0);
            
            // Lógica para saber quando desabilitar a seta "próximo"
            const viewportWidth = viewport.offsetWidth;
            const trackWidth = track.scrollWidth;
            nextButton.classList.toggle('disabled', moveDistance >= trackWidth - viewportWidth);
        }

        nextButton.addEventListener('click', () => {
            const cards = track.querySelectorAll('.job-card');
            const maxIndex = cards.length - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Atualiza o carrossel quando a janela muda de tamanho
        window.addEventListener('resize', updateCarousel);
        
        // Chame uma vez no início para definir o estado inicial das setas
        updateCarousel();
    }
});


// =================================================================== //
// CÓDIGO PARA FUNCIONALIDADE DO FAQ (ACCORDION)                       //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function() {

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Verifica se o item clicado já está ativo
            const isActive = item.classList.contains('active');

            // Opcional: Fecha todos os outros itens antes de abrir o novo
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                otherItem.querySelector('.faq-answer').style.padding = '0 2rem';
            });

            // Se o item não estava ativo, abre ele
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 40 + 'px'; // 40px para o padding
                answer.style.padding = '2rem';
            }
        });
    });

});