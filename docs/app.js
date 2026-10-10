/**
 * STOLEN PEACE — Cutting-Edge Interactive Web Engine
 * Features:
 * - Dynamic Flashlight Beam & Dark Fog Canvas with LERP tracking
 * - VHS Mode with Heavy 10-40% Tape Interference & Glitch Tearing
 * - Procedural Web Audio API Sound Generator (Binaural Drone & Clicks) — ON by default
 * - Vision Mode Auto-Cycle (Every 20s) with 1-Minute Manual Override Pause
 * - Living Capital Letters ("Живые" заглавные буквы): Magnet pull 20-40px & 5s vibration 5-15px
 * - 3D Card Tilt Physics & Fullscreen Popovers
 * Author: RIventStudio (Неменущий Артём Витальевич)
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ДИНАМИЧЕСКИЙ ХОЛСТ ФОНАРЯ И ПОМЕХ VHS (10-40%)
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

    // Отрисовка луча фонаря, тьмы и сильных помех VHS в цикле RAF
    function renderFlashlight() {
        // Линейная интерполяция движения луча (Smooth LERP)
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        ctx.clearRect(0, 0, width, height);

        const visionMode = document.documentElement.getAttribute('data-vision') || 'nvg';
        
        // Коэффициент скролла: в Hero-секции плотная атмосфера, ниже — мягкая комфортная тень
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const heroThreshold = (window.innerHeight || 800) * 0.7;
        const scrollFactor = Math.min(1, Math.max(0, scrollY / heroThreshold));

        if (visionMode === 'nvg') {
            // Режим ночного видения (по умолчанию): фосфорный зеленый луч и полупрозрачная тьма
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
            // Режим VHS: аналоговая пленка и СИЛЬНЫЕ ПОМЕХИ (10-40%)
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

            // === ГЕНЕРАЦИЯ СИЛЬНЫХ ПОМЕХ VHS (10-40%) ===
            // 1. Горизонтальные разрывы видеотракта (tape tears) с хроматическим сдвигом
            const glitchCount = Math.floor(4 + Math.random() * 5); // 4-8 полос
            for (let i = 0; i < glitchCount; i++) {
                const bandY = Math.random() * height;
                const bandH = 2 + Math.random() * 12; // толщина 2-14px
                const noiseIntensity = 0.10 + Math.random() * 0.30; // ровно 10% - 40% помехи!
                
                // Чередование RGB-каналов VHS (красный/голубой глитч)
                ctx.fillStyle = i % 2 === 0 
                    ? `rgba(255, 0, 75, ${noiseIntensity})` 
                    : `rgba(0, 240, 255, ${noiseIntensity})`;
                ctx.fillRect(0, bandY, width, bandH);
            }

            // 2. Статический аналоговый белый шум (зернистость пленки 10-40%)
            const grainIntensity = 0.10 + Math.random() * 0.30;
            ctx.fillStyle = `rgba(255, 255, 255, ${grainIntensity})`;
            for (let j = 0; j < 35; j++) {
                const rx = Math.random() * width;
                const ry = Math.random() * height;
                const rw = 2 + Math.random() * 5;
                ctx.fillRect(rx, ry, rw, 1);
            }

        } else {
            // Обычный режим: классический свет фонаря
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
    // 2. ПРОЦЕДУРНЫЙ WEB AUDIO API (ВКЛЮЧЕНО ПО УМОЛЧАНИЮ)
    // =========================================================================
    let audioCtx = null;
    let droneOsc1 = null;
    let droneOsc2 = null;
    let droneGain = null;
    let isAudioPlaying = true; // AUDIO ПО УМОЛЧАНИЮ ВКЛЮЧЕНО!

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
        droneOsc1.frequency.value = 48; // Низкий бас

        droneOsc2.type = 'triangle';
        droneOsc2.frequency.value = 51.5; // Бинауральные биения 3.5Hz

        filter.type = 'lowpass';
        filter.frequency.value = 180;

        droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        if (isAudioPlaying) {
            droneGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.2);
        }

        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        droneOsc1.start();
        droneOsc2.start();
    }

    // Автоматический старт аудио при загрузке или на первом же взаимодействии
    function autoStartAudio() {
        initAudio();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                if (droneGain && isAudioPlaying) {
                    droneGain.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.5);
                }
            }).catch(() => {});
        }
    }

    // Слушатели для гарантированного обхода Autoplay Policy браузера
    ['pointerdown', 'mousemove', 'wheel', 'keydown', 'touchstart'].forEach((evt) => {
        window.addEventListener(evt, () => {
            if (isAudioPlaying) autoStartAudio();
        }, { once: true, passive: true });
    });

    // Попытка прямого запуска
    try {
        autoStartAudio();
    } catch (_) {}

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

    // Звук клика улик
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
                droneGain.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.4);
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
    // 3. РЕЖИМЫ ЗРЕНИЯ: NVG ПО УМОЛЧАНИЮ, АВТОСМЕНА 20 СЕК + 1 МИН ПАУЗЫ
    // =========================================================================
    const VISION_MODES = ['nvg', 'vhs', 'normal'];
    let currentModeIndex = 0; // NVG по умолчанию
    let manualCooldownUntil = 0; // Временная метка для 1 минуты паузы

    const modeButtons = document.querySelectorAll('.mode-btn');

    function applyVisionMode(mode, isManual = false) {
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
            // При ручном выборе: ровно 1 минута (60 000 мс) без автосмены!
            manualCooldownUntil = Date.now() + 60000;
        }

        playSwitchSound();
    }

    // Обработка ручного клика по кнопкам режимов
    modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetMode = btn.getAttribute('data-mode');
            applyVisionMode(targetMode, true);
        });
    });

    // Автоматическая смена режимов каждые 20 секунд (если не действует минутная пауза)
    setInterval(() => {
        if (Date.now() < manualCooldownUntil) {
            return; // Пропускаем автосмену, если действует 1-минутный кулдаун
        }
        currentModeIndex = (currentModeIndex + 1) % VISION_MODES.length;
        applyVisionMode(VISION_MODES[currentModeIndex], false);
    }, 20000);


    // =========================================================================
    // 4. "ЖИВЫЕ" ЗАГЛАВНЫЕ БУКВЫ (МАГНИТ 20-40PX, РЕЛИЗ 5 СЕК ДРОЖАНИЯ 5-15PX)
    // =========================================================================
    const livingLetters = [];

    function initLivingCapitals() {
        const textElements = document.querySelectorAll(
            '.main-content p, .main-content .news-text, .main-content .lore-desc, .main-content .mech-desc, .main-content .section-lead, .main-content .hero-subtitle'
        );

        textElements.forEach((el) => {
            // Используем TreeWalker для безопасного обхода текстовых узлов без повреждения тегов
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach((node) => {
                const text = node.nodeValue;
                // Ищем заглавные буквы латиницы и кириллицы
                if (/[A-ZА-ЯЁ]/.test(text)) {
                    const spanWrapper = document.createElement('span');
                    spanWrapper.innerHTML = text.replace(/([A-ZА-ЯЁ])/g, '<span class="living-cap">$1</span>');
                    node.parentNode.replaceChild(spanWrapper, node);
                }
            });
        });

        // Регистрируем все найденные заглавные буквы
        document.querySelectorAll('.living-cap').forEach((span) => {
            livingLetters.push({
                el: span,
                isAttracted: false,
                vibrateUntil: 0,
                releaseStart: 0
            });
        });
    }

    // Инициализируем живые буквы
    initLivingCapitals();

    let curMouseX = -9999;
    let curMouseY = -9999;

    window.addEventListener('mousemove', (e) => {
        curMouseX = e.clientX;
        curMouseY = e.clientY;
    }, { passive: true });

    // Цикл физики притяжения и вибрации букв
    function updateLivingCapitals() {
        const now = performance.now();
        const MAGNET_RADIUS = 130;

        for (let i = 0; i < livingLetters.length; i++) {
            const item = livingLetters[i];
            const rect = item.el.getBoundingClientRect();

            // Пропускаем буквы за пределами вьюпорта для максимального FPS
            if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            const dist = Math.hypot(curMouseX - letterCenterX, curMouseY - letterCenterY);

            if (dist < MAGNET_RADIUS && dist > 1) {
                // Буква притягивается магнитом: сила от 20 до 40 pxls!
                const pullPower = 20 + (1 - dist / MAGNET_RADIUS) * 20; // 20-40pxls
                const angle = Math.atan2(curMouseY - letterCenterY, curMouseX - letterCenterX);
                const tx = Math.cos(angle) * pullPower;
                const ty = Math.sin(angle) * pullPower;

                item.el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
                item.el.classList.add('attracted');
                item.isAttracted = true;
                item.vibrateUntil = 0; // Сбрасываем таймер вибрации пока наведен курсор
            } else if (item.isAttracted) {
                // Курсор покинул радиус магнита — МОМЕНТ РЕЛИЗА!
                item.isAttracted = false;
                item.el.classList.remove('attracted');
                item.vibrateUntil = now + 5000; // Ровно 5 секунд после релиза!
                item.releaseStart = now;
                item.el.classList.add('vibrating');
            } else if (item.vibrateUntil > now) {
                // В течение 5 секунд буква продолжает дрожать: амплитуда 5-15 pxls!
                const remaining = item.vibrateUntil - now;
                const progress = remaining / 5000; // от 1.0 до 0.0
                const amp = 5 + progress * 10; // от 15px сразу после релиза до 5px перед остановкой

                const jx = (Math.random() - 0.5) * 2 * amp;
                const jy = (Math.random() - 0.5) * 2 * amp;

                item.el.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px)`;
            } else if (item.vibrateUntil !== 0) {
                // 5 секунд истекли — возвращение в исходный покой
                item.vibrateUntil = 0;
                item.el.style.transform = '';
                item.el.classList.remove('vibrating');
            }
        }

        requestAnimationFrame(updateLivingCapitals);
    }
    requestAnimationFrame(updateLivingCapitals);


    // =========================================================================
    // 5. ТАЙМКОД ВИДОИСКАТЕЛЯ (HUD Timecode)
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
    // 6. 3D CARD TILT ЭФФЕКТ (Interactive Tilt Physics)
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
    // 7. ЗВУКОВОЙ ОТКЛИК УЛИК (Popovers Audio Integration)
    // =========================================================================
    const evidenceTriggers = document.querySelectorAll('.zoom-btn');
    evidenceTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            playInteractSound();
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
