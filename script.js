/* -------------------------------------------------------------------------
   PARA TROCAR O WHATSAPP, MUDE SO A LINHA whatsappNumber ABAIXO.
   Todo link com data-whatsapp no HTML e reescrito a partir daqui.
   Formato: codigo do pais + DDD + numero, sem simbolos. Ex.: 5516991234567
------------------------------------------------------------------------- */
window.MOVII_CONFIG = Object.freeze({
    whatsappNumber: '5516000000000',
    whatsappMensagem: 'Olá! Vim pelo site da MovCode e gostaria de conversar sobre um projeto.',
    typewriterWords: [
        'Dashboards claros',
        'Sites sob medida',
        'Automações',
        'Sistemas internos'
    ]
});

(() => {
    const typewriterText = document.getElementById('typewriter-text');
    const dashboardNumbers = document.querySelectorAll('[data-dashboard-target]');

    if (dashboardNumbers.length) {
        const animateValue = (element) => {
            const target = Number(element.dataset.dashboardTarget || 0);
            const suffix = element.dataset.dashboardSuffix || '';
            const duration = 1400;
            const startTime = performance.now();

            const step = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(target * easedProgress);

                element.textContent = `${currentValue}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        dashboardNumbers.forEach((element, index) => {
            setTimeout(() => animateValue(element), 200 + index * 120);
        });
    }

    if (!typewriterText) {
        return;
    }

    const words = window.MOVII_CONFIG?.typewriterWords ?? [];
    let wordIndex = 0;
    let letterIndex = 0;
    let deleting = false;

    // O HTML ja vem com a primeira palavra escrita (para o <h1> estar completo
    // antes do JS rodar). Se ela bate com a lista, comeca apagando dali em vez
    // de zerar o texto e redigitar — senao o titulo daria um salto visivel.
    const inicial = typewriterText.textContent.trim();
    const posicaoInicial = words.indexOf(inicial);

    if (posicaoInicial !== -1) {
        wordIndex = posicaoInicial;
        letterIndex = inicial.length;
        deleting = true;
    }

    function type() {
        const currentWord = words[wordIndex];

        if (!currentWord) {
            return;
        }

        typewriterText.textContent = deleting
            ? currentWord.substring(0, letterIndex - 1)
            : currentWord.substring(0, letterIndex + 1);

        deleting ? letterIndex-- : letterIndex++;

        let speed = deleting ? 50 : 100;

        if (!deleting && letterIndex === currentWord.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && letterIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, deleting ? 2400 : 1000);
})();

(() => {
    // Fonte unica do numero de WhatsApp: MOVII_CONFIG.whatsappNumber.
    const config = window.MOVII_CONFIG;
    const links = document.querySelectorAll('[data-whatsapp]');

    if (!config?.whatsappNumber || !links.length) {
        return;
    }

    links.forEach((link) => {
        const texto = link.dataset.whatsapp || config.whatsappMensagem || '';
        const query = texto ? `?text=${encodeURIComponent(texto)}` : '';
        link.href = `https://wa.me/${config.whatsappNumber}${query}`;
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
    });
})();

(() => {
    const yearElement = document.getElementById('anoAtual');
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navigation = document.getElementById('main-navigation');
    const homeAnchors = document.querySelectorAll('a[href="#inicio"]');
    const navLinks = navigation?.querySelectorAll('a') ?? [];

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function closeMenu() {
        document.body.classList.remove('nav-open');
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-label', 'Abrir menu');
    }

    if (navToggle && navigation) {
        navToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (event) => {
            if (!document.body.classList.contains('nav-open')) {
                return;
            }

            if (navigation.contains(event.target) || navToggle.contains(event.target)) {
                return;
            }

            closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    homeAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, '', '#inicio');
        });
    });
})();

