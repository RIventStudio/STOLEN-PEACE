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
 * - Screamer Easter Egg: Edge Idle (10%, 15s) -> 100% Volume Piercing Siren (5s + 2s decay),
 *   Fixed Vertical Position Acid-Yellow Warning Banner ('НЕ ОСТАНАВЛИВАЙСЯ!!!'),
 *   5s 3D Vertical Axis Flip ('УВИДЕМСЯ !!!'), Smooth 10s Exit Back into Screen Edge
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
    // 6. РЕАЛЬНОЕ ВРЕМЯ (TEMPORAL API), РЕАЛЬНОЕ РАЗРЕШЕНИЕ И РЕАЛЬНЫЙ FPS
    // =========================================================================
    const timerElem = document.getElementById('hud-timer');
    const resNameElem = document.getElementById('hud-res-name');
    const fpsValElem = document.getElementById('hud-fps-val');
    const hudResElem = document.getElementById('hud-res');

    // 6.1. РЕАЛЬНОЕ СИСТЕМНОЕ ВРЕМЯ (ЧЧ:ММ:СС:КК)
    function updateRealTimecode() {
        if (!timerElem) return;
        let h, m, s, frames;
        if (typeof Temporal !== 'undefined' && Temporal.Now) {
            try {
                const now = Temporal.Now.plainTimeISO();
                h = String(now.hour).padStart(2, '0');
                m = String(now.minute).padStart(2, '0');
                s = String(now.second).padStart(2, '0');
                frames = String(Math.floor((now.millisecond / 1000) * 60)).padStart(2, '0');
            } catch (_) {}
        }
        if (!h) {
            const now = new Date();
            h = String(now.getHours()).padStart(2, '0');
            m = String(now.getMinutes()).padStart(2, '0');
            s = String(now.getSeconds()).padStart(2, '0');
            frames = String(Math.floor((now.getMilliseconds() / 1000) * 60)).padStart(2, '0');
        }
        timerElem.textContent = `${h}:${m}:${s}:${frames}`;
    }
    setInterval(updateRealTimecode, 33);
    updateRealTimecode();

    // 6.2. РЕАЛЬНОЕ РАЗРЕШЕНИЕ (БЛИЖАЙШЕЕ НАЗВАНИЕ С УЧЕТОМ ОРИЕНТАЦИИ И ТЕЛЕФОНОВ)
    const RESOLUTION_DB = [
        { name: '8K UHD', w: 7680, h: 4320 },
        { name: '6K', w: 6016, h: 3384 },
        { name: '5K', w: 5120, h: 2880 },
        { name: 'DQHD', w: 5120, h: 1440 },
        { name: '4K DCI', w: 4096, h: 2160 },
        { name: '4K UHD', w: 3840, h: 2160 },
        { name: 'UW4K', w: 3840, h: 1600 },
        { name: 'UWQHD', w: 3440, h: 1440 },
        { name: 'WQHD+', w: 3200, h: 1440 },
        { name: 'WQHD+', w: 3088, h: 1440 },
        { name: '3K', w: 3000, h: 2000 },
        { name: 'QHD+', w: 2880, h: 1800 },
        { name: 'QHD+', w: 2880, h: 1440 },
        { name: 'Super Retina XDR', w: 2796, h: 1290 },
        { name: 'Super Retina XDR', w: 2778, h: 1284 },
        { name: '1.5K', w: 2712, h: 1220 },
        { name: '2.5K Retina', w: 2560, h: 1600 },
        { name: 'QHD', w: 2560, h: 1440 },
        { name: 'Super Retina', w: 2556, h: 1179 },
        { name: 'Super Retina', w: 2532, h: 1170 },
        { name: 'UW-FHD', w: 2560, h: 1080 },
        { name: 'FHD+', w: 2460, h: 1080 },
        { name: 'FHD+', w: 2400, h: 1080 },
        { name: 'FHD+', w: 2340, h: 1080 },
        { name: 'WUXGA', w: 1920, h: 1200 },
        { name: 'FHD', w: 1920, h: 1080 },
        { name: 'WSXGA+', w: 1680, h: 1050 },
        { name: 'UXGA', w: 1600, h: 1200 },
        { name: 'HD+', w: 1640, h: 720 },
        { name: 'HD+', w: 1600, h: 720 },
        { name: 'HD+', w: 1560, h: 720 },
        { name: 'HD+', w: 1600, h: 900 },
        { name: 'WXGA', w: 1366, h: 768 },
        { name: 'WXGA', w: 1280, h: 800 },
        { name: 'HD', w: 1280, h: 720 },
        { name: 'XGA', w: 1024, h: 768 },
        { name: 'WSVGA', w: 1024, h: 600 },
        { name: 'qHD', w: 960, h: 540 },
        { name: 'FWVGA', w: 854, h: 480 },
        { name: 'WVGA', w: 800, h: 480 },
        { name: 'SVGA', w: 800, h: 600 },
        { name: 'VGA', w: 640, h: 480 },
        { name: 'nHD', w: 640, h: 360 },
        { name: 'HVGA', w: 480, h: 320 },
        { name: 'QVGA', w: 320, h: 240 }
    ];

    function updateRealResolution() {
        const dpr = window.devicePixelRatio || 1;
        const winW = Math.round(window.innerWidth * dpr);
        const winH = Math.round(window.innerHeight * dpr);
        const scrW = Math.round((window.screen?.width || 0) * dpr);
        const scrH = Math.round((window.screen?.height || 0) * dpr);

        // На реальном мониторе/смартфоне компенсируем высоту интерфейса браузера (панели/таскбар),
        // а при оконном режиме используем размеры активного окна:
        const curW = (scrW > winW && winW >= (scrW * 0.82)) ? scrW : winW;
        const curH = (scrH > winH && winH >= (scrH * 0.82)) ? scrH : winH;

        // Нормализация ориентации (длинная сторона и короткая сторона)
        const curLong = Math.max(curW, curH);
        const curShort = Math.min(curW, curH);

        let bestMatch = 'FHD';
        let minDiff = Infinity;

        for (let i = 0; i < RESOLUTION_DB.length; i++) {
            const item = RESOLUTION_DB[i];
            const targetLong = Math.max(item.w, item.h);
            const targetShort = Math.min(item.w, item.h);

            const diff = Math.pow((curLong - targetLong) / targetLong, 2) +
                         Math.pow((curShort - targetShort) / targetShort, 2);

            if (diff < minDiff) {
                minDiff = diff;
                bestMatch = item.name;
            }
        }

        if (resNameElem) {
            resNameElem.textContent = bestMatch;
        }
        if (hudResElem) {
            const isPortrait = (window.innerHeight > window.innerWidth);
            const orient = isPortrait ? 'Портрет' : 'Альбом';
            hudResElem.setAttribute('title', `Реальное разрешение: ${curW}×${curH} (${bestMatch}, ${orient}, DPR: ${dpr.toFixed(1)})`);
        }
    }

    updateRealResolution();
    window.addEventListener('resize', updateRealResolution, { passive: true });
    window.addEventListener('orientationchange', updateRealResolution, { passive: true });

    // 6.3. РЕАЛЬНЫЙ FPS (ИЗМЕРЕНИЕ ЧЕРЕЗ requestAnimationFrame)
    let fpsFrames = 0;
    let fpsPrevTime = performance.now();

    function calcRealFps(now) {
        fpsFrames++;
        const delta = now - fpsPrevTime;
        if (delta >= 500) {
            const currentFps = Math.min(999, Math.max(1, Math.round((fpsFrames * 1000) / delta)));
            if (fpsValElem) {
                fpsValElem.textContent = String(currentFps);
            }
            fpsFrames = 0;
            fpsPrevTime = now;
        }
        requestAnimationFrame(calcRealFps);
    }
    requestAnimationFrame(calcRealFps);


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


    // =========================================================================
    // 9. ПАСХАЛКА-СКРИМЕР: КРАЙ ЭКРАНА (10%) + 15 СЕК БЕЗ ДВИЖЕНИЯ
    // =========================================================================
    const screamerBanner = document.getElementById('screamer-banner');
    let edgeIdleTimer = null;
    let isScreamerActive = false;
    let cachedMouseX = -1;
    let cachedMouseY = -1;

    // Резкий пронзительный звук сирены на 100% громкости (5 сек + 2 сек спад)
    function playScreamerSiren() {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }

        const now = audioCtx.currentTime;
        const masterGain = audioCtx.createGain();
        
        // 100% громкости!
        masterGain.gain.setValueAtTime(1.0, now);

        // Осциллятор 1: Пронзительная визжащая сирена (sawtooth) с частотной модуляцией
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(880, now);

        // LFO для сирены (колебание высоты звука 3.5 раза в секунду)
        const lfo1 = audioCtx.createOscillator();
        lfo1.type = 'sawtooth';
        lfo1.frequency.setValueAtTime(3.5, now);

        const lfoGain1 = audioCtx.createGain();
        lfoGain1.gain.setValueAtTime(320, now); // Модуляция +/- 320 Гц

        lfo1.connect(lfoGain1);
        lfoGain1.connect(osc1.frequency);

        // Осциллятор 2: Диссонантный резкий квадрат (square) для тревоги
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(740, now); // Диссонирующий тритон

        const lfo2 = audioCtx.createOscillator();
        lfo2.type = 'sine';
        lfo2.frequency.setValueAtTime(7, now);

        const lfoGain2 = audioCtx.createGain();
        lfoGain2.gain.setValueAtTime(150, now);

        lfo2.connect(lfoGain2);
        lfoGain2.connect(osc2.frequency);

        // Саб-удар в момент появления (шоковый бас)
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(120, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

        const subGain = audioCtx.createGain();
        subGain.gain.setValueAtTime(0.9, now);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        subOsc.connect(subGain);
        subGain.connect(masterGain);

        // Микширование генераторов
        const g1 = audioCtx.createGain();
        g1.gain.value = 0.55;
        osc1.connect(g1);
        g1.connect(masterGain);

        const g2 = audioCtx.createGain();
        g2.gain.value = 0.45;
        osc2.connect(g2);
        g2.connect(masterGain);

        masterGain.connect(audioCtx.destination);

        // Старт звука
        osc1.start(now);
        osc2.start(now);
        lfo1.start(now);
        lfo2.start(now);
        subOsc.start(now);
        subOsc.stop(now + 1.25);

        // Через 5 сек сирена начинает стихать (2 сек спад: от 5.0 до 7.0)
        masterGain.gain.setValueAtTime(1.0, now + 5.0);
        masterGain.gain.linearRampToValueAtTime(0.0001, now + 7.0);

        // Остановка осцилляторов после полного затухания
        osc1.stop(now + 7.1);
        osc2.stop(now + 7.1);
        lfo1.stop(now + 7.1);
        lfo2.stop(now + 7.1);
    }

    // Активация пасхалки
    function triggerScreamerEasterEgg(x, y) {
        if (!screamerBanner || isScreamerActive) return;
        isScreamerActive = true;

        if (edgeIdleTimer) {
            clearTimeout(edgeIdleTimer);
            edgeIdleTimer = null;
        }

        // Позиционирование:
        // Если мышь в нижней половине экрана - плашка появляется ВВЕРХУ, и наоборот!
        const isBottomHalf = y > (window.innerHeight * 0.5);
        const verticalClass = isBottomHalf ? 'pos-top' : 'pos-bottom';

        // Выезд из того края, где стояла мышь (левый или правый 10%)
        const isLeftEdge = x <= (window.innerWidth * 0.5);
        const edgeClass = isLeftEdge ? 'edge-left' : 'edge-right';

        // Подготовка плашки
        screamerBanner.className = `screamer-banner ${verticalClass} ${edgeClass}`;
        screamerBanner.setAttribute('aria-hidden', 'false');

        // Принудительный reflow браузера перед анимацией въезда
        void screamerBanner.offsetHeight;

        // Появление плашки
        screamerBanner.classList.add('is-visible');

        // 1. Звук сирены 100% громкости на 5 сек, затем 2 сек спад
        playScreamerSiren();

        // 2. Через 5 сек плашка переворачивается вдоль вертикальной оси (обратная сторона "УВИДЕМСЯ !!!")
        setTimeout(() => {
            if (screamerBanner) {
                screamerBanner.classList.add('is-flipped');
            }
        }, 5000);

        // 3. Через 10 сек после переворота плавно заезжает обратно в край экрана
        setTimeout(() => {
            if (screamerBanner) {
                screamerBanner.classList.remove('is-visible');
            }
        }, 15000);

        // Сброс состояния после полного завершения уезда в край
        setTimeout(() => {
            if (screamerBanner) {
                screamerBanner.classList.remove('is-flipped');
                screamerBanner.setAttribute('aria-hidden', 'true');
            }
            isScreamerActive = false;
        }, 16000);
    }

    // Отслеживание мыши в 10% зонах краев экрана
    window.addEventListener('mousemove', (e) => {
        cachedMouseX = e.clientX;
        cachedMouseY = e.clientY;

        if (isScreamerActive) return;

        const winWidth = window.innerWidth;
        const inLeftEdge = e.clientX <= (winWidth * 0.10);
        const inRightEdge = e.clientX >= (winWidth * 0.90);

        if (edgeIdleTimer) {
            clearTimeout(edgeIdleTimer);
            edgeIdleTimer = null;
        }

        // Если курсор находится в левом или правом 10% краю:
        // запускаем таймер на 15 секунд бездействия
        if (inLeftEdge || inRightEdge) {
            edgeIdleTimer = setTimeout(() => {
                triggerScreamerEasterEgg(cachedMouseX, cachedMouseY);
            }, 15000);
        }
    }, { passive: true });

    // Любая активность пользователя (клавиатура, скролл, колесико) сбрасывает ожидание
    function resetEdgeIdleOnActivity() {
        if (isScreamerActive) return;
        if (edgeIdleTimer) {
            clearTimeout(edgeIdleTimer);
            edgeIdleTimer = null;
        }
        const winWidth = window.innerWidth;
        const inLeftEdge = cachedMouseX >= 0 && cachedMouseX <= (winWidth * 0.10);
        const inRightEdge = cachedMouseX >= (winWidth * 0.90);
        if (inLeftEdge || inRightEdge) {
            edgeIdleTimer = setTimeout(() => {
                triggerScreamerEasterEgg(cachedMouseX, cachedMouseY);
            }, 15000);
        }
    }

    ['keydown', 'scroll', 'wheel', 'pointerdown', 'touchstart'].forEach((evt) => {
        window.addEventListener(evt, resetEdgeIdleOnActivity, { passive: true });
    });

    document.addEventListener('mouseleave', () => {
        if (edgeIdleTimer) {
            clearTimeout(edgeIdleTimer);
            edgeIdleTimer = null;
        }
    });

    // Экспорт для отладки и демонстрации
    window.__triggerScreamer = triggerScreamerEasterEgg;

    // Поддержка тестового предпросмотра через хеш URL:
    // #screamer-front -> мгновенно активирует лицевую сторону ("НЕ ОСТАНАВЛИВАЙСЯ!!!")
    // #screamer-back  -> мгновенно активирует обратную сторону ("УВИДЕМСЯ !!!")
    if (window.location.hash === '#screamer-front') {
        setTimeout(() => {
            triggerScreamerEasterEgg(50, 700);
        }, 100);
    } else if (window.location.hash === '#screamer-back') {
        setTimeout(() => {
            triggerScreamerEasterEgg(50, 700);
            if (screamerBanner) screamerBanner.classList.add('is-flipped');
        }, 100);
    }

})();
