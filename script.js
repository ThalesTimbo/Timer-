// Variáveis globais para o cronômetro
let stopwatchTime = 0; // Tempo em centésimos de segundo
let stopwatchInterval = null;
let stopwatchRunning = false;

// Variáveis globais para o temporizador
let timerTime = 0; // Tempo em segundos
let timerInterval = null;
let timerRunning = false;
let initialTimerMinutes = 5;
let initialTimerSeconds = 0;

// Elementos do DOM
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const timerMinutesInput = document.getElementById('timerMinutes');
const timerSecondsInput = document.getElementById('timerSeconds');
const stopwatchStatus = document.getElementById('stopwatchStatus');
const timerStatus = document.getElementById('timerStatus');

// Botões do cronômetro
const startStopwatchBtn = document.getElementById('startStopwatch');
const pauseStopwatchBtn = document.getElementById('pauseStopwatch');
const resetStopwatchBtn = document.getElementById('resetStopwatch');

// Botões do temporizador
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');

// ==================== EFEITO RIPPLE ====================
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// ==================== FUNÇÕES DO CRONÔMETRO ====================

/**
 * Formata o tempo do cronômetro em MM:SS:MS
 * @param {number} centiseconds - Tempo em centésimos de segundo
 * @returns {string} - Tempo formatado
 */
function formatStopwatchTime(centiseconds) {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const ms = centiseconds % 100;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
}

/**
 * Atualiza o display do cronômetro
 */
function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchTime);
}

/**
 * Inicia o cronômetro
 */
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchStatus.classList.add('active');
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 10); // Atualiza a cada 10ms (centésimos)
    }
}

/**
 * Pausa o cronômetro
 */
function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        stopwatchStatus.classList.remove('active');
        clearInterval(stopwatchInterval);
    }
}

/**
 * Reseta o cronômetro
 */
function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

// ==================== FUNÇÕES DO TEMPORIZADOR ====================

/**
 * Formata o tempo do temporizador em MM:SS
 * @param {number} seconds - Tempo em segundos
 * @returns {string} - Tempo formatado
 */
function formatTimerTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Atualiza o display do temporizador
 */
function updateTimerDisplay() {
    timerDisplay.textContent = formatTimerTime(timerTime);
}

/**
 * Obtém o tempo inicial do temporizador dos inputs
 */
function getInitialTimerTime() {
    const minutes = parseInt(timerMinutesInput.value) || 0;
    const seconds = parseInt(timerSecondsInput.value) || 0;
    return minutes * 60 + seconds;
}

/**
 * Cria um alerta customizado mais bonito
 */
