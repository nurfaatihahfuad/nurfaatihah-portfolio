# 🖥️ Windows 95 Portfolio Website

A nostalgic portfolio website that combines **IT/Technology** and **Art/Creative Work** with a retro Windows 95/98 desktop aesthetic. This project features draggable windows, desktop icons, a functional taskbar, and authentic retro styling.

![Windows 95 Portfolio](screenshot-placeholder.png)

## ✨ Features

### 🎨 Authentic Windows 95 Aesthetics
- **Desktop Environment**: Classic Windows 95 desktop with teal background
- **Draggable Windows**: Fully functional windows with minimize, maximize, and close buttons
- **Taskbar**: Working taskbar with Start button, active window tracking, and system tray
- **Start Menu**: Functional start menu with options
- **Desktop Icons**: Double-click to open, single-click to select
- **Retro UI Elements**: Pixel-perfect Windows 95 styling with authentic borders, buttons, and fonts

### 📂 Portfolio Sections

1. **About Me** 👤
   - Personal introduction
   - Education background
   - Skills with animated progress bars
   - Interests in IT and Art

2. **Projects** 💻
   - Programming projects showcase
   - GitHub links
   - Project descriptions and tags
   - Technology stack display

3. **Art Gallery** 🎨
   - Digital art showcase
   - UI/UX designs
   - Pixel art
   - Interactive gallery grid

4. **Resume** 📄
   - Downloadable CV button
   - Work experience timeline
   - Technical skills breakdown
   - Education history

5. **Contact** 📧
   - Email and social media links
   - Contact form (frontend demo)
   - GitHub, LinkedIn, Twitter links

6. **Fun Stuff** 🎮
   - Mini click game
   - Retro sound effects
   - Matrix effect animation
   - Tech quote generator

### 🎯 Interactive Features
- **Window Management**: Drag, minimize, maximize, and close windows
- **Taskbar Integration**: Click taskbar items to restore or minimize windows
- **Start Menu**: Quick access to all sections and site controls
- **Keyboard Shortcuts**: 
  - `Escape`: Close active window or start menu
  - `Ctrl+Alt+Delete`: Easter egg surprise
- **Real-time Clock**: Working system tray clock
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Window opening/closing animations

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and markup
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and custom animations
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript for all interactivity
- **SVG**: Custom desktop icons
- **Web APIs**: Date/Time API for clock

## 📦 Installation

### Option 1: Download and Run Locally

1. **Download the files**
   ```bash
   # Clone or download this repository
   git clone https://github.com/yourusername/windows95-portfolio.git
   cd windows95-portfolio
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # No build process required!
   ```

### Option 2: Use a Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Then open http://localhost:8000 in your browser
```

### Option 3: Deploy to Web

Upload the following files to any web hosting service:
- `index.html`
- `style.css`
- `script.js`

Compatible with:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 🎨 Customization Guide

### Update Personal Information

#### 1. About Me Section
Edit `index.html` around line 55:
```html
<h2>Hi, I'm [Your Name] 👋</h2>
<p>Your bio here...</p>
```

#### 2. Projects Section
Edit `index.html` around line 120:
```html
<div class="project-card">
    <div class="project-icon">🎮</div>
    <h3>Your Project Name</h3>
    <p>Project description</p>
    <div class="project-tags">
        <span class="tag">Technology</span>
    </div>
    <a href="your-github-link" target="_blank" class="win95-button">View on GitHub</a>
</div>
```

#### 3. Art Gallery
Replace placeholder gradients with your images in `index.html` around line 180:
```html
<div class="art-placeholder" style="background: url('your-image.jpg'); background-size: cover;">
    <span>Your Art Title</span>
</div>
```

#### 4. Resume Section
Update experience and skills in `index.html` around line 230

#### 5. Contact Information
Update links in `index.html` around line 290:
```html
<a href="mailto:your.email@example.com" class="contact-link">
    <span>your.email@example.com</span>
</a>
```

### Customize Colors

Edit `style.css` CSS variables at the top:
```css
:root {
    --desktop-bg: #008080;  /* Desktop background color */
    --win95-blue: #000080;  /* Window title bar color */
    --win95-gray: #c0c0c0;  /* Window and UI gray */
}
```

### Modify Desktop Icons

To add new icons, edit the `desktop-icons` section in `index.html` and add corresponding window HTML.

### Add Custom Windows

1. Create a new icon in the desktop-icons section
2. Add a new window div with matching ID
3. Windows will automatically integrate with taskbar

## 📱 Responsive Design

The portfolio is optimized for:
- ✅ Desktop (1920x1080 and above)
- ✅ Laptop (1366x768)
- ✅ Tablet (768px)
- ✅ Mobile (480px)

Windows automatically adjust size and position on smaller screens.

## 🎯 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ IE11 (Limited support)

## 🔧 Advanced Customization

### Add Sound Effects

Replace placeholder alert functions in `script.js`:
```javascript
function playStartupSound() {
    const audio = new Audio('sounds/startup.mp3');
    audio.play();
}
```

### Connect Contact Form

Replace the demo submit handler in `script.js` with real form submission:
```javascript
function handleContactSubmit(e) {
    e.preventDefault();
    // Add your form handling logic here
    // Example: Send to FormSpree, EmailJS, or your backend
}
```

### Add More Windows

1. Create HTML structure for new window
2. Add desktop icon with matching `data-window` attribute
3. JavaScript automatically handles window management

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](screenshots/desktop.png)

### Multiple Windows
![Windows Screenshot](screenshots/windows.png)

### Mobile View
![Mobile Screenshot](screenshots/mobile.png)

*Replace these placeholder paths with actual screenshots*

## 🎓 Learning Resources

This project demonstrates:
- **DOM Manipulation**: Dynamic window management
- **Event Handling**: Click, drag, keyboard events
- **CSS Grid & Flexbox**: Responsive layouts
- **CSS Animations**: Window transitions
- **ES6+ JavaScript**: Modern JS practices
- **UI/UX Design**: Retro interface recreation

## 🤝 Contributing

Found a bug or want to contribute?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 TODO / Future Enhancements

- [ ] Add actual sound effects
- [ ] Implement more mini-games
- [ ] Add window resizing functionality
- [ ] Create more retro animations
- [ ] Add "My Computer" and "Recycle Bin" icons
- [ ] Implement right-click context menus
- [ ] Add file explorer functionality
- [ ] Create Minesweeper clone
- [ ] Add screen saver feature

## 💡 Inspiration

This project was inspired by:
- Windows 95/98 operating system UI
- Retro computing aesthetics
- 1990s web design
- Nostalgia for classic desktop interfaces

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Credits

- **Developer**: nurfaatihahfuad @ github
- **Design Inspiration**: Windows 95/98 UI
- **Icons**: Custom SVG icons
- **Fonts**: System fonts (MS Sans Serif style)

## 📞 Support

If you have questions or need help:
- 📧 Email: your.email@example.com
- 💻 GitHub: [@yourusername](https://github.com/yourusername)
- 💼 LinkedIn: [Your Profile](https://linkedin.com/in/yourusername)

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ and nostalgia for the 90s**

*Remember: It's not a bug, it's a feature! (Just like in Windows 95)*
