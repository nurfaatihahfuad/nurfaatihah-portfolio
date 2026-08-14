// ==========================================
// WINDOWS 95 PORTFOLIO - JAVASCRIPT
// ==========================================

// Global Variables
let activeWindow = null;
let zIndexCounter = 100;
let isDragging = false;
let initialX = 0;
let initialY = 0;

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

        // Double click / tap to open window
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const windowId = icon.getAttribute('data-window');
            if (windowId) openWindow(windowId);
        });
    });

    // Deselect icons when clicking desktop background
    const desktop = document.querySelector('.desktop');
    if (desktop) {
        desktop.addEventListener('click', deselectAllIcons);
    }
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
        const titleBar = win.querySelector('.title-bar');
        if (titleBar) {
            // Mouse & Touch events for dragging
            titleBar.addEventListener('mousedown', startDragging);
            titleBar.addEventListener('touchstart', startDragging, { passive: false });
        }

        // Window control buttons
        const minimizeBtn = win.querySelector('.minimize-btn');
        const maximizeBtn = win.querySelector('.maximize-btn');
        const closeBtn = win.querySelector('.close-btn');

        if (minimizeBtn) minimizeBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(win); });
        if (maximizeBtn) maximizeBtn.addEventListener('click', (e) => { e.stopPropagation(); maximizeWindow(win); });
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win); });

        // Bring window to front on click/tap
        win.addEventListener('mousedown', () => bringToFront(win));
        win.addEventListener('touchstart', () => bringToFront(win), { passive: true });
    });

    // Global drag tracking
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

function isWindowVisible(win) {
    return window.getComputedStyle(win).display !== 'none';
}

function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains('minimized')) {
        win.classList.remove('minimized');
        win.style.display = 'flex';
    } else if (isWindowVisible(win)) {
        bringToFront(win);
        return;
    } else {
        win.style.display = 'flex';
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

    if (activeWindow === win) {
        activeWindow = null;
        const visibleWindows = Array.from(document.querySelectorAll('.window')).filter(w => isWindowVisible(w) && !w.classList.contains('minimized'));
        if (visibleWindows.length > 0) {
            bringToFront(visibleWindows[visibleWindows.length - 1]);
        }
    }
}

function minimizeWindow(win) {
    win.classList.add('minimized');
    win.classList.remove('active');

    if (activeWindow === win) {
        activeWindow = null;
        const visibleWindows = Array.from(document.querySelectorAll('.window')).filter(w => isWindowVisible(w) && !w.classList.contains('minimized'));
        if (visibleWindows.length > 0) {
            bringToFront(visibleWindows[visibleWindows.length - 1]);
        }
    }

    updateTaskbar();
}

function maximizeWindow(win) {
    if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.dataset.maximized = 'false';
    } else {
        win.dataset.prevWidth = win.style.width || win.offsetWidth + 'px';
        win.dataset.prevHeight = win.style.height || win.offsetHeight + 'px';
        win.dataset.prevLeft = win.style.left || win.offsetLeft + 'px';
        win.dataset.prevTop = win.style.top || win.offsetTop + 'px';

        win.style.width = 'calc(100vw - 10px)';
        win.style.height = 'calc(100vh - 38px)';
        win.style.left = '5px';
        win.style.top = '5px';
        win.dataset.maximized = 'true';
    }
}

function centerWindow(win) {
    const winWidth = win.offsetWidth || 400;
    const winHeight = win.offsetHeight || 300;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 28;

    win.style.left = Math.max(10, (screenWidth - winWidth) / 2) + 'px';
    win.style.top = Math.max(10, (screenHeight - winHeight) / 2) + 'px';
}

function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));

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
    if (!win || win.dataset.maximized === 'true') return;

    isDragging = true;
    activeWindow = win;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = win.getBoundingClientRect();
    initialX = clientX - rect.left;
    initialY = clientY - rect.top;

    bringToFront(win);
}