(() => {
    const hiddenElements = document.querySelectorAll('.escondido');

    if (!hiddenElements.length || typeof window.IntersectionObserver === 'undefined') {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparecer');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach((element) => observer.observe(element));
})();

(() => {
    const modal = document.getElementById('serviceModal');
    const titleElement = document.getElementById('serviceModalTitle');
    const summaryElement = document.getElementById('serviceModalSummary');
    const detailElement = document.getElementById('serviceModalDetail');
    const tagsElement = document.getElementById('serviceModalTags');
    const iconElement = document.getElementById('serviceModalIcon');
    const detailButtons = document.querySelectorAll('.servico-arrow');

    if (!modal || !titleElement || !summaryElement || !detailElement || !tagsElement || !iconElement || !detailButtons.length) {
        return;
    }

    let lastFocusedElement = null;

    function closeServiceModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        lastFocusedElement?.focus?.();
    }

    function openServiceModal(trigger) {
        const card = trigger.closest('.servico-card-dark');

        if (!card) {
            return;
        }

        const title = card.querySelector('h3')?.textContent.trim() ?? 'Serviço';
        const summary = card.querySelector('p')?.textContent.trim() ?? '';
        const detail = card.dataset.serviceDetail || summary;
        const tags = (card.dataset.serviceTags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        const icon = card.querySelector('.servico-icon-dark svg')?.cloneNode(true);

        titleElement.textContent = title;
        titleElement.hidden = false;
        summaryElement.textContent = summary;
        detailElement.textContent = detail;
        iconElement.replaceChildren();

        if (icon) {
            iconElement.appendChild(icon);
        }

        tagsElement.replaceChildren(...tags.map((tag) => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            return tagElement;
        }));

        lastFocusedElement = trigger;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        modal.querySelector('[data-service-close]')?.focus();
    }

    detailButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openServiceModal(button);
        });
    });

    modal.querySelectorAll('[data-service-close]').forEach((element) => {
        element.addEventListener('click', closeServiceModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeServiceModal();
        }
    });
})();

(() => {
    const modal = document.getElementById('projectModal');
    const titleElement = document.getElementById('projectModalTitle');
    const typeElement = document.getElementById('projectModalType');
    const descriptionElement = document.getElementById('projectModalDescription');
    const tagsElement = document.getElementById('projectModalTags');
    const imageElement = document.getElementById('projectModalImage');
    const thumbsElement = document.getElementById('projectModalThumbs');
    const detailButtons = document.querySelectorAll('.projeto-link');

    if (!modal || !titleElement || !typeElement || !descriptionElement || !tagsElement || !imageElement || !thumbsElement || !detailButtons.length) {
        return;
    }

    let lastFocusedElement = null;
    let projectImageTimer = null;

    function stopProjectSlideshow() {
        if (projectImageTimer) {
            clearInterval(projectImageTimer);
            projectImageTimer = null;
        }
    }

    function changeProjectImage(image) {
        imageElement.classList.add('is-changing');

        setTimeout(() => {
            imageElement.src = image;
            imageElement.classList.remove('is-changing');
        }, 180);
    }

    function closeProjectModal() {
        stopProjectSlideshow();
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        lastFocusedElement?.focus?.();
    }

    function openProjectModal(trigger) {
        const card = trigger.closest('.projeto-card');

        if (!card) {
            return;
        }

        const title = card.querySelector('.projeto-body h3')?.textContent.trim() ?? 'Projeto';
        const type = card.querySelector('.projeto-tipo')?.textContent.trim() ?? 'Projeto';
        const description = trigger.dataset.projectDescription || card.querySelector('.projeto-body p')?.textContent.trim() || '';
        const tags = Array.from(card.querySelectorAll('.projeto-tag')).map((tag) => tag.textContent.trim());
        const fallbackImage = card.querySelector('.projeto-photo-slot img')?.getAttribute('src') || '';
        const galleryImages = (trigger.dataset.projectImages || fallbackImage)
            .split(',')
            .map((image) => image.trim())
            .filter(Boolean);
        let currentImageIndex = 0;

        titleElement.textContent = title;
        titleElement.hidden = false;
        typeElement.textContent = type;
        descriptionElement.textContent = description;
        // Sem capa cadastrada, esconde a galeria em vez de abrir imagem quebrada.
        const gallery = imageElement.parentElement;
        if (galleryImages.length) {
            gallery?.removeAttribute('hidden');
            imageElement.src = galleryImages[0];
            imageElement.alt = `Prévia do projeto ${title}`;
        } else {
            gallery?.setAttribute('hidden', '');
            imageElement.removeAttribute('src');
            imageElement.alt = '';
        }
        tagsElement.replaceChildren(...tags.map((tag) => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            return tagElement;
        }));
        thumbsElement.replaceChildren();
        stopProjectSlideshow();

        if (galleryImages.length > 1) {
            projectImageTimer = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                changeProjectImage(galleryImages[currentImageIndex]);
            }, 3200);
        }

        lastFocusedElement = trigger;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        modal.querySelector('[data-project-close]')?.focus();
    }

    detailButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openProjectModal(button);
        });
    });

    modal.querySelectorAll('[data-project-close]').forEach((element) => {
        element.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeProjectModal();
        }
    });
})();
