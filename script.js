// ==========================================
// WINDOWS 95 PORTFOLIO - JAVASCRIPT
// ==========================================

// Global Variables
let activeWindow = null;
let zIndexCounter = 100;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeIcons();
    initializeWindows();
    initializeTaskbar();
    initializeStartMenu();
    updateClock();
    initializeFunStuff();
    
    // Update clock every second
    setInterval(updateClock, 1000);
});

// ==========================================
// DESKTOP ICONS
// ==========================================
function initializeIcons() {
    const icons = document.querySelectorAll('.icon');
    
    icons.forEach(icon => {
        // Single click to select
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            selectIcon(icon);
        });
        
        // Double click to open window
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
        });
    });
    
    // Deselect icons when clicking desktop
    document.querySelector('.desktop').addEventListener('click', () => {
        deselectAllIcons();
    });
}

function selectIcon(icon) {
    deselectAllIcons();
    icon.classList.add('selected');
}

function deselectAllIcons() {
    document.querySelectorAll('.icon').forEach(icon => {
        icon.classList.remove('selected');
    });
}

// ==========================================
// WINDOW MANAGEMENT
// ==========================================
function initializeWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(win => {
        // Make window draggable by title bar
        const titleBar = win.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', startDragging);
        
        // Window control buttons
        const minimizeBtn = win.querySelector('.minimize-btn');
        const maximizeBtn = win.querySelector('.maximize-btn');
        const closeBtn = win.querySelector('.close-btn');
        
        minimizeBtn.addEventListener('click', () => minimizeWindow(win));
        maximizeBtn.addEventListener('click', () => maximizeWindow(win));
        closeBtn.addEventListener('click', () => closeWindow(win));
        
        // Bring window to front when clicked
        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
    });
    
    // Global mouse events for dragging
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function openWindow(windowId) {
    const win = document.getElementById(windowId);
    
    if (win.classList.contains('minimized')) {
        // Restore from minimized state
        win.classList.remove('minimized');
        win.style.display = 'flex';
    } else if (win.style.display === 'flex') {
        // Window already open, just bring to front
        bringToFront(win);
        return;
    } else {
        // Open new window
        win.style.display = 'flex';
        
        // Center window on first open
        if (!win.dataset.positioned) {
            centerWindow(win);
            win.dataset.positioned = 'true';
        }
    }
    
    bringToFront(win);
    updateTaskbar();
}

function closeWindow(win) {
    win.style.display = 'none';
    win.classList.remove('active', 'minimized');
    updateTaskbar();
    
    // If this was the active window, set another window as active
    if (activeWindow === win) {
        activeWindow = null;
        const openWindows = document.querySelectorAll('.window[style*="display: flex"]');
        if (openWindows.length > 0) {
            bringToFront(openWindows[openWindows.length - 1]);
        }
    }
}

function minimizeWindow(win) {
    win.classList.add('minimized');
    win.classList.remove('active');
    
    if (activeWindow === win) {
        activeWindow = null;
        const openWindows = document.querySelectorAll('.window[style*="display: flex"]:not(.minimized)');
        if (openWindows.length > 0) {
            bringToFront(openWindows[openWindows.length - 1]);
        }
    }
    
    updateTaskbar();
}

function maximizeWindow(win) {
    if (win.dataset.maximized === 'true') {
        // Restore previous size and position
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.dataset.maximized = 'false';
    } else {
        // Save current size and position
        win.dataset.prevWidth = win.style.width || win.offsetWidth + 'px';
        win.dataset.prevHeight = win.style.height || win.offsetHeight + 'px';
        win.dataset.prevLeft = win.style.left || '0px';
        win.dataset.prevTop = win.style.top || '0px';
        
        // Maximize
        win.style.width = 'calc(100vw - 20px)';
        win.style.height = 'calc(100vh - 48px)';
        win.style.left = '10px';
        win.style.top = '10px';
        win.dataset.maximized = 'true';
    }
}

