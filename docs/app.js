/**
 * STOLEN PEACE — Cutting-Edge Interactive Web Engine
 * Features:
 * - Dynamic Flashlight Beam & Dark Fog Canvas with LERP tracking
 * - Procedural Web Audio API Sound Generator (Binaural Drone & Clicks)
 * - Camera Vision Mode Switcher (Normal / NVG / VHS)
 * - 3D Card Tilt Physics
 * - Viewport Timecode Generator
 * Author: RIventStudio (Неменущий Артём Витальевич)
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ДИНАМИЧЕСКИЙ ХОЛСТ ФОНАРЯ (Interactive Flashlight Canvas)
    // =========================================================================
    const canvas = document.getElementById('flashlight-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let isMouseOnScreen = true;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        isMouseOnScreen = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isMouseOnScreen = false;
    });

    // Отрисовка луча фонаря и тьмы в цикле RequestAnimationFrame
    function renderFlashlight() {
        // Линейная интерполяция движения луча (Smooth LERP)
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        ctx.clearRect(0, 0, width, height);

        const visionMode = document.documentElement.getAttribute('data-vision') || 'normal';
        
        // Коэффициент скролла: в Hero-секции полная тьма, ниже — легкая кинематографическая тень
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const heroThreshold = (window.innerHeight || 800) * 0.7;
        const scrollFactor = Math.min(1, Math.max(0, scrollY / heroThreshold));

        if (visionMode === 'nvg') {
            // Режим ночного видения: фосфорный зеленый
            const nvgAlpha = 0.72 - (scrollFactor * 0.40);
            ctx.fillStyle = `rgba(1, 15, 6, ${nvgAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                const radius = Math.min(width, height) * 0.38;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 20, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(0, 255, 102, 0.45)');
                grad.addColorStop(0.5, 'rgba(0, 255, 102, 0.15)');
                grad.addColorStop(1, 'rgba(1, 15, 6, 0)');

                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        } else if (visionMode === 'vhs') {
            // Режим VHS: аналоговая пленка и виньетка
            const vhsAlpha = 0.82 - (scrollFactor * 0.48);
            ctx.fillStyle = `rgba(7, 6, 12, ${vhsAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                const radius = Math.min(width, height) * 0.35;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 30, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        } else {
            // Обычный режим: в Hero плотная тьма (0.88), при скролле к контенту — комфортная атмосфера (0.28)
            const baseAlpha = 0.88 - (scrollFactor * 0.60);
            ctx.fillStyle = `rgba(5, 6, 9, ${baseAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                const radius = Math.min(width, height) * 0.36;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 15, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
                grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.18)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }

        requestAnimationFrame(renderFlashlight);
    }
    requestAnimationFrame(renderFlashlight);


    // =========================================================================
    // 2. ПРОЦЕДУРНЫЙ WEB AUDIO API (Procedural Tension Audio Engine)
    // =========================================================================
    let audioCtx = null;
    let droneOsc1 = null;
    let droneOsc2 = null;
    let droneGain = null;
    let isAudioPlaying = false;

    function initAudio() {
        if (audioCtx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Низкочастотный бинауральный дрон (48Hz и 51Hz)
        droneOsc1 = audioCtx.createOscillator();
        droneOsc2 = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        droneGain = audioCtx.createGain();

        droneOsc1.type = 'sine';
        droneOsc1.frequency.value = 48; // Низкий бас

        droneOsc2.type = 'triangle';
        droneOsc2.frequency.value = 51.5; // Бинауральные биения 3.5Hz

        filter.type = 'lowpass';
        filter.frequency.value = 180;

        droneGain.gain.value = 0.001; // Плавный запуск

        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        droneOsc1.start();
        droneOsc2.start();
    }

    // Звуковой щелчок переключения тумблера камеры
    function playSwitchSound() {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    // Звук клика улик (глухой стук)
    function playInteractSound() {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }

    // Управление кнопкой аудио
    const audioToggleBtn = document.getElementById('audio-toggle');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            if (!isAudioPlaying) {
                droneGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.5);
                isAudioPlaying = true;
                audioToggleBtn.classList.add('playing');
                audioToggleBtn.innerHTML = '<span class="audio-icon">&#128266;</span> <span class="audio-label">AUDIO: ON</span>';
                playSwitchSound();
            } else {
                droneGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
                isAudioPlaying = false;
                audioToggleBtn.classList.remove('playing');
                audioToggleBtn.innerHTML = '<span class="audio-icon">&#128263;</span> <span class="audio-label">AUDIO: OFF</span>';
                playSwitchSound();
            }
        });
    }


    // =========================================================================
    // 3. ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ КАМЕРЫ (NORMAL / NVG / VHS)
    // =========================================================================
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetMode = btn.getAttribute('data-mode');
            document.documentElement.setAttribute('data-vision', targetMode);

            modeButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            playSwitchSound();
        });
    });


    // =========================================================================
    // 4. ТАЙМКОД ВИДОИСКАТЕЛЯ (HUD Timecode)
    // =========================================================================
    const timerElem = document.getElementById('hud-timer');
    if (timerElem) {
        let startTime = Date.now();
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
            const mins = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
            const secs = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
            const frames = String(Math.floor((elapsed % 1000) / 16.6)).padStart(2, '0');
            timerElem.textContent = `${hours}:${mins}:${secs}:${frames}`;
        }, 33);
    }


    // =========================================================================
    // 5. 3D CARD TILT ЭФФЕКТ (Interactive Tilt Physics)
    // =========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.setProperty('--tilt-x', x.toFixed(3));
            card.style.setProperty('--tilt-y', (-y).toFixed(3));
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-x', '0');
            card.style.setProperty('--tilt-y', '0');
        });
    });


    // =========================================================================
    // 6. ЗВУКОВОЙ ОТКЛИК УЛИК (Popovers Audio Integration)
    // =========================================================================
    const evidenceTriggers = document.querySelectorAll('.evidence-trigger');
    evidenceTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            playInteractSound();
        });
    });


    // =========================================================================
    // 7. ИНТЕРАКТИВНАЯ ФОРМА ПЛЕЙТЕСТА
    // =========================================================================
    const playtestForm = document.getElementById('playtest-form');
    const feedbackBox = document.getElementById('form-feedback');

    if (playtestForm && feedbackBox) {
        playtestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!playtestForm.checkValidity()) {
                feedbackBox.textContent = 'Ошибка: проверьте заполнение всех полей';
                feedbackBox.className = 'form-response-msg error';
                playSwitchSound();
                return;
            }

            const nameInput = document.getElementById('pt-name');
            const userName = nameInput ? nameInput.value.trim() : 'Испытатель';

            feedbackBox.textContent = `Заявка принята, ${userName}! Инвайт отправлен в реестр альфа-тестеров.`;
            feedbackBox.className = 'form-response-msg success';

            playInteractSound();
            playtestForm.reset();
        });
    }

})();