function showCustomAlert() {
    // Remove alerta anterior se existir
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff4757, #ff3838);
            color: white;
            padding: 30px 40px;
            border-radius: 20px;
            font-family: 'Poppins', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            box-shadow: 0 20px 60px rgba(255, 71, 87, 0.4);
            z-index: 10000;
            animation: alertPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            backdrop-filter: blur(10px);
        ">
            <div style="font-size: 2rem; margin-bottom: 10px;">⏰</div>
            <div>Tempo Esgotado!</div>
            <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">Clique para fechar</div>
        </div>
        <style>
            @keyframes alertPop {
                0% { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.5);
                }
                100% { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        </style>
    `;

    document.body.appendChild(alertDiv);

    // Remove o alerta ao clicar ou após 5 segundos
    alertDiv.addEventListener('click', () => alertDiv.remove());
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Inicia o temporizador
 */
function startTimer() {
    // Se não estiver rodando, pega o tempo dos inputs
    if (!timerRunning) {
        // Se o timer está em 0, pega o tempo dos inputs
        if (timerTime === 0) {
            timerTime = getInitialTimerTime();
        }
        
        // Valida se o tempo é maior que zero
        if (timerTime <= 0) {
            showCustomAlert();
            return;
        }
        
        timerRunning = true;
        timerStatus.classList.add('active');
        timerDisplay.classList.remove('expired');
        
        timerInterval = setInterval(() => {
            timerTime--;
            updateTimerDisplay();
            
            // Verifica se o tempo acabou
            if (timerTime <= 0) {
                pauseTimer();
                timerDisplay.classList.add('expired');
                showCustomAlert();
            }
        }, 1000); // Atualiza a cada segundo
    }
}

/**
 * Pausa o temporizador
 */
function pauseTimer() {
    if (timerRunning) {
        timerRunning = false;
        timerStatus.classList.remove('active');
        clearInterval(timerInterval);
    }
}

/**
 * Reseta o temporizador
 */
function resetTimer() {
    pauseTimer();
    timerTime = getInitialTimerTime();
    timerDisplay.classList.remove('expired');
    updateTimerDisplay();
}

/**
 * Atualiza o display do timer quando os inputs mudam
 */
function updateTimerFromInputs() {
    if (!timerRunning) {
        timerTime = getInitialTimerTime();
        updateTimerDisplay();
    }
}

// ==================== EVENT LISTENERS ====================

// Adiciona efeito ripple a todos os botões
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Cronômetro
startStopwatchBtn.addEventListener('click', startStopwatch);
pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);

// Temporizador
startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Inputs do temporizador
timerMinutesInput.addEventListener('input', updateTimerFromInputs);
timerSecondsInput.addEventListener('input', updateTimerFromInputs);

// Validação dos inputs (não permitir valores negativos)
timerMinutesInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

timerSecondsInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

// Efeitos de hover nos cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animação de digitação nos inputs
document.querySelectorAll('.timer-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Efeito de pulsação no display quando ativo
function addPulseEffect() {
    if (stopwatchRunning) {
        stopwatchDisplay.style.animation = 'textPulse 2s ease-in-out infinite alternate';
    } else {
        stopwatchDisplay.style.animation = 'none';
    }
    
    if (timerRunning) {
        timerDisplay.style.animation = 'textPulse 2s ease-in-out infinite alternate';
    } else if (!timerDisplay.classList.contains('expired')) {
        timerDisplay.style.animation = 'none';
    }
}

// Atualiza efeitos visuais
setInterval(addPulseEffect, 100);

// ==================== INICIALIZAÇÃO ====================

// Inicializa os displays
updateStopwatchDisplay();
timerTime = getInitialTimerTime();
updateTimerDisplay();

// Animação de entrada dos elementos
setTimeout(() => {
    document.querySelector('.hero-title').style.opacity = '1';
    document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}, 100);

// Previne que a página seja recarregada acidentalmente perdendo o tempo
window.addEventListener('beforeunload', function(e) {
    if (stopwatchRunning || timerRunning) {
        e.preventDefault();
        e.returnValue = 'Você tem cronômetros rodando. Tem certeza que deseja sair?';
    }
});

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Espaço para iniciar/pausar cronômetro
    if (e.code === 'Space' && !e.target.matches('input')) {
        e.preventDefault();
        if (stopwatchRunning) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }
    
    // Enter para iniciar/pausar temporizador
    if (e.code === 'Enter' && !e.target.matches('input')) {
        e.preventDefault();
        if (timerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    // R para resetar ambos
    if (e.code === 'KeyR' && !e.target.matches('input')) {
        e.preventDefault();
        resetStopwatch();
        resetTimer();
    }
});

// Efeito de som (simulado com vibração em dispositivos móveis)
function playFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Adiciona feedback tátil aos botões
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', playFeedback);
});

// Efeito parallax suave no fundo
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        const x = mouseX * speed;
        const y = mouseY * speed;
        particle.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Console easter egg
console.log(`
⚡ TimeSync Pro ⚡

Atalhos de teclado:
• Espaço: Iniciar/Pausar Cronômetro
• Enter: Iniciar/Pausar Temporizador  
• R: Resetar ambos

Criado com ❤️ e muito CSS!
`); 