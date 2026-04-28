// public/js/main.js
// Жанабекұлы Ислам — recipe-app клиент JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. Пароль жасыру / көрсету (👁 toggle)
  // =============================================
  document.querySelectorAll('input[type="password"]').forEach(input => {
    // Wrapper div жасау
    const wrapper = document.createElement('div');
    wrapper.className = 'password-wrapper';
    wrapper.style.position = 'relative';

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Көз батырмасын жасау
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
    toggleBtn.setAttribute('aria-label', 'Парольді көрсету/жасыру');
    toggleBtn.textContent = '👁';
    toggleBtn.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      color: #aaa;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s;
    `;

    wrapper.appendChild(toggleBtn);

    // Басқанда пароль түрін ауыстыру
    toggleBtn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = '🙈';
        toggleBtn.style.color = '#F6AD55';
      } else {
        input.type = 'password';
        toggleBtn.textContent = '👁';
        toggleBtn.style.color = '#aaa';
      }
    });
  });

  // =============================================
  // 2. Пішін жіберілгенде "Жүктелуде..." эффекті
  // =============================================
  document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.btn-primary');
      if (btn) {
        btn.textContent = '⏳ Жүктелуде...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }
    });
  });

  // =============================================
  // 3. Қате/сәтті хабарламаларды 5 сек кейін жасыру
  // =============================================
  document.querySelectorAll('.alert-danger, .alert-success').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        if (alert.parentNode) alert.remove();
      }, 600);
    }, 5000);
  });

  // =============================================
  // 4. Тіркелу пішінінде пароль сәйкестігін тексеру
  // =============================================
  const parolInput      = document.querySelector('input[name="parol"]');
  const parolRastauInput = document.querySelector('input[name="parolRastau"]');

  if (parolInput && parolRastauInput) {
    parolRastauInput.addEventListener('input', () => {
      if (parolRastauInput.value && parolInput.value !== parolRastauInput.value) {
        parolRastauInput.style.borderColor = '#FC8181';
        parolRastauInput.title = 'Парольдер сәйкес келмейді!';
      } else {
        parolRastauInput.style.borderColor = parolRastauInput.value ? '#68D391' : '#E8E8E8';
        parolRastauInput.title = '';
      }
    });
  }

  // =============================================
  // 5. Input-тердің анимациясы (focus кезінде)
  // =============================================
  document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
    el.addEventListener('focus', () => {
      el.parentElement.querySelector('label')?.style &&
        (el.parentElement.querySelector('label').style.color = '#ED8936');
    });
    el.addEventListener('blur', () => {
      el.parentElement.querySelector('label')?.style &&
        (el.parentElement.querySelector('label').style.color = '');
    });
  });

  // =============================================
  // 6. Жою растау диалогы (рецептер тізімінде)
  // =============================================
  document.querySelectorAll('[data-confirm]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const msg = btn.dataset.confirm || 'Жоюды растайсыз ба?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  console.log('✅ recipe-app JS жүктелді');
});
