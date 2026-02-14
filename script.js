/**
 * WINDOWS 98 / XP PORTFOLIO ENGINE
 */

// --- Global State ---
let highestZ = 100;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    setupDraggables();
});

// --- Window Management ---

/**
 * Opens a window and creates a taskbar presence
 * @param {string} id - The HTML ID of the window to show
 */
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex'; // Use flex to maintain internal UI structure
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
 * Layering Logic: Updates Z-index so the clicked window is always on top
 */
function bringToFront(win) {
    highestZ++;
    win.style.zIndex = highestZ;
    
    // Visual focus state: highlight the title bar of the active window
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');
}

// --- Taskbar & Start Menu ---

/**
 * Start Menu Toggle
 */
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
}

/**
 * Dynamic Taskbar: Lists all currently open windows
 */
function updateTaskbar() {
    const taskContainer = document.getElementById('running-tasks');
    if (!taskContainer) return;
    
    taskContainer.innerHTML = ''; // Refresh the list

    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (win.style.display !== 'none') {
            const taskButton = document.createElement('button');
            taskButton.className = 'taskbar-item';
            
            // Extract the title text from the window's header
            const title = win.querySelector('.header-title').innerText;
            taskButton.innerText = title;
            
            // Interaction: Clicking taskbar item brings that window to front
            taskButton.onclick = () => bringToFront(win);
            
            // If window is the active one, style the taskbar button as "pressed"
            if (win.classList.contains('active-window')) {
                taskButton.classList.add('pressed');
            }
            
            taskContainer.appendChild(taskButton);
        }
    });
}

// --- Dragging Logic ---

function setupDraggables() {
    document.querySelectorAll('.window-header').forEach(header => {
        header.onmousedown = function(event) {
            // Don't drag if clicking buttons (X, _, etc)
            if (event.target.closest('.window-controls')) return;

            const win = header.parentElement;
            bringToFront(win);

            // Calculate offset so cursor stays in the same spot on the header
            let shiftX = event.clientX - win.getBoundingClientRect().left;
            let shiftY = event.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            // Bind to document to prevent losing window when dragging fast
            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        header.ondragstart = () => false; // Disable native browser dragging
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
