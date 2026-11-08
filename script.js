/**
 * Script Interactivo para el Portal de Usabilidad y DCU
 * Diseñado bajo principios de usabilidad y accesibilidad WCAG 2.1
 * Integrado con Lucide Icons
 */

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initThemeToggle();
  initAccessibilityControls();
  initReadingProgressBar();
  initLiveSearch();
  initMethodFilters();
  initSusCalculator();
  initSusToggle();
  initActiveNavSpy();
  initMobileMenu();
});

/* ==========================================================================
   0. INICIALIZACIÓN DE LUCIDE ICONS
   ========================================================================== */
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   1. GESTIÓN DEL TEMA (LIGHT / DARK)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeToggle, currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeToggle, newTheme);
  });
}

function updateThemeIcon(button, theme) {
  if (theme === 'dark') {
    button.innerHTML = '<i data-lucide="sun"></i>';
    button.setAttribute('aria-label', 'Cambiar a modo claro');
    button.title = 'Cambiar a modo claro';
  } else {
    button.innerHTML = '<i data-lucide="moon"></i>';
    button.setAttribute('aria-label', 'Cambiar a modo oscuro');
    button.title = 'Cambiar a modo oscuro';
  }
  initLucide();
}

/* ==========================================================================
   2. CONTROLES DE ACCESIBILIDAD (ALTO CONTRASTE)
   ========================================================================== */
function initAccessibilityControls() {
  const btnHighContrast = document.getElementById('btnHighContrast');

  if (btnHighContrast) {
    btnHighContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHigh = document.body.classList.contains('high-contrast');
      btnHighContrast.setAttribute('aria-pressed', isHigh ? 'true' : 'false');
      btnHighContrast.innerHTML = `<i data-lucide="contrast"></i> <span>${isHigh ? 'Contraste Activo' : 'Contraste'}</span>`;
      initLucide();
    });
  }
}

/* ==========================================================================
   3. BARRA DE PROGRESO DE LECTURA
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('readingProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. BUSCADOR EN VIVO DE CONTENIDOS
   ========================================================================== */
function initLiveSearch() {
  const searchInput = document.getElementById('searchInput');
  const sections = document.querySelectorAll('.topic-section');
  if (!searchInput || !sections.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    sections.forEach(section => {
      const text = section.innerText.toLowerCase();
      if (!query || text.includes(query)) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   5. FILTRO DE MÉTODOS DE EVALUACIÓN
   ========================================================================== */
function initMethodFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.method-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. INTERACCIÓN DEL WIDGET SUS (DESPLEGABLE COMPACTO)
   ========================================================================== */
function initSusToggle() {
  const btnToggle = document.getElementById('btnToggleSus');
  const wrapper = document.getElementById('susFormWrapper');

  if (!btnToggle || !wrapper) return;

  btnToggle.addEventListener('click', () => {
    const isHidden = wrapper.style.display === 'none';
    if (isHidden) {
      wrapper.style.display = 'block';
      btnToggle.setAttribute('aria-expanded', 'true');
      btnToggle.innerHTML = '<i data-lucide="sliders-horizontal"></i> <span>Ocultar Cuestionario SUS</span> <i data-lucide="chevron-up"></i>';
    } else {
      wrapper.style.display = 'none';
      btnToggle.setAttribute('aria-expanded', 'false');
      btnToggle.innerHTML = '<i data-lucide="sliders-horizontal"></i> <span>Abrir Cuestionario SUS (10 preguntas)</span> <i data-lucide="chevron-down"></i>';
    }
    initLucide();
  });
}

/* ==========================================================================
   7. CALCULADORA INTERACTIVA SUS (BROOKE, 1986)
   ========================================================================== */
function initSusCalculator() {
  const susInputs = document.querySelectorAll('.sus-radio-item input[type="radio"]');
  const scoreDisplay = document.getElementById('susScoreDisplay');
  const gradeDisplay = document.getElementById('susGradeDisplay');
  const interpDisplay = document.getElementById('susInterpDisplay');

  if (!scoreDisplay) return;

  function calculateSus() {
    let oddSum = 0;
    let evenSum = 0;
    let answeredCount = 0;

    for (let i = 1; i <= 10; i++) {
      const selected = document.querySelector(`input[name="sus_q${i}"]:checked`);
      if (selected) {
        answeredCount++;
        const val = parseInt(selected.value, 10);
        if (i % 2 !== 0) {
          // Pregunta impar: Aporte = Valor - 1
          oddSum += (val - 1);
        } else {
          // Pregunta par: Aporte = 5 - Valor
          evenSum += (5 - val);
        }
      }
    }

    if (answeredCount < 10) {
      scoreDisplay.textContent = '--';
      gradeDisplay.textContent = `Respondidas: ${answeredCount} de 10 preguntas`;
      gradeDisplay.style.background = 'var(--color-canvas-parchment)';
      gradeDisplay.style.color = 'var(--color-ink-muted)';
      interpDisplay.textContent = 'Complete la calificación de 1 a 5 en cada afirmación para calcular el índice normalizado.';
      return;
    }

    const susTotal = (oddSum + evenSum) * 2.5;
    scoreDisplay.textContent = susTotal.toFixed(1);

    // Interpretación según Bangor, Kortum & Miller (2008)
    if (susTotal >= 85) {
      gradeDisplay.textContent = 'Grado A+ • Usabilidad Excelente';
      gradeDisplay.style.background = 'rgba(34, 197, 94, 0.15)';
      gradeDisplay.style.color = '#15803d';
      interpDisplay.textContent = 'Nivel sobresaliente. La interacción es fluida, predecible y no presenta barreras operativas.';
    } else if (susTotal >= 80) {
      gradeDisplay.textContent = 'Grado A • Usabilidad Muy Buena';
      gradeDisplay.style.background = 'rgba(34, 197, 94, 0.15)';
      gradeDisplay.style.color = '#15803d';
      interpDisplay.textContent = 'El sistema supera con claridad los estándares mínimos recomendados en la industria.';
    } else if (susTotal >= 68) {
      gradeDisplay.textContent = 'Grado C+ • Usabilidad Aceptable (Promedio)';
      gradeDisplay.style.background = 'rgba(234, 179, 8, 0.15)';
      gradeDisplay.style.color = '#b45309';
      interpDisplay.textContent = 'El sistema se encuentra en el promedio global estándar (~68 puntos). Es operativo pero admite optimizaciones.';
    } else if (susTotal >= 50) {
      gradeDisplay.textContent = 'Grado D • Usabilidad Marginal';
      gradeDisplay.style.background = 'rgba(234, 179, 8, 0.15)';
      gradeDisplay.style.color = '#b45309';
      interpDisplay.textContent = 'Nivel marginal. Los participantes experimentan confusión frecuente en tareas clave.';
    } else {
      gradeDisplay.textContent = 'Grado F • Usabilidad Inaceptable';
      gradeDisplay.style.background = 'rgba(239, 68, 68, 0.15)';
      gradeDisplay.style.color = '#b91c1c';
      interpDisplay.textContent = 'Barreras críticas de interacción que provocan frustración o abandono.';
    }
  }

  susInputs.forEach(input => {
    input.addEventListener('change', calculateSus);
  });
}

/* ==========================================================================
   8. NAVEGACIÓN ACTIVA (SCROLL SPY)
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   9. MENÚ MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
