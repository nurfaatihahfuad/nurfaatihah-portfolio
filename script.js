let highestZ = 100;

function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'flex';
    bringToFront(win);
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
    updateTaskbar();
}

function bringToFront(win) {
    highestZ++;
    win.style.zIndex = highestZ;
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');
    updateTaskbar();
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function updateTaskbar() {
    const container = document.getElementById('running-tasks');
    container.innerHTML = '';
    document.querySelectorAll('.window').forEach(win => {
        if (win.style.display === 'flex' && win.id !== 'start-menu') {
            const btn = document.createElement('button');
            btn.className = 'taskbar-item';
            if (win.classList.contains('active-window')) btn.classList.add('pressed');
            btn.innerText = win.querySelector('.header-title').innerText;
            btn.onclick = () => bringToFront(win);
            container.appendChild(btn);
        }
    });
}

function setupDraggables() {
    document.querySelectorAll('.window-header').forEach(header => {
        const win = header.parentElement;

        const startMove = (e) => {
            bringToFront(win);
            let clientX = e.clientX || e.touches[0].clientX;
            let clientY = e.clientY || e.touches[0].clientY;
            let shiftX = clientX - win.getBoundingClientRect().left;
            let shiftY = clientY - win.getBoundingClientRect().top;

            const onMove = (moveEvent) => {
                let moveX = moveEvent.clientX || moveEvent.touches[0].clientX;
                let moveY = moveEvent.clientY || moveEvent.touches[0].clientY;
                win.style.left = moveX - shiftX + 'px';
                win.style.top = moveY - shiftY + 'px';
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, {passive: false});

            const onEnd = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('touchmove', onMove);
            };

            document.onmouseup = onEnd;
            document.ontouchend = onEnd;
        };

        header.onmousedown = startMove;
        header.ontouchstart = startMove;
    });
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

document.addEventListener('DOMContentLoaded', () => {
    setupDraggables();
    setInterval(updateClock, 1000);
    updateClock();
});
// Paint Logic
const canvas = document.getElementById('paintCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        // Support for both Mouse and Touch
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
}

function clearCanvas() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
