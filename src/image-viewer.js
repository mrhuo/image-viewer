/*!
 * ImageViewer.js - A modern, lightweight, and customizable image previewer Web Component.
 *
 * @version 1.0.0
 * @author mrhuo
 * @license MIT
 * @link https://github.com/mrhuo/image-viewer
 *
 * Features:
 * - Mouse wheel for zooming.
 * - Drag to pan when zoomed in.
 * - Rotate images.
 * - Download original images.
 * - Navigate between multiple images.
 * - Display image captions (from `alt` attribute).
 * - Close by pressing ESC or clicking the close button.
 * - Highly configurable via JavaScript options.
 */

/**
 * A customizable image preview Web Component.
 *
 * @element image-viewer
 * @property {Object} config - The component configuration object.
 * @property {string} config.targetSelector - CSS selector for images that trigger the viewer. Default: 'img'.
 * @property {number} config.maxScale - Maximum zoom scale. Default: 5.
 * @property {number} config.minScale - Minimum zoom scale. Default: 0.5.
 * @property {boolean} config.allowRotate - Enable/disable rotation. Default: true.
 * @property {boolean} config.allowDownload - Enable/disable download. Default: true.
 * @property {HTMLElement[]} imageList - Cache of all images matching the target selector.
 * @property {number} currentIndex - Index of the currently displayed image in `imageList`.
 * @property {number} currentScale - Current zoom scale of the image.
 * @property {number} currentRotation - Current rotation angle of the image (in degrees).
 * @property {boolean} isDragging - Flag indicating if the user is currently dragging the image.
 */
class ImageViewer extends HTMLElement {
  /**
   * Constructs the ImageViewer instance with optional configuration.
   * Merges user-provided options with default values.
   *
   * @param {Object} [options={}] - User configuration options.
   * @param {string} [options.targetSelector='img'] - CSS selector for target images.
   * @param {number} [options.maxScale=5] - Maximum zoom factor.
   * @param {number} [options.minScale=0.5] - Minimum zoom factor.
   * @param {boolean} [options.allowRotate=true] - Toggle rotation functionality.
   * @param {boolean} [options.allowDownload=true] - Toggle download functionality.
   */
  constructor(options = {}) {
    super();

    // Merge default config with user options
    this.config = {
      targetSelector: "img",
      maxScale: 5,
      minScale: 0.5,
      allowRotate: true,
      allowDownload: true,
      ...options,
    };

    // State variables
    this.currentScale = 1.0;
    this.currentRotation = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.imageList = [];
    this.currentIndex = -1;

    // Create a shadow root for encapsulation
    this.attachShadow({ mode: "open" });

    // Render the component's HTML and CSS
    this.#render();
  }

  /**
   * Renders the component's Shadow DOM structure and styles.
   * @private
   */
  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Root overlay that covers the entire viewport */
        #overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: none; /* Hidden by default */
          justify-content: center;
          align-items: center;
          z-index: 999999; /* Ensure it's on top */
          overflow: hidden;
          
          /* Default cursor */
          cursor: default;
          
          /* Prevent text selection */
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Wrapper for the image to handle transformations */
        #image-wrapper {
          position: relative;
          transform-origin: center center;
          transition: transform 0.1s ease-out;
          
          /* Prevent text selection */
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* The previewed image itself */
        #preview-img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border: 4px solid white;
          border-radius: 4px;
          
          /* Cursor indicates the image is draggable */
          cursor: grab;
          
