// Simple Window Management
function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'block';
    win.style.zIndex = Math.floor(Date.now() / 1000); // Bring to front
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

// Basic Dragging Logic
document.querySelectorAll('.window-header').forEach(header => {
    header.onmousedown = function(event) {
        let win = header.parentElement;
        let shiftX = event.clientX - win.getBoundingClientRect().left;
        let shiftY = event.clientY - win.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            win.style.left = pageX - shiftX + 'px';
            win.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        header.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            header.onmouseup = null;
        };
    };
});

// Update Clock
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 1000);
