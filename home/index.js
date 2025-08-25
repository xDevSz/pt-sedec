// =================================================================== //
// Script Corporativo - Portal de Rondônia                             //
// 1. Efeito de rolagem do Header                                      //
// 2. Funcionalidade do Menu Mobile                                    //
// =================================================================== //

document.addEventListener('DOMContentLoaded', function() {

  // --- EFEITO DE ROLAGEM DO HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- FUNCIONALIDADE DO MENU MOBILE ---
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