          /* Prevent the image from being dragged as a separate element */
          pointer-events: none;
        }
        
        /* Cursor changes when dragging */
        #image-wrapper:active #preview-img,
        #overlay.dragging #preview-img {
          cursor: grabbing;
        }
        
        /* Change overlay cursor during drag for better feedback */
        #overlay.dragging {
          cursor: grabbing;
        }

        /* Loading indicator */
        #loading {
          color: white;
          font-size: 2em;
        }

        /* Container for navigation buttons (prev/next) */
        #nav-controls {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
          padding: 0 20px;
          box-sizing: border-box;
          z-index: 1;
          pointer-events: none;
        }
        
        /* Navigation buttons should be clickable */
        .nav-btn {
          pointer-events: auto;
        }
        
        /* Container for action buttons (close/rotate/download) */
        #controls {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        
        /* Base styles for all buttons */
        .control-btn, .nav-btn {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, transform 0.1s ease-in-out;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Hover effect for buttons */
        .control-btn:hover, .nav-btn:hover {
          background-color: #007bff;
          transform: scale(1.1);
        }
        
        /* Specific styles for action buttons */
        .control-btn {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }
        
        /* Specific styles for navigation buttons */
        .nav-btn {
          width: 50px;
          height: 50px;
          font-size: 24px;
          font-weight: bold;
        }
        
        /* Disabled button state */
        .nav-btn:disabled {
          background-color: rgba(0, 0, 0, 0.3);
          cursor: not-allowed;
          transform: none;
        }
        
        /* Close button gets a different highlight color */
        #close-btn:hover {
          background-color: #ff0000;
        }
        
        /* Image caption and index display */
        #image-info {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 16px;
          z-index: 10;
          max-width: 80%;
          text-align: left;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        
        #image-caption {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 15px;
          flex: 1;
        }
        
        /* Styling for the index part */
        #image-index {
          font-weight: bold;
          opacity: 0.9;
          white-space: nowrap;
          min-width: 50px;
          text-align: right;
        }
      </style>

      <div id="overlay">
        <div id="nav-controls">
          <button id="prev-btn" class="nav-btn" disabled>←</button>
          <button id="next-btn" class="nav-btn" disabled>→</button>
        </div>
        <div id="controls">
          <button id="close-btn" class="control-btn">×</button>
          <button id="rotate-btn" class="control-btn">↻</button>
          <button id="download-btn" class="control-btn">↓</button>
        </div>
        <div id="loading">Loading...</div>
        <div id="image-wrapper">
          <img id="preview-img" alt="Image Preview">
        </div>
        <div id="image-info">
          <span id="image-caption"></span>
          <span id="image-index"></span>
        </div>
      </div>
    `;
  }

  /**
   * Called when the element is added to the DOM.
   * Sets up event listeners and initializes the component.
   *
   * **Critical Fix:** `#cacheElements()` is now called first to ensure all DOM
   * element references are available before any other operations.
   */
  connectedCallback() {
    // 1. First, cache all DOM element references.
    this.#cacheElements();

    // 2. Then apply configuration that depends on DOM elements.
    this.#applyInitialConfig();

    // 3. Initialize data and observe DOM for images.
    this.#initializeImageList();

    // 4. Finally, bind event listeners that require DOM elements.
    this.#bindStaticEvents();
  }

  /**
   * Called when the element is removed from the DOM.
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback() {
    this.#unbindStaticEvents();
    this.#unbindDragEvents(); // Ensure drag events are unbound
    if (this.observer) this.observer.disconnect();
  }

  /**
   * Caches references to frequently used DOM elements.
   * @private
   */
  #cacheElements() {
    this.overlay = this.shadowRoot.getElementById("overlay");
    this.imageWrapper = this.shadowRoot.getElementById("image-wrapper");
    this.previewImg = this.shadowRoot.getElementById("preview-img");
    this.loadingIndicator = this.shadowRoot.getElementById("loading");
    this.closeBtn = this.shadowRoot.getElementById("close-btn");
    this.rotateBtn = this.shadowRoot.getElementById("rotate-btn");
    this.downloadBtn = this.shadowRoot.getElementById("download-btn");
    this.prevBtn = this.shadowRoot.getElementById("prev-btn");
    this.nextBtn = this.shadowRoot.getElementById("next-btn");
    this.imageCaption = this.shadowRoot.getElementById("image-caption");
    this.imageIndex = this.shadowRoot.getElementById("image-index");
    this.imageInfo = this.shadowRoot.getElementById("image-info");
  }

  /**
   * Applies initial configuration based on user options.
   * @private
   */
  #applyInitialConfig() {
    this.targetSelector = this.config.targetSelector;
    if (!this.config.allowRotate) this.rotateBtn.style.display = "none";
    if (!this.config.allowDownload) this.downloadBtn.style.display = "none";
  }

  /**
   * Initializes the list of target images and starts observing DOM changes.
   * @private
   */
  #initializeImageList() {
    this.imageList = Array.from(document.querySelectorAll(this.targetSelector));
    this.observeImages();
    this.bindClickEvents(this.imageList);
  }

  /**
   * Binds static event listeners (active for component's lifetime).
   * @private
   */
  #bindStaticEvents() {
    this.overlay.addEventListener("wheel", this.handleWheel.bind(this));
    this.imageWrapper.addEventListener("mousedown", this.startDrag.bind(this));
    this.closeBtn.addEventListener("click", this.closePreview.bind(this));
    this.rotateBtn.addEventListener("click", this.rotateImage.bind(this));
    this.downloadBtn.addEventListener("click", this.downloadImage.bind(this));

    // These will no longer throw errors because #cacheElements() was called first.
    this.prevBtn.addEventListener("click", this.showPrevImage.bind(this));
    this.nextBtn.addEventListener("click", this.showNextImage.bind(this));

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  /**
   * Unbinds static event listeners.
   * @private
   */
  #unbindStaticEvents() {
    this.overlay.removeEventListener("wheel", this.handleWheel.bind(this));
    this.imageWrapper.removeEventListener(
      "mousedown",
      this.startDrag.bind(this)
    );
    this.closeBtn.removeEventListener("click", this.closePreview.bind(this));
    this.rotateBtn.removeEventListener("click", this.rotateImage.bind(this));
    this.downloadBtn.removeEventListener(
      "click",
      this.downloadImage.bind(this)
    );
    this.prevBtn.removeEventListener("click", this.showPrevImage.bind(this));
    this.nextBtn.removeEventListener("click", this.showNextImage.bind(this));
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  /**
   * Binds drag-specific event listeners.
   * @private
   */
  #bindDragEvents() {
    this.overlay.addEventListener("mousemove", this.doDrag.bind(this));
    this.overlay.addEventListener("mouseup", this.endDrag.bind(this));
    this.overlay.addEventListener("mouseleave", this.endDrag.bind(this));
  }

  /**
   * Unbinds drag-specific event listeners.
   * @private
   */
  #unbindDragEvents() {
    this.overlay.removeEventListener("mousemove", this.doDrag.bind(this));
    this.overlay.removeEventListener("mouseup", this.endDrag.bind(this));
    this.overlay.removeEventListener("mouseleave", this.endDrag.bind(this));
  }

  /**
   * Resets all image transformations (scale, rotation, position).
   */
  resetTransform() {
    this.currentScale = 1.0;
    this.currentRotation = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.updateImageTransform();
  }

  /**
   * Applies the current transformation values to the image wrapper.
   */
  updateImageTransform() {
    this.imageWrapper.style.transform = `
      translate(${this.currentX}px, ${this.currentY}px)
      rotate(${this.currentRotation}deg)
      scale(${this.currentScale})
    `;
  }

  /**
   * Core method to display an image by its index.
   * @param {number} index - The index of the image in `imageList` to display.
   */
  showImageByIndex(index) {
    if (index < 0 || index >= this.imageList.length) {
      return;
    }

    this.currentIndex = index;
    const img = this.imageList[this.currentIndex];
    this.resetTransform();

    const highResSrc = img.dataset.highres;
    const lowResSrc = img.src;
    const altText = img.alt || "";

    this.#setLoadingState(true);
    
    // 先显示小图
    this.previewImg.src = lowResSrc;
    this.previewImg.alt = altText;

    this.previewImg.onload = () => {
      this.#updateInfoBar(altText);
      this.#updateNavButtons();
      this.#setLoadingState(false);
      
      // 如果有高分辨率图片，异步加载并在完成后替换
      if (highResSrc && highResSrc !== lowResSrc) {
        this.#loadHighResImage(highResSrc);
      }
    };

    this.previewImg.onerror = () => {
      this.loadingIndicator.textContent = "Failed to load image";
    };

    this.overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  /**
   * Asynchronously loads high-resolution image and replaces the current image when ready.
   * @param {string} highResSrc - The URL of the high-resolution image.
   * @private
   */
  #loadHighResImage(highResSrc) {
    const highResImg = new Image();
    
    highResImg.onload = () => {
      // Remove current onload handler to avoid duplicate triggers
      this.previewImg.onload = null;
      
      // High-resolution image loaded, replace current image
      this.previewImg.src = highResSrc;
      
      // Reset position only, keep scale and rotation state
      this.currentX = 0;
      this.currentY = 0;
      this.updateImageTransform();
      
      // Add subtle transition effect
      this.previewImg.style.opacity = '0.9';
      setTimeout(() => {
        this.previewImg.style.opacity = '1';
        this.previewImg.style.transition = 'opacity 0.3s ease';
      }, 50);
    };
    
    highResImg.onerror = () => {
      // Silently fail, continue using standard image
    };
    
    // Start loading high-resolution image
    highResImg.src = highResSrc;
  }

  /**
   * Sets the UI into a loading or loaded state.
   * @param {boolean} isLoading - True to enter loading state, false to exit.
   * @private
   */
  #setLoadingState(isLoading) {
    if (isLoading) {
      this.loadingIndicator.style.display = "block";
      this.imageWrapper.style.display = "none";
      this.imageInfo.style.display = "none";
      this.loadingIndicator.textContent = "Loading...";
    } else {
      this.loadingIndicator.style.display = "none";
      this.imageWrapper.style.display = "block";
    }
  }

  /**
   * Updates the info bar with caption and index.
   * @param {string} altText - The image's alt text to display as caption.
   * @private
   */
  #updateInfoBar(altText) {
    this.imageCaption.textContent = altText;
    this.imageIndex.textContent = `${this.currentIndex + 1} / ${
      this.imageList.length
    }`;
    this.imageInfo.style.display =
      altText || this.imageList.length > 1 ? "block" : "none";
  }

  /**
   * Updates the state (disabled/enabled) of the navigation buttons.
   * @private
   */
  #updateNavButtons() {
    this.prevBtn.disabled = this.currentIndex <= 0;
    this.nextBtn.disabled = this.currentIndex >= this.imageList.length - 1;
  }

  /**
   * Opens the viewer for a specific image element.
   * @param {MouseEvent} e - The click event.
   * @param {HTMLImageElement} img - The image element that was clicked.
   */
  openPreview(e, img) {
    e.stopPropagation();
    const index = this.imageList.indexOf(img);
    if (index !== -1) {
      this.showImageByIndex(index);
    }
  }

  /**
   * Closes the image viewer and restores body scrolling.
   */
  closePreview() {
    this.overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  /**
   * Displays the next image in the list.
   */
  showNextImage() {
    if (this.currentIndex < this.imageList.length - 1) {
      this.showImageByIndex(this.currentIndex + 1);
    }
  }

  /**
   * Displays the previous image in the list.
   */
  showPrevImage() {
    if (this.currentIndex > 0) {
      this.showImageByIndex(this.currentIndex - 1);
    }
  }

  /**
   * Handles keyboard navigation (ESC, ArrowLeft, ArrowRight).
   * @param {KeyboardEvent} e - The keyboard event.
   */
  handleKeyDown(e) {
    if (this.overlay.style.display !== "flex") return;

    switch (e.key) {
      case "Escape":
        this.closePreview();
        break;
      case "ArrowRight":
        this.showNextImage();
        break;
      case "ArrowLeft":
        this.showPrevImage();
        break;
    }
  }

  /**
   * Handles mouse wheel events for zooming.
   * @param {WheelEvent} e - The wheel event.
   */
  handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = this.currentScale + delta;

    if (newScale >= this.config.minScale && newScale <= this.config.maxScale) {
      const ratio = newScale / this.currentScale;
      const rect = this.overlay.getBoundingClientRect();

      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);

      this.currentX = offsetX * (1 - ratio) + this.currentX * ratio;
      this.currentY = offsetY * (1 - ratio) + this.currentY * ratio;
      this.currentScale = newScale;
      this.updateImageTransform();
    }
  }

  /**
   * Starts the drag operation.
   * @param {MouseEvent} e - The mousedown event.
   */
  startDrag(e) {
    if (e.button !== 0) return; // Only left button
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.startX = e.clientX - this.currentX;
    this.startY = e.clientY - this.currentY;
    this.overlay.classList.add("dragging");
    this.#bindDragEvents();
  }

  /**
   * Performs the drag operation.
   * @param {MouseEvent} e - The mousemove event.
   */
  doDrag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    this.currentX = e.clientX - this.startX;
    this.currentY = e.clientY - this.startY;
    this.updateImageTransform();
  }

  /**
   * Ends the drag operation.
   * @param {MouseEvent} [e] - The mouseup or mouseleave event.
   */
  endDrag(e) {
    if (!this.isDragging) return;
    if (e) {
      e.stopPropagation();
    }

    this.isDragging = false;
    this.overlay.classList.remove("dragging");
    this.#unbindDragEvents();
  }

  /**
   * Rotates the current image by 90 degrees clockwise.
   */
  rotateImage() {
    this.currentRotation = (this.currentRotation + 90) % 360;
    this.updateImageTransform();
  }

  /**
   * Triggers a download of the current image.
   */
  downloadImage() {
    const link = document.createElement("a");
    link.href = this.previewImg.src;
    const fileName =
      this.previewImg.alt.replace(/\s+/g, "_") ||
      `image_${this.currentIndex + 1}`;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Uses MutationObserver to dynamically track images matching the target selector.
   */
  observeImages() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          let imgsToProcess = [];
          if (node.tagName === "IMG" && node.matches(this.targetSelector)) {
            imgsToProcess.push(node);
          } else if (node.querySelectorAll) {
            imgsToProcess = Array.from(
              node.querySelectorAll(this.targetSelector)
            );
          }

          imgsToProcess.forEach((img) => {
            if (!this.imageList.includes(img)) {
              this.imageList.push(img);
              this.bindClickEvents([img]);
            }
          });
        });

        if (mutation.removedNodes.length > 0) {
          this.imageList = this.imageList.filter((img) =>
            document.body.contains(img)
          );
        }
      });
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Binds click event listeners to a list of image elements.
   * @param {HTMLImageElement[]} images - An array of image elements.
   */
  bindClickEvents(images) {
    images.forEach((img) => {
      if (!img.dataset.imageViewerBound) {
        img.addEventListener("click", (e) => this.openPreview(e, img));
        img.dataset.imageViewerBound = "true";
        img.style.cursor = "zoom-in";
      }
    });
  }
}

// Define the custom element
customElements.define("image-viewer", ImageViewer);

// Auto-initialize the component when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('image-viewer')) {
    const scriptElement = document.getElementById('gd-image-viewer');
    const config = {};
    if (scriptElement) {
      config.targetSelector = scriptElement.dataset.targetSelector || 'img';
      config.maxScale = parseFloat(scriptElement.dataset.maxScale) || 5;
      config.minScale = parseFloat(scriptElement.dataset.minScale) || 0.5;
      config.allowRotate = scriptElement.dataset.allowRotate !== 'false';
      config.allowDownload = scriptElement.dataset.allowDownload !== 'false';
    } else {
      config.targetSelector = 'img';
      config.maxScale = 5;
      config.minScale = 0.5;
      config.allowRotate = true;
      config.allowDownload = true;
    }
    const viewer = new ImageViewer(config);
    document.body.appendChild(viewer);
  }
});
