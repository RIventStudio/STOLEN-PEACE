/**
 * STOLEN PEACE — Cutting-Edge Native Web Engine
 * 
 * Features:
 * - Dynamic Flashlight Beam (+20% Brightness & Expanded Illuminance)
 * - Native <dialog> Modals with Full Card Click & Esc/Backdrop Click
 * - Native View Transitions API for Vision Modes
 * - Native Temporal API for Timecode with <20 line fallback
 * - Auto-playing Web Audio with 30-90s Smooth Breathing Volume Modulation (10% to 60%)
 * - Audio-Volume Bound Living Capital Letters:
 *   * Letter vibration intensity is directly proportional to audio volume (10% to 60%)
 *   * When muted: letter vibration remains at 10% of base amplitude (subtle jitter)
 * - 20s Auto-Cycle with 60s Manual Override Pause
 * - VHS Mode with Heavy 10-40% Tape Interference
 * 
 * Author: RIventStudio
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ДИНАМИЧЕСКИЙ ХОЛСТ ФОНАРЯ (+20% ЯРКОСТИ) И VHS ПОМЕХИ (10-40%)
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

    // Отрисовка луча фонаря (яркость увеличена на 20%) и помех VHS
    function renderFlashlight() {
        // Линейная интерполяция движения луча (Smooth LERP)
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        ctx.clearRect(0, 0, width, height);

        const visionMode = document.documentElement.getAttribute('data-vision') || 'nvg';
        
        // Коэффициент скролла: в Hero-секции атмосфера, ниже — комфортное чтение
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const heroThreshold = (window.innerHeight || 800) * 0.7;
        const scrollFactor = Math.min(1, Math.max(0, scrollY / heroThreshold));

        if (visionMode === 'nvg') {
            // Режим ночного видения: фосфорный луч (+20% яркости и охвата)
            const nvgAlpha = 0.64 - (scrollFactor * 0.35); // на 20% светлее фон
            ctx.fillStyle = `rgba(1, 15, 6, ${nvgAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                // Радиус увеличен на 20%: с 0.38 до 0.46
                const radius = Math.min(width, height) * 0.46;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 25, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(0, 255, 102, 0.65)'); // на 20% ярче центр
                grad.addColorStop(0.5, 'rgba(0, 255, 102, 0.26)');
                grad.addColorStop(1, 'rgba(1, 15, 6, 0)');

                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        } else if (visionMode === 'vhs') {
            // Режим VHS: аналоговая пленка (+20% яркости луча) и сильные помехи (10-40%)
            const vhsAlpha = 0.74 - (scrollFactor * 0.44);
            ctx.fillStyle = `rgba(7, 6, 12, ${vhsAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                // Радиус увеличен на 20%: с 0.35 до 0.42
                const radius = Math.min(width, height) * 0.42;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 35, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.55)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }

            // === ГЕНЕРАЦИЯ СИЛЬНЫХ ПОМЕХ VHS (10-40%) ===
            const glitchCount = Math.floor(4 + Math.random() * 5);
            for (let i = 0; i < glitchCount; i++) {
                const bandY = Math.random() * height;
                const bandH = 2 + Math.random() * 12;
                const noiseIntensity = 0.10 + Math.random() * 0.30; // 10% - 40% помехи!
                
                ctx.fillStyle = i % 2 === 0 
                    ? `rgba(255, 0, 75, ${noiseIntensity})` 
                    : `rgba(0, 240, 255, ${noiseIntensity})`;
                ctx.fillRect(0, bandY, width, bandH);
            }

            const grainIntensity = 0.10 + Math.random() * 0.30;
            ctx.fillStyle = `rgba(255, 255, 255, ${grainIntensity})`;
            for (let j = 0; j < 35; j++) {
                const rx = Math.random() * width;
                const ry = Math.random() * height;
                const rw = 2 + Math.random() * 5;
                ctx.fillRect(rx, ry, rw, 1);
            }

        } else {
            // Обычный режим: классический свет фонаря (+20% яркости и охвата)
            const baseAlpha = 0.80 - (scrollFactor * 0.55); // на 20% светлее
            ctx.fillStyle = `rgba(5, 6, 9, ${baseAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (isMouseOnScreen) {
                // Радиус увеличен на 22%: с 0.36 до 0.44
                const radius = Math.min(width, height) * 0.44;
                const grad = ctx.createRadialGradient(mouseX, mouseY, 20, mouseX, mouseY, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.70)'); // ярче на 20%
                grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.25)'); // ярче
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
    // 2. АВТО-ВОСПРОИЗВЕДЕНИЕ АУДИО И МОДУЛЯЦИЯ ГРОМКОСТИ (10% - 60%, ПЕРИОД 60 СЕК)
    // =========================================================================
    let audioCtx = null;
    let droneOsc1 = null;
    let droneOsc2 = null;
    let droneGain = null;
    let isAudioPlaying = true; // Аудио воспроизводится сразу при открытии!

    // Переменные для модуляции громкости и связи с живыми буквами
    const VOLUME_PERIOD_MS = 60000; // Период модуляции громкости: 60 сек (диапазон 30-90 сек)
    const BASE_GAIN = 0.12;
    let currentVolumeRatio = 0.60; // от 0.10 (10%) до 0.60 (60%) от базовой громкости
    let normalizedVibeFactor = 0.60; // пропорционально громкости (при мьюте: 0.10)

    function initAudio() {
        if (audioCtx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Низкочастотный бинауральный дрон (48Hz и 51.5Hz)
        droneOsc1 = audioCtx.createOscillator();
        droneOsc2 = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        droneGain = audioCtx.createGain();

        droneOsc1.type = 'sine';
        droneOsc1.frequency.value = 48;

        droneOsc2.type = 'triangle';
        droneOsc2.frequency.value = 51.5;

        filter.type = 'lowpass';
        filter.frequency.value = 180;

        droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(BASE_GAIN * currentVolumeRatio, audioCtx.currentTime + 0.8);

        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        droneOsc1.start();
        droneOsc2.start();
    }

    // Немедленный запуск звука при загрузке страницы
    function startAudioImmediately() {
        initAudio();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
    }

    // Запускаем сразу на старте
    try {
        startAudioImmediately();
    } catch (_) {}

    // Гарантированный запуск при любом первом касании/движении/фокусе/загрузке
    ['DOMContentLoaded', 'load', 'pageshow', 'focus', 'pointerdown', 'pointermove', 'mousemove', 'wheel', 'keydown', 'scroll', 'touchstart'].forEach((evt) => {
        window.addEventListener(evt, () => {
            if (isAudioPlaying) {
                startAudioImmediately();
            }
        }, { once: true, passive: true });
    });

    // Плавное циклическое дыхание громкости (от 10% до 60% от базовой, период 60 секунд)
    function updateVolumeBreathing() {
        const cycleProgress = (performance.now() % VOLUME_PERIOD_MS) / VOLUME_PERIOD_MS;
        
        // Синусоида с диапазоном [0.10, 0.60]:
        // Центр = (0.60 + 0.10) / 2 = 0.35, амплитуда = (0.60 - 0.10) / 2 = 0.25
        const sinWave = Math.sin(cycleProgress * Math.PI * 2);
        currentVolumeRatio = 0.35 + (0.25 * sinWave); // колеблется плавно между 0.10 и 0.60
        
        // Интенсивность дрожания букв пропорциональна громкости (при мьюте — ровно 10%)
        if (isAudioPlaying) {
            normalizedVibeFactor = currentVolumeRatio;
            if (droneGain && audioCtx && audioCtx.state === 'running') {
                const targetGain = BASE_GAIN * currentVolumeRatio;
                droneGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.2);
            }
        } else {
            normalizedVibeFactor = 0.10; // при мьют — 10% от текущей/базовой интенсивности
        }

        requestAnimationFrame(updateVolumeBreathing);
    }
    requestAnimationFrame(updateVolumeBreathing);

    // Звуковой щелчок тумблера камеры
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

    // Звук клика по превью
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

    // Кнопка аудио в HUD
    const audioToggleBtn = document.getElementById('audio-toggle');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            if (!isAudioPlaying) {
                droneGain.gain.setTargetAtTime(BASE_GAIN * currentVolumeRatio, audioCtx.currentTime, 0.4);
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
    // 3. РЕЖИМЫ ЗРЕНИЯ: НА ТИВНЫЙ VIEW TRANSITIONS + АВТОСМЕНА 20 СЕК (ПАУЗА 1 МИН)
    // =========================================================================
    const VISION_MODES = ['nvg', 'vhs', 'normal'];
    let currentModeIndex = 0; // NVG по умолчанию
    let manualCooldownUntil = 0;

    const modeButtons = document.querySelectorAll('.mode-btn');

    function executeModeSwitch(mode, isManual = false) {
        document.documentElement.setAttribute('data-vision', mode);

        modeButtons.forEach((b) => {
            if (b.getAttribute('data-mode') === mode) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        currentModeIndex = VISION_MODES.indexOf(mode);
        if (currentModeIndex === -1) currentModeIndex = 0;

        if (isManual) {
            manualCooldownUntil = Date.now() + 60000; // 1 минута без автосмены
        }

        playSwitchSound();
    }

    // Применение с нативным View Transitions API
    function applyVisionMode(mode, isManual = false) {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                executeModeSwitch(mode, isManual);
            });
        } else {
            executeModeSwitch(mode, isManual);
        }
    }

    modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetMode = btn.getAttribute('data-mode');
            applyVisionMode(targetMode, true);
        });
    });

    setInterval(() => {
        if (Date.now() < manualCooldownUntil) {
            return;
        }
        currentModeIndex = (currentModeIndex + 1) % VISION_MODES.length;
        applyVisionMode(VISION_MODES[currentModeIndex], false);
    }, 20000);


    // =========================================================================
    // 4. "ЖИВЫЕ" ЗАГЛАВНЫЕ БУКВЫ — АМПЛИТУДА ПРИВЯЗАНА К ГРОМКОСТИ АУДИО!
    //    (На нижнем уровне громкости НЕ дрожат, на верхнем — дрожат 5-15px)
    // =========================================================================
    const livingLetters = [];

    function initLivingCapitals() {
        const textElements = document.querySelectorAll(
            '.main-content p, .main-content .news-text, .main-content .lore-desc, .main-content .mech-desc, .main-content .section-lead, .main-content .hero-subtitle'
        );

        textElements.forEach((el) => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach((node) => {
                const text = node.nodeValue;
                if (/[A-ZА-ЯЁ]/.test(text)) {
                    const spanWrapper = document.createElement('span');
                    spanWrapper.innerHTML = text.replace(/([A-ZА-ЯЁ])/g, '<span class="living-cap">$1</span>');
                    node.parentNode.replaceChild(spanWrapper, node);
                }
            });
        });

        document.querySelectorAll('.living-cap').forEach((span) => {
            livingLetters.push({
                el: span,
                isAttracted: false,
                vibrateUntil: 0,
                releaseStart: 0
            });
        });
    }

    initLivingCapitals();

    let curMouseX = -9999;
    let curMouseY = -9999;

    window.addEventListener('mousemove', (e) => {
        curMouseX = e.clientX;
        curMouseY = e.clientY;
    }, { passive: true });

    function updateLivingCapitals() {
        const now = performance.now();
        const MAGNET_RADIUS = 130;

        for (let i = 0; i < livingLetters.length; i++) {
            const item = livingLetters[i];
            const rect = item.el.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            const dist = Math.hypot(curMouseX - letterCenterX, curMouseY - letterCenterY);

            if (dist < MAGNET_RADIUS && dist > 1) {
                // Буква притягивается магнитом: сила 20-40 pxls!
                const pullPower = 20 + (1 - dist / MAGNET_RADIUS) * 20;
                const angle = Math.atan2(curMouseY - letterCenterY, curMouseX - letterCenterX);
                const tx = Math.cos(angle) * pullPower;
                const ty = Math.sin(angle) * pullPower;

                item.el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
                item.el.classList.add('attracted');
                item.isAttracted = true;
                item.vibrateUntil = 0;
            } else if (item.isAttracted) {
                // Момент релиза: запускаем 5 секунд дрожания
                item.isAttracted = false;
                item.el.classList.remove('attracted');
                item.vibrateUntil = now + 5000;
                item.releaseStart = now;
                item.el.classList.add('vibrating');
            } else if (item.vibrateUntil > now) {
                // === СВЯЗЬ АМПЛИТУДЫ С ГРОМКОСТЬЮ АУДИО ===
                // Интенсивность пропорциональна громкости (от 10% до 60%),
                // а при мьюте составляет 10% от базовой амплитуды (0.10)
                const remaining = item.vibrateUntil - now;
                const progress = remaining / 5000;
                const baseAmp = 5 + progress * 10; // от 15px до 5px
                const effectiveAmp = baseAmp * normalizedVibeFactor;

                const jx = (Math.random() - 0.5) * 2 * effectiveAmp;
                const jy = (Math.random() - 0.5) * 2 * effectiveAmp;

                item.el.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px)`;
            } else if (item.vibrateUntil !== 0) {
                item.vibrateUntil = 0;
                item.el.style.transform = '';
                item.el.classList.remove('vibrating');
            }
        }

        requestAnimationFrame(updateLivingCapitals);
    }
    requestAnimationFrame(updateLivingCapitals);


    // =========================================================================
    // 5. НА ТИВНЫЕ МОДАЛЬНЫЕ ОКНА <dialog> И КЛИК ПО ВСЕМУ ПРЕВЬЮ
    // =========================================================================
    const photoDialogs = document.querySelectorAll('.photo-dialog');
    photoDialogs.forEach((dialog) => {
        // Закрытие по клику мимо контента (по нативному ::backdrop)
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
                playSwitchSound();
            }
        });

        // Кнопка закрытия
        const closeBtn = dialog.querySelector('.dialog-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                dialog.close();
                playSwitchSound();
            });
        }
    });

    // Клик на ВСЕМ превью открывает соответствующий <dialog>
    const clickablePreviews = document.querySelectorAll('.clickable-preview');
    clickablePreviews.forEach((preview) => {
        const dialogId = preview.getAttribute('data-dialog');
        const targetDialog = document.getElementById(dialogId);
        if (!targetDialog) return;

        preview.addEventListener('click', () => {
            targetDialog.showModal();
            playInteractSound();
        });

        preview.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                targetDialog.showModal();
                playInteractSound();
            }
        });
    });


    // =========================================================================
    // 6. ТАЙМКОД ВИДОИСКАТЕЛЯ (НА ТИВНЫЙ TEMPORAL API С ЛЕГКИМ ФОЛБЭКОМ < 20 СТРОК)
    // =========================================================================
    const timerElem = document.getElementById('hud-timer');
    if (timerElem) {
        let startTime = Date.now();
        setInterval(() => {
            if (typeof Temporal !== 'undefined' && Temporal.Now) {
                const now = Temporal.Now.zonedDateTimeISO();
                const h = String(now.hour).padStart(2, '0');
                const m = String(now.minute).padStart(2, '0');
                const s = String(now.second).padStart(2, '0');
                const ms = String(Math.floor(now.millisecond / 16.6)).padStart(2, '0');
                timerElem.textContent = `${h}:${m}:${s}:${ms}`;
            } else {
                // Нативный Temporal fallback (< 15 строк)
                const elapsed = Date.now() - startTime;
                const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
                const mins = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
                const secs = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
                const frames = String(Math.floor((elapsed % 1000) / 16.6)).padStart(2, '0');
                timerElem.textContent = `${hours}:${mins}:${secs}:${frames}`;
            }
        }, 33);
    }


    // =========================================================================
    // 7. 3D CARD TILT ЭФФЕКТ
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
    // 8. ИНТЕРАКТИВНАЯ ФОРМА ПЛЕЙТЕСТА
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