function centerWindow(win) {
    const winWidth = win.offsetWidth;
    const winHeight = win.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 28; // Subtract taskbar height
    
    win.style.left = Math.max(10, (screenWidth - winWidth) / 2) + 'px';
    win.style.top = Math.max(10, (screenHeight - winHeight) / 2) + 'px';
}

function bringToFront(win) {
    // Remove active class from all windows
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });
    
    // Set this window as active
    win.classList.add('active');
    win.style.zIndex = ++zIndexCounter;
    activeWindow = win;
    
    updateTaskbar();
}

// ==========================================
// WINDOW DRAGGING
// ==========================================
function startDragging(e) {
    if (e.target.closest('.title-bar-controls')) return;
    
    const win = e.target.closest('.window');
    if (win.dataset.maximized === 'true') return;
    
    isDragging = true;
    activeWindow = win;
    
    const rect = win.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    bringToFront(win);
}

function drag(e) {
    if (!isDragging || !activeWindow) return;
    
    e.preventDefault();
    
    let newX = e.clientX - initialX;
    let newY = e.clientY - initialY;
    
    // Keep window within viewport
    const winWidth = activeWindow.offsetWidth;
    const winHeight = activeWindow.offsetHeight;
    const maxX = window.innerWidth - winWidth;
    const maxY = window.innerHeight - 28 - winHeight; // Subtract taskbar
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    activeWindow.style.left = newX + 'px';
    activeWindow.style.top = newY + 'px';
}

function stopDragging() {
    isDragging = false;
}

// ==========================================
// TASKBAR
// ==========================================
function initializeTaskbar() {
    updateTaskbar();
}

function updateTaskbar() {
    const taskbarItems = document.getElementById('taskbar-items');
    taskbarItems.innerHTML = '';
    
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (win.style.display === 'flex') {
            const titleText = win.querySelector('.title-bar-text').textContent;
            const taskbarItem = document.createElement('div');
            taskbarItem.className = 'taskbar-item';
            taskbarItem.textContent = titleText;
            
            if (win.classList.contains('active') && !win.classList.contains('minimized')) {
                taskbarItem.classList.add('active');
            }
            
            taskbarItem.addEventListener('click', () => {
                if (win.classList.contains('minimized')) {
                    win.classList.remove('minimized');
                    bringToFront(win);
                } else if (win.classList.contains('active')) {
                    minimizeWindow(win);
                } else {
                    bringToFront(win);
                }
            });
            
            taskbarItems.appendChild(taskbarItem);
        }
    });
}

// ==========================================
// START MENU
// ==========================================
function initializeStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            closeStartMenu();
        }
    });
}

function toggleStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    if (startMenu.classList.contains('active')) {
        closeStartMenu();
    } else {
        startMenu.classList.add('active');
        startButton.classList.add('active');
    }
}

function closeStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.remove('active');
    startButton.classList.remove('active');
}

function openAllWindows() {
    const windows = document.querySelectorAll('.window');
    let delay = 0;
    
    windows.forEach(win => {
        setTimeout(() => {
            openWindow(win.id);
        }, delay);
        delay += 150;
    });
    
    closeStartMenu();
}

function closeAllWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        closeWindow(win);
    });
    closeStartMenu();
}

// ==========================================
// CLOCK
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

// ==========================================
// CONTACT FORM
// ==========================================
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // In a real application, you would send this data to a server
    alert(`Thanks for reaching out, ${name}! This is a demo form. In production, your message would be sent to the server.`);
    
    e.target.reset();
}

