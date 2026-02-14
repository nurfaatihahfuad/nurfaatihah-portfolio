/**
 * WINDOWS 98 / XP PORTFOLIO ENGINE
 * Full Update: Layering, Taskbar, and Mobile Touch Support
 */

// --- Global State ---
let highestZ = 100;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    setupInteractions();
    updateTaskbar(); // Initialize empty taskbar
});

// --- Window Management ---

/**
 * Opens a window and creates a taskbar presence
 */
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex'; 
    bringToFront(win);
    updateTaskbar();
}

/**
 * Hides a window and removes it from the taskbar
 */
function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        updateTaskbar();
    }
}

/**
 * Updates Z-index so the clicked window is always on top
 */
function bringToFront(win) {
    highestZ++;
    win.style.zIndex = highestZ;
    
    // Visual focus state
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');
    
    // Update taskbar to show which one is pressed
    updateTaskbar();
}

// --- Taskbar Logic ---

function updateTaskbar() {
    const taskContainer = document.getElementById('running-tasks');
    if (!taskContainer) return;
    
    taskContainer.innerHTML = ''; 

    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (win.style.display !== 'none' && win.style.display !== '') {
            const taskButton = document.createElement('button');
            taskButton.className = 'taskbar-item';
            
            // Get title from the header
            const title = win.querySelector('.header-title').innerText;
            taskButton.innerText = title;
            
            taskButton.onclick = () => bringToFront(win);
            
            if (win.classList.contains('active-window')) {
                taskButton.classList.add('pressed');
            }
            
            taskContainer.appendChild(taskButton);
        }
    });
}

// --- Interaction Logic (Mouse & Touch) ---

function setupInteractions() {
    document.querySelectorAll('.window-header').forEach(header => {
        
        // 1. MOUSE DRAGGING
        header.onmousedown = function(event) {
            if (event.target.closest('.window-controls')) return;

            const win = header.parentElement;
            bringToFront(win);

            let shiftX = event.clientX - win.getBoundingClientRect().left;
            let shiftY = event.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(e) { moveAt(e.pageX, e.pageY); }

            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        // 2. MOBILE TOUCH DRAGGING
        header.ontouchstart = function(event) {
            if (event.target.closest('.window-controls')) return;

            const win = header.parentElement;
            bringToFront(win);

            let touch = event.touches[0];
            let shiftX = touch.clientX - win.getBoundingClientRect().left;
            let shiftY = touch.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onTouchMove(e) {
                // Prevent scrolling the background while dragging
                if (e.cancelable) e.preventDefault(); 
                moveAt(e.touches[0].pageX, e.touches[0].pageY);
            }

            document.addEventListener('touchmove', onTouchMove, { passive: false });
            
            header.ontouchend = function() {
                document.removeEventListener('touchmove', onTouchMove);
                header.ontouchend = null;
            };
        };

        header.ondragstart = () => false;
    });
}

// --- Utilities ---

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if(menu) {
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
    }
                }
