// --- AUDIO SYNTHESIZER FOR SOUND EFFECTS ---
class HackerSound {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playKeyBeep() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {
            // Audio error catch
        }
    }

    playAccessGranted() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [440, 554.37, 659.25, 880];
            notes.forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.12);
                
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime + index * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.12 + 0.3);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + index * 0.12);
                osc.stop(this.ctx.currentTime + index * 0.12 + 0.3);
            });
        } catch (e) {}
    }
}

const sounds = new HackerSound();

// --- MATRIX DIGITAL RAIN BACKDROP ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const chars = '0123456789ABCDEFXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ<>*+-@#$%=';
const fontSize = 16;
let columns = Math.floor(width / fontSize);
let drops = [];

function initDrops() {
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        // Stagger drops randomly so it looks like authentic movie Matrix rain
        drops[i] = Math.floor(Math.random() * -50);
    }
}
initDrops();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initDrops();
});

function drawMatrix() {
    // Semi-transparent fade background for trailing phosphor effect
    ctx.fillStyle = 'rgba(3, 10, 5, 0.09)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y >= 0) {
            // Bright white leading head character, matrix green trails
            ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : '#00ff66';
            ctx.fillText(char, x, y);
        }

        if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

// --- TERMINAL EXPLOIT CONTROLLER ---
const terminalOutput = document.getElementById('terminalOutput');
const currentCommand = document.getElementById('currentCommand');
const targetDisplay = document.getElementById('targetDisplay');
const targetNameInput = document.getElementById('targetNameInput');
const setTargetBtn = document.getElementById('setTargetBtn');
const soundToggle = document.getElementById('soundToggle');
const soundStatus = document.getElementById('soundStatus');

const accessModal = document.getElementById('accessModal');
const modalTarget = document.getElementById('modalTarget');
const closeModalBtn = document.getElementById('closeModalBtn');
const restartPrankBtn = document.getElementById('restartPrankBtn');

let activeTarget = "SECURE_SERVER_01";
let isHacking = false;
let autoTimer = null;

const logPool = [
    "Initiating TCP handshake on port 443...",
    "Scanning target open ports: 22, 80, 443, 8080...",
    "Bypassing Cloudflare DDoS Protection...",
    "Injecting SQL payload: ' OR '1'='1 --",
    "Cracking SHA-256 hash digests...",
    "Exploiting CVE-2024-8891 zero-day vulnerability...",
    "Establishing root SSH tunnel connection...",
    "Disabling intrusion detection loggers...",
    "Overriding admin authorization token...",
    "Extracting encrypted database schema...",
    "Downloading core server memory dump...",
    "Bypassing 2-Factor authentication protocol..."
];

function appendLog(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    sounds.playKeyBeep();
}

function updateCommandDisplay(cmd) {
    currentCommand.textContent = cmd;
}

function startHackingSequence(customSteps, finalGrantDelay = 4000) {
    if (isHacking) return;
    isHacking = true;

    let step = 0;
    const interval = setInterval(() => {
        if (step < customSteps.length) {
            appendLog(customSteps[step].text, customSteps[step].type || 'normal');
            updateCommandDisplay(`EXECUTING: ${customSteps[step].text.substring(0, 30)}...`);
            step++;
        } else {
            clearInterval(interval);
            updateCommandDisplay("PAYLOAD EXECUTED SUCCESSFULLY.");
            setTimeout(() => {
                showAccessGrantedModal();
                isHacking = false;
            }, 800);
        }
    }, 600);
}

function showAccessGrantedModal() {
    modalTarget.textContent = activeTarget;
    accessModal.classList.remove('hidden');
    sounds.playAccessGranted();
}

// Event Listeners
document.getElementById('btnHack').addEventListener('click', () => {
    startHackingSequence([
        { text: `Targeting domain: ${activeTarget}`, type: 'system' },
        { text: "Scanning firewall rules...", type: 'info' },
        { text: "Injecting memory buffer overflow...", type: 'warning' },
        { text: "Privilege escalation payload deployed!", type: 'success' },
        { text: "Decrypting admin security tokens...", type: 'info' },
        { text: "Root privileges acquired!", type: 'success' }
    ]);
});

document.getElementById('btnBypass').addEventListener('click', () => {
    startHackingSequence([
        { text: "Connecting to proxy chain [US -> DE -> JP]...", type: 'info' },
        { text: "Spoofing MAC address...", type: 'system' },
        { text: "Bypassing biometric firewall layer...", type: 'warning' },
        { text: "Firewall override: 100% complete", type: 'success' }
    ]);
});

document.getElementById('btnDump').addEventListener('click', () => {
    startHackingSequence([
        { text: `Querying database records for ${activeTarget}...`, type: 'info' },
        { text: "Dump initiated: tables user_passwords, api_keys, user_data", type: 'warning' },
        { text: "Exfiltrating 1.42 GB package...", type: 'system' },
        { text: "Data exfiltration complete!", type: 'success' }
    ]);
});

document.getElementById('btnInstantGrant').addEventListener('click', () => {
    appendLog("FORCE OVERRIDE COMMAND RECEIVED", "error");
    setTimeout(() => {
        showAccessGrantedModal();
    }, 400);
});

setTargetBtn.addEventListener('click', () => {
    const val = targetNameInput.value.trim();
    if (val) {
        activeTarget = val.toUpperCase();
        targetDisplay.textContent = `TARGET: ${activeTarget}`;
        appendLog(`Target re-assigned to: ${activeTarget}`, 'system');
        targetNameInput.value = '';
    }
});

soundToggle.addEventListener('click', () => {
    sounds.enabled = !sounds.enabled;
    soundStatus.textContent = `AUDIO: ${sounds.enabled ? 'ON' : 'OFF'}`;
    soundToggle.style.borderColor = sounds.enabled ? 'var(--text-green)' : 'var(--alert-red)';
});

closeModalBtn.addEventListener('click', () => {
    accessModal.classList.add('hidden');
    appendLog("Alert dismissed. Root terminal session running in background.", "info");
});

restartPrankBtn.addEventListener('click', () => {
    accessModal.classList.add('hidden');
    appendLog("REBOOTING EXPLOIT SUITE FOR NEXT TARGET...", "system");
    setTimeout(() => {
        startHackingSequence([
            { text: `Re-targeting: ${activeTarget}`, type: 'system' },
            { text: "Bypassing two-factor auth tokens...", type: 'warning' },
            { text: "Elevating local privileges to UID 0 (root)...", type: 'info' },
            { text: "All defense measures overridden!", type: 'success' }
        ]);
    }, 400);
});

// Movie Hacker Mode: Typing any key on the keyboard streams hacker logs and bleeps!
window.addEventListener('keydown', (e) => {
    // If typing in input, don't hijack
    if (document.activeElement === targetNameInput) return;
    
    // Resume audio context on interaction
    sounds.init();

    const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
    appendLog(`[KEY-INJECT] ${randomLog}`, 'warning');
    updateCommandDisplay(`OVERRIDE: ${randomLog.substring(0, 35)}...`);
});

// Auto show prank access granted after a few seconds on initial load (4.5s total)
autoTimer = setTimeout(() => {
    appendLog("CRITICAL: AUTOMATIC ROOT EXPLOIT TRIGGERED...", "warning");
    setTimeout(() => {
        showAccessGrantedModal();
    }, 1200);
}, 3200);
