# ImageViewer.js

一个现代化的、轻量级的、可自定义的图片预览 Web Component。

**版本: 1.0.0**

[English Documentation](README.md)

## ✨ 特性

- **零依赖** - 纯原生 JavaScript 实现，无需任何外部库
- **Web Components 实现** - 基于现代 Web Components 标准构建
- **兼容性强** - 支持所有现代浏览器
- **鼠标滚轮缩放** - 使用鼠标滚轮平滑缩放图片
- **拖拽平移** - 缩放后可拖拽查看图片细节
- **图片旋转** - 每次点击旋转 90 度
- **下载支持** - 一键下载原图
- **多图导航** - 在多张图片间切换浏览
- **图片描述** - 显示图片的 `alt` 属性作为描述
- **键盘快捷键** - ESC 关闭，方向键导航
- **高分辨率加载** - 从低分辨率到高分辨率的渐进式加载
- **响应式设计** - 在所有屏幕尺寸上完美工作
- **高度可配置** - 通过 JavaScript 选项自定义行为

## 🚀 快速开始

### 方法 1: 自动初始化（推荐）

在 HTML 中添加脚本：

```html
<script src="path/to/image-viewer.js"></script>
```

组件会自动初始化并与页面上的所有 `<img>` 元素配合工作。

### 方法 2: 手动初始化

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

### 方法 3: HTML 配置

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

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `targetSelector` | string | `'img'` | CSS 选择器，指定哪些图片可触发预览 |
| `maxScale` | number | `5` | 最大缩放倍数 |
| `minScale` | number | `0.5` | 最小缩放倍数 |
| `allowRotate` | boolean | `true` | 是否允许旋转图片 |
| `allowDownload` | boolean | `true` | 是否允许下载图片 |

## 📖 API 参考

### 构造函数

```javascript
const viewer = new ImageViewer(options);
```

### 方法

- `showImageByIndex(index)` - 显示指定索引的图片
- `showNextImage()` - 显示下一张图片
- `showPrevImage()` - 显示上一张图片
- `closePreview()` - 关闭预览
- `rotateImage()` - 旋转当前图片
- `downloadImage()` - 下载当前图片
- `resetTransform()` - 重置所有变换（缩放、旋转、位置）

### 属性

- `currentIndex` - 当前显示图片的索引
- `currentScale` - 当前缩放比例
- `currentRotation` - 当前旋转角度
- `imageList` - 所有可预览图片的数组

## 🔧 高级用法

### 高分辨率图片加载

使用 `data-highres` 属性实现渐进式加载：

```html
<img src="thumbnail.jpg" data-highres="high-resolution.jpg" alt="图片描述">
```

### 自定义图片选择

指定特定的图片：

```javascript
const viewer = new ImageViewer({
  targetSelector: '.gallery-image, .photo-preview'
});
```

### 动态图片更新

组件自动跟踪 DOM 变化并处理动态添加的图片。

## 🎯 浏览器支持

- Chrome 61+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## 📦 安装

### 直接下载

从发布页面下载 `image-viewer.js` 并包含到你的项目中。

### NPM（即将推出）

```bash
TODO
```

### CDN（即将推出）

```html
TODO
```

## 🛠️ 开发

### 前置要求

- Node.js 14+
- npm 或 yarn

### 安装

```bash
# 安装依赖
npm install
```

### 构建

```bash
# 生产环境压缩
npm run build
```

这将在 `dist/image-viewer.min.js` 中创建一个压缩版本，文件大小减少约 56%（包含 CSS 优化）。

### 开发服务器

```bash
# 启动本地测试服务器
npm run dev
```

### 演示

在浏览器中打开 `demo.html` 查看所有功能。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 链接

- [演示](demo.html)
- [英文文档](README.md)
- [问题反馈](https://github.com/mrhuo/image-viewer/issues)
- [发布版本](https://github.com/mrhuo/image-viewer/releases)

---

为 Web 开发社区用心打造 ❤️
