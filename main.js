/**
 * Alliance Tounga AgroCoop - Main JavaScript
 * Mobile-first, performance optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLazyLoading();
  initFormValidation();
  initCounters();
  initModal();
});

// ========================================
// Navigation Mobile (Burger Menu)
// ========================================
function initNavigation() {
  const burger = document.querySelector('.nav__burger');
  const menu = document.getElementById('menu');
  
  if (!burger || !menu) return;
  
  burger.addEventListener('click', () => {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });
  
  // Fermer menu au clic sur un lien (mobile)
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ========================================
// Lazy Loading Images (Intersection Observer)
// ========================================
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    // Fallback pour anciens navigateurs
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// Validation Formulaires (Temps réel)
// ========================================
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Validation au submit
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
        showFormError(form, 'Veuillez corriger les erreurs ci-dessus.');
      } else {
        // Pour Formspree ou similaire - montrer loading
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Envoi en cours...';
        }
      }
    });
    
    // Validation temps réel
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          validateField(field);
        }
      });
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMsg = '';
  
  // Reset
  field.classList.remove('invalid', 'valid');
  
  // Required
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMsg = 'Ce champ est requis';
  }
  
  // Pattern (téléphone ivoirien)
  if (isValid && field.type === 'tel' && value) {
    const phoneRegex = /^(\\+225|0)[0157]\\d{8}$/;
    if (!phoneRegex.test(value.replace(/\\s/g, ''))) {
      isValid = false;
      errorMsg = 'Format: 07 XX XX XX XX ou +225 07 XX XX XX XX';
    }
  }
  
  // Email (si fourni)
  if (isValid && field.type === 'email' && value) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMsg = 'Adresse email invalide';
    }
  }
  
  // Affichage état
  if (!isValid) {
    field.classList.add('invalid');
    showFieldError(field, errorMsg);
  } else if (value) {
    field.classList.add('valid');
    clearFieldError(field);
  }
  
  return isValid;
}

function validateForm(form) {
  let isValid = true;
  form.querySelectorAll('input, select, textarea').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  return isValid;
}

function showFieldError(field, message) {
  let errorEl = field.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.style.color = '#dc3545';
    errorEl.style.fontSize = '0.875rem';
    errorEl.style.marginTop = '0.25rem';
    errorEl.style.display = 'block';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  const errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) errorEl.remove();
  field.removeAttribute('aria-invalid');
}

function showFormError(form, message) {
  let errorEl = form.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.style.background = '#f8d7da';
    errorEl.style.color = '#721c24';
    errorEl.style.padding = '1rem';
    errorEl.style.borderRadius = '8px';
    errorEl.style.marginBottom = '1rem';
    form.prepend(errorEl);
  }
  errorEl.textContent = message;
}

// ========================================
// Compteurs Animés (Intersection Observer)
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000; // ms
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing ease-out
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * easeOut);
          
          counter.textContent = formatNumber(current) + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'K';
  }
  return num.toLocaleString('fr-FR');
}

// ========================================
// Modal "Devis" (Réutilisable)
// ========================================
function initModal() {
  // Sélectionner tous les boutons qui ouvrent le modal
  const modalTriggers = document.querySelectorAll('[data-modal="devis"]');
  
  if (!modalTriggers.length) return;
  
  // Créer le modal s'il n'existe pas
  let modal = document.getElementById('modal-devis');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-devis';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__overlay" data-modal-close></div>
      <div class="modal__content">
        <button class="modal__close" data-modal-close aria-label="Fermer">&times;</button>
        <h2>Demande de devis</h2>
        <p>Contactez-nous pour un devis personnalisé selon vos volumes.</p>
        <form class="form" id="devisForm">
          <div class="form__group">
            <label class="form__label">Produit concerné</label>
            <input type="text" class="form__input" readonly id="devisProduit">
          </div>
          <div class="form__group">
            <label class="form__label">Quantité souhaitée *</label>
            <input type="number" class="form__input" required min="1" placeholder="En kg ou litres">
          </div>
          <div class="form__group">
            <label class="form__label">Téléphone *</label>
            <input type="tel" class="form__input" required pattern="^(\\+225|0)[0157]\\d{8}$">
          </div>
          <button type="submit" class="btn btn--primary btn--full">Envoyer la demande</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Styles inline pour le modal (ou ajouter dans CSS)
    const style = document.createElement('style');
    style.textContent = `
      .modal { display: none; position: fixed; inset: 0; z-index: 2000; align-items: center; justify-content: center; }
      .modal.active { display: flex; }
      .modal__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.8); }
      .modal__content { position: relative; background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; animation: fadeInUp 0.3s ease; }
      .modal__close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
      .modal__close:hover { background: var(--gris-rural); }
      body.modal-open { overflow: hidden; }
    `;
    document.head.appendChild(style);
    
    // Event listeners modal
    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
    
    // Formulaire devis
    const devisForm = document.getElementById('devisForm');
    if (devisForm) {
      devisForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Demande de devis envoyée ! Nous vous contacterons sous 24h.');
        closeModal();
        devisForm.reset();
      });
    }
  }
  
  // Ouvrir modal avec produit pré-rempli
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const produit = btn.dataset.produit || 'Proits agricoles';
      const inputProduit = document.getElementById('devisProduit');
      if (inputProduit) inputProduit.value = produit;
      openModal();
    });
  });
  
  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    modal.querySelector('input, select, textarea').focus();
  }
  
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

// ========================================
// Utilitaires
// ========================================
// Détection support WebP (pour amélioration future)
function supportsWebP() {
  return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Stockage local pour préférences (espace membres V2 prep)
function savePreference(key, value) {
  try {
    localStorage.setItem(`tounga_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage not available');
  }
}

function getPreference(key) {
  try {
    return JSON.parse(localStorage.getItem(`tounga_${key}`));
  } catch (e) {
    return null;
  }
}

// Service Worker registration (pour PWA future)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js'); // Décommenter quand sw.js créé
  });
}