// ==========================================
// FUN STUFF
// ==========================================
function initializeFunStuff() {
    // Initialize game
    let score = 0;
    const gameButton = document.getElementById('game-button');
    const scoreDisplay = document.getElementById('game-score');
    
    if (gameButton) {
        gameButton.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
            
            // Move button to random position
            const maxX = gameButton.parentElement.offsetWidth - gameButton.offsetWidth;
            const maxY = gameButton.parentElement.offsetHeight - gameButton.offsetHeight;
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            
            gameButton.style.position = 'relative';
            gameButton.style.left = (randomX - maxX / 2) + 'px';
            gameButton.style.top = (randomY - maxY / 2) + 'px';
            
            // Change color
            const colors = ['#008080', '#800080', '#008000', '#800000', '#000080'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            gameButton.style.background = randomColor;
            gameButton.style.color = '#ffffff';
        });
    }
    
    // Initialize matrix effect
    startMatrixEffect();
}

function startMatrixEffect() {
    const matrixElement = document.getElementById('matrix');
    if (!matrixElement) return;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    let matrixText = '';
    
    setInterval(() => {
        matrixText = '';
        for (let i = 0; i < 200; i++) {
            matrixText += chars.charAt(Math.floor(Math.random() * chars.length));
            if (i % 40 === 39) matrixText += '\n';
        }
        matrixElement.textContent = matrixText;
    }, 100);
}

// Sound Functions (Placeholders)
function playStartupSound() {
    // In a real implementation, you would play an actual sound file
    alert('🔊 *Windows 95 startup sound plays* 🎵');
}

function playErrorSound() {
    // In a real implementation, you would play an actual sound file
    alert('⚠️ *Windows error sound plays* 🔔');
}

// Quote Generator
const techQuotes = [
    '"Any sufficiently advanced technology is indistinguishable from magic." - Arthur C. Clarke',
    '"The best way to predict the future is to invent it." - Alan Kay',
    '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
    '"First, solve the problem. Then, write the code." - John Johnson',
    '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
    '"In order to be irreplaceable, one must always be different." - Coco Chanel',
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Creativity is intelligence having fun." - Albert Einstein',
    '"Design is not just what it looks like. Design is how it works." - Steve Jobs',
    '"Simplicity is the ultimate sophistication." - Leonardo da Vinci'
];

function generateQuote() {
    const quoteElement = document.getElementById('tech-quote');
    const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
    
    // Typing effect
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.textContent = randomQuote;
        quoteElement.style.opacity = '1';
    }, 200);
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    // Ctrl + Alt + Delete (Easter Egg)
    if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault();
        alert('😄 Nice try! But this is just a portfolio website, not a real Windows 95 system!');
    }
    
    // Windows Key (open start menu)
    if (e.key === 'Meta' || e.key === 'Win') {
        e.preventDefault();
        toggleStartMenu();
    }
    
    // Escape (close active window or start menu)
    if (e.key === 'Escape') {
        if (document.getElementById('start-menu').classList.contains('active')) {
            closeStartMenu();
        } else if (activeWindow) {
            closeWindow(activeWindow);
        }
    }
});

// ==========================================
// WELCOME MESSAGE
// ==========================================
window.addEventListener('load', () => {
    // Show welcome message after page loads
    setTimeout(() => {
        // You can customize this to show a welcome dialog
        console.log('🎮 Welcome to the Windows 95 Portfolio! 🎨');
        console.log('💡 Tip: Double-click desktop icons to open windows!');
    }, 500);
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Prevent text selection while dragging
document.addEventListener('selectstart', (e) => {
    if (isDragging) {
        e.preventDefault();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reposition windows if they're outside viewport
    const windows = document.querySelectorAll('.window[style*="display: flex"]');
    windows.forEach(win => {
        const rect = win.getBoundingClientRect();
        
        if (rect.right > window.innerWidth) {
            win.style.left = (window.innerWidth - win.offsetWidth - 10) + 'px';
        }
        if (rect.bottom > window.innerHeight - 28) {
            win.style.top = (window.innerHeight - 28 - win.offsetHeight - 10) + 'px';
        }
    });
});

// Export functions for inline event handlers
window.handleContactSubmit = handleContactSubmit;
window.playStartupSound = playStartupSound;
window.playErrorSound = playErrorSound;
window.generateQuote = generateQuote;
window.openAllWindows = openAllWindows;
window.closeAllWindows = closeAllWindows;
