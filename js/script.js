(() => {
    'use strict';

    const STORAGE_KEY = 'tallerPodcast:progreso';
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const contents = Array.from(document.querySelectorAll('.tab-content'));
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressBarBg = document.querySelector('.progress-bar-bg');
    const totalSessions = document.querySelectorAll('.tab-content[id^="sesion"]').length;

    // ========== PERSISTENCIA (localStorage, con manejo de errores) ==========
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { completed: [] };
            const parsed = JSON.parse(raw);
            return { completed: Array.isArray(parsed.completed) ? parsed.completed : [] };
        } catch (err) {
            console.warn('No se pudo leer el progreso guardado:', err);
            return { completed: [] };
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: Array.from(completedSessions) }));
        } catch (err) {
            console.warn('No se pudo guardar el progreso:', err);
        }
    }

    const completedSessions = new Set(loadState().completed);

    // ========== NAVEGACIÓN POR PESTAÑAS ==========
    function switchTab(tabId) {
        contents.forEach(c => c.classList.remove('active'));
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });

        const targetContent = document.getElementById(tabId);
        const targetTab = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (targetContent) targetContent.classList.add('active');
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.setAttribute('aria-selected', 'true');
        }

        if (tabId.startsWith('sesion')) {
            completedSessions.add(tabId);
            saveState();
            updateProgress();
        }

        if (history.replaceState) {
            history.replaceState(null, '', `#${tabId}`);
        }
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Navegación por teclado entre pestañas (flechas izquierda/derecha), según patrón ARIA de tabs
    const tabList = document.getElementById('tabNav');
    if (tabList) {
        tabList.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const currentIndex = tabs.indexOf(document.activeElement);
            if (currentIndex === -1) return;
            e.preventDefault();
            const delta = e.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
            tabs[nextIndex].focus();
            switchTab(tabs[nextIndex].dataset.tab);
        });
    }

    // ========== ACTUALIZAR PROGRESO ==========
    function updateProgress() {
        const done = completedSessions.size;
        const pct = Math.min((done / totalSessions) * 100, 100);
        progressFill.style.width = pct + '%';
        progressText.textContent = `${done} / ${totalSessions} sesiones`;
        if (progressBarBg) progressBarBg.setAttribute('aria-valuenow', String(done));
    }

    // ========== TEMPORIZADORES ==========
    const timers = {};

    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startTimer(timerId, minutes) {
        if (timers[timerId] && timers[timerId].interval) return; // ya corriendo

        const display = document.getElementById(timerId);
        const status = document.getElementById(`${timerId}-status`);
        if (status) status.textContent = '';

        let totalSeconds = (timers[timerId] && timers[timerId].remaining) || minutes * 60;

        const interval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(interval);
                timers[timerId] = { interval: null, remaining: 0 };
                display.textContent = '00:00';
                if (status) status.textContent = '⏰ ¡Tiempo terminado!';
                return;
            }
            totalSeconds--;
            display.textContent = formatTime(totalSeconds);
            timers[timerId] = { interval, remaining: totalSeconds };
        }, 1000);

        timers[timerId] = { interval, remaining: totalSeconds };
    }

    function pauseTimer(timerId) {
        if (timers[timerId] && timers[timerId].interval) {
            clearInterval(timers[timerId].interval);
            timers[timerId].interval = null;
        }
    }

    function resetTimer(timerId, minutes) {
        pauseTimer(timerId);
        const display = document.getElementById(timerId);
        const status = document.getElementById(`${timerId}-status`);
        display.textContent = `${String(minutes).padStart(2, '0')}:00`;
        if (status) status.textContent = '';
        timers[timerId] = { interval: null, remaining: minutes * 60 };
    }

    document.querySelectorAll('.timer-display').forEach(el => {
        const id = el.id;
        if (id) {
            const minutes = parseInt(el.textContent.split(':')[0], 10);
            timers[id] = { interval: null, remaining: minutes * 60 };
        }
    });

    // ========== ENTREGABLES (simulación de envío, sin backend) ==========
    function submitEntregable(button) {
        const wrapper = button.closest('.entregable');
        const statusId = button.dataset.status;
        const status = statusId ? document.getElementById(statusId) : wrapper.querySelector('.entregable-status');
        const inputs = wrapper.querySelectorAll('input, textarea');

        let hasContent = false;
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (input.files && input.files.length > 0) hasContent = true;
            } else if (input.value.trim() !== '') {
                hasContent = true;
            }
        });

        if (!status) return;

        if (!hasContent) {
            status.textContent = '⚠️ Agrega tu archivo o texto antes de enviar.';
            status.style.color = '#9c3b34';
            return;
        }

        status.textContent = '✅ ¡Entregable recibido! Buen trabajo.';
        status.style.color = '';
    }

    // ========== DELEGACIÓN DE EVENTOS PARA data-action ==========
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el) return;

        switch (el.dataset.action) {
            case 'switch-tab':
                e.preventDefault();
                switchTab(el.dataset.tab);
                break;
            case 'timer-start':
                startTimer(el.dataset.timer, parseInt(el.dataset.minutes, 10));
                break;
            case 'timer-pause':
                pauseTimer(el.dataset.timer);
                break;
            case 'timer-reset':
                resetTimer(el.dataset.timer, parseInt(el.dataset.minutes, 10));
                break;
            case 'submit-entregable':
                submitEntregable(el);
                break;
            default:
                break;
        }
    });

    // ========== INICIALIZAR ==========
    updateProgress();

    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    } else {
        switchTab('home');
    }
})();
