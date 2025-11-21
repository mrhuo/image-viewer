# ImageViewer.js

A modern, lightweight, and customizable image previewer Web Component.

**Version: 1.0.0**

[中文文档](README.zh-cn.md)

## ✨ Features

- **Zero dependencies** - Pure vanilla JavaScript, no external libraries required
- **Web Components implementation** - Built with modern Web Components standard
- **Strong compatibility** - Works across all modern browsers
- **Mouse wheel zooming** - Smooth zoom in/out with mouse wheel
- **Drag to pan** - Drag images when zoomed in for better viewing
- **Image rotation** - Rotate images 90° clockwise with each click
- **Download support** - Download original images with one click
- **Multi-image navigation** - Navigate between multiple images with prev/next buttons
- **Image captions** - Display image captions from `alt` attribute
- **Keyboard shortcuts** - ESC to close, Arrow keys for navigation
- **High-resolution loading** - Progressive loading from low-res to high-res images
- **Responsive design** - Works perfectly on all screen sizes
- **Customizable** - Highly configurable via JavaScript options

## 🚀 Quick Start

### Method 1: Auto-initialization (Recommended)

Add the script to your HTML:

```html
<script src="path/to/image-viewer.js"></script>
```

The component will automatically initialize and work with all `<img>` elements on the page.

### Method 2: Manual initialization

```html
<script type="module">
  import ImageViewer from './src/image-viewer.js';
  
  const viewer = new ImageViewer({
    targetSelector: 'img',
    maxScale: 5,
    minScale: 0.5,
    allowRotate: true,
    allowDownload: true
  });
  
  document.body.appendChild(viewer);
</script>
```

### Method 3: HTML configuration

```html
<script id="gd-image-viewer" 
        src="path/to/image-viewer.js"
        data-target-selector=".gallery-img"
        data-max-scale="8"
        data-min-scale="0.3"
        data-allow-rotate="false"
        data-allow-download="true">
</script>
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetSelector` | string | `'img'` | CSS selector for images that trigger the viewer |
| `maxScale` | number | `5` | Maximum zoom scale factor |
| `minScale` | number | `0.5` | Minimum zoom scale factor |
| `allowRotate` | boolean | `true` | Enable/disable image rotation |
| `allowDownload` | boolean | `true` | Enable/disable image download |

## 📖 API Reference

### Constructor

```javascript
const viewer = new ImageViewer(options);
```

### Methods

- `showImageByIndex(index)` - Display image by index
- `showNextImage()` - Show next image
- `showPrevImage()` - Show previous image
- `closePreview()` - Close the viewer
- `rotateImage()` - Rotate current image
- `downloadImage()` - Download current image
- `resetTransform()` - Reset zoom, rotation, and position

### Properties

- `currentIndex` - Current image index
- `currentScale` - Current zoom scale
- `currentRotation` - Current rotation angle
- `imageList` - Array of target images

## 🔧 Advanced Usage

### High-resolution Image Loading

Use `data-highres` attribute for progressive loading:

```html
<img src="thumbnail.jpg" data-highres="high-resolution.jpg" alt="Image description">
```

### Custom Image Selection

Target specific images:

```javascript
const viewer = new ImageViewer({
  targetSelector: '.gallery-image, .photo-preview'
});
```

### Dynamic Image Updates

The component automatically tracks DOM changes and handles dynamically added images.

## 🎯 Browser Support

- Chrome 61+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## 📦 Installation

### Direct Download

Download `image-viewer.js` from the releases page and include it in your project.

### NPM (Coming Soon)

```bash
TODO
```

### CDN (Coming Soon)

```html
TODO
```

## 🛠️ Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Build

```bash
# Minify for production
npm run build
```

This will create a minified version in `dist/image-viewer.min.js` with ~56% size reduction (including CSS optimization).

### Development Server

```bash
# Start local server for testing
npm run dev
```

### Demo

Open `demo.html` in your browser to see all features in action.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Demo](demo.html)
- [中文文档](README.zh-cn.md)
- [Issues](https://github.com/mrhuo/image-viewer/issues)
- [Releases](https://github.com/mrhuo/image-viewer/releases)

---

Made with ❤️ for the web development community.