function drag(e) {
    if (!isDragging || !activeWindow) return;

    if (e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let newX = clientX - initialX;
    let newY = clientY - initialY;

    const winWidth = activeWindow.offsetWidth;
    const winHeight = activeWindow.offsetHeight;
    const maxX = window.innerWidth - winWidth;
    const maxY = window.innerHeight - 28 - winHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    activeWindow.style.left = newX + 'px';
    activeWindow.style.top = newY + 'px';
}

function stopDragging() {
    isDragging = false;
}

// ==========================================
// TASKBAR & START MENU
// ==========================================
function initializeTaskbar() {
    updateTaskbar();
}

function updateTaskbar() {
    const taskbarItems = document.getElementById('taskbar-items');
    if (!taskbarItems) return;

    taskbarItems.innerHTML = '';

    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (isWindowVisible(win)) {
            const titleElement = win.querySelector('.title-bar-text');
            const titleText = titleElement ? titleElement.textContent : win.id;

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

function initializeStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startButton || !startMenu) return;

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            closeStartMenu();
        }
    });
}

function toggleStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startMenu || !startButton) return;

    startMenu.classList.toggle('active');
    startButton.classList.toggle('active');
}

function closeStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (startMenu) startMenu.classList.remove('active');
    if (startButton) startButton.classList.remove('active');
}

function openAllWindows() {
    const windows = document.querySelectorAll('.window');
    let delay = 0;

    windows.forEach(win => {
        setTimeout(() => openWindow(win.id), delay);
        delay += 150;
    });

    closeStartMenu();
}

function closeAllWindows() {
    document.querySelectorAll('.window').forEach(win => closeWindow(win));
    closeStartMenu();
}

// ==========================================
// SYSTEM CLOCK & UTILITIES
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || 'Friend';

    alert(`Thanks for reaching out, ${name}! Message received.`);
    e.target.reset();
}

// Prevent text selection while dragging windows
document.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
});

// Viewport resize handling
window.addEventListener('resize', () => {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (isWindowVisible(win)) {
            const rect = win.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                win.style.left = Math.max(0, window.innerWidth - win.offsetWidth - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight - 28) {
                win.style.top = Math.max(0, window.innerHeight - 28 - win.offsetHeight - 10) + 'px';
            }
        }
    });
});

// Global exports
window.handleContactSubmit = handleContactSubmit;
window.openAllWindows = openAllWindows;
window.closeAllWindows = closeAllWindows;

// ==========================================
// CONTACT FORM (AJAX SUBMIT VIA FORMSPREE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // stop default redirect to Formspree thank-you page

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                showFormPopup('success');
                contactForm.reset();
            } else {
                showFormPopup('error');
            }
        })
        .catch(() => {
            showFormPopup('error');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    });
});

function showFormPopup(type) {
    const existingPopup = document.getElementById('form-popup');
    if (existingPopup) existingPopup.remove();

    const isSuccess = type === 'success';

    const popup = document.createElement('div');
    popup.id = 'form-popup';
    popup.className = 'window active';
    popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; min-width: 300px; min-height: auto; z-index: 2000; display: flex;';

    popup.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">${isSuccess ? 'Message Sent' : 'Error'}</div>
            <div class="title-bar-controls">
                <button class="popup-close-btn">×</button>
            </div>
        </div>
        <div class="window-body" style="text-align: center; padding: 20px;">
            <p style="font-size: 32px; margin-bottom: 10px;">${isSuccess ? '✅' : '⚠️'}</p>
            <p style="margin-bottom: 15px;">
                ${isSuccess
                    ? 'Thank you! Your message has been sent successfully.'
                    : 'Oops! Something went wrong. Please try again later.'}
            </p>
            <button class="win95-button popup-ok-btn">OK</button>
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.popup-close-btn');
    const okBtn = popup.querySelector('.popup-ok-btn');
    const removePopup = () => popup.remove();

    if (closeBtn) closeBtn.addEventListener('click', removePopup);
    if (okBtn) okBtn.addEventListener('click', removePopup);

    popup.style.zIndex = ++zIndexCounter;
}
