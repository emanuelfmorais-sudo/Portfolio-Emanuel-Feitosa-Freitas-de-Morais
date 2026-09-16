document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticacao
    if (sessionStorage.getItem('autenticado') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Ano no footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mostrar usuario logado + botao logout na nav
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        if (usuario.nome) {
            const liUser = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = usuario.nome;
            span.style.cssText = 'color:#00d4ff;font-size:12px;font-weight:600;padding:8px 14px;background:rgba(0,212,255,0.08);border-radius:20px;border:1px solid rgba(0,212,255,0.2);pointer-events:none;';
            liUser.appendChild(span);
            navUl.appendChild(liUser);
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = 'SAIR';
        a.style.color = '#ff6b6b';
        a.style.border = '1px solid rgba(255, 107, 107, 0.3)';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('autenticado');
            sessionStorage.removeItem('usuario');
            window.location.href = 'login.html';
        });
        a.addEventListener('mouseenter', () => {
            a.style.background = 'rgba(255, 107, 107, 0.1)';
            a.style.borderColor = 'rgba(255, 107, 107, 0.5)';
            a.style.color = '#ff4444';
        });
        a.addEventListener('mouseleave', () => {
            a.style.background = 'transparent';
            a.style.borderColor = 'rgba(255, 107, 107, 0.3)';
            a.style.color = '#ff6b6b';
        });
        li.appendChild(a);
        navUl.appendChild(li);
    }

    // Lightbox
    const cardImages = document.querySelectorAll('.card_eixo img');
    if (cardImages.length === 0) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fechar">&times;</button>
        <img src="" alt="">
        <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        lbImg.src = src;
        lbCaption.textContent = alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    cardImages.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });

    lbClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});
