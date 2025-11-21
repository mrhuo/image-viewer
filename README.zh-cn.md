# ImageViewer.js

一个轻量级、零依赖的图片预览 Web Component。只需引入一个 JavaScript 文件，即可为您的网站添加精美的图片预览功能。

**版本: 1.0.0**

[English Documentation](README.md)

## 🚀 快速开始

在 HTML 中添加脚本，所有图片都将支持点击全屏预览：

```html
<script src="https://cdn.jsdelivr.net/gh/mrhuo/image-viewer@1.0.0/dist/image-viewer.min.js"></script>
```

就这么简单！页面上的所有 `<img>` 元素现在都可以点击打开精美的全屏预览。

## ✨ 核心特性

- **一行代码设置** - 只需引入脚本，无需额外配置
- **零依赖** - 纯原生 JavaScript，随处可用
- **全屏预览** - 点击任意图片沉浸式查看
- **鼠标滚轮缩放** - 使用鼠标滚轮平滑缩放
- **拖拽平移** - 缩放后可拖拽查看细节
- **键盘快捷键** - ESC 关闭，方向键导航
- **多图支持** - 在多张图片间切换浏览
- **响应式设计** - 在所有设备上完美工作

## 📸 效果展示

<div align="center">
  <img src="screenshots/screenshot1.png" alt="桌面端预览效果" width="45%" style="margin: 10px;">
  <img src="screenshots/screenshot-pc2.png" alt="桌面端控制界面" width="45%" style="margin: 10px;">
  <br>
  <img src="screenshots/screenshot-mobile.png" alt="移动端预览效果" width="30%" style="margin: 10px;">
</div>

**桌面端体验** - 全屏预览，提供直观的缩放、旋转和导航控制
<br>
**移动端优化** - 触摸友好的界面，流畅的手势操作和响应式设计

## ⚙️ 高级配置

如需自定义行为，可以配置查看器：

```html
<script id="gd-image-viewer" 
        src="dist/image-viewer.min.js"
        data-target-selector=".gallery-img"
        data-max-scale="8"
        data-min-scale="0.3"
        data-allow-rotate="false"
        data-allow-download="true">
</script>
```

### 配置选项

| 选项 | 默认值 | 描述 |
|------|--------|------|
| `data-target-selector` | `'img'` | 可点击图片的 CSS 选择器 |
| `data-max-scale` | `5` | 最大缩放倍数 |
| `data-min-scale` | `0.5` | 最小缩放倍数 |
| `data-allow-rotate` | `true` | 是否允许旋转图片 |
| `data-allow-download` | `true` | 是否允许下载图片 |

## 🛠️ 开发

### 构建

```bash
npm install
npm run build
```

在 `dist/image-viewer.min.js` 中创建压缩版本，文件大小减少约 56.81%，大小约10.2kb。

### 演示

打开 `example/index.html` 查看实际效果。

## 📄 许可证

MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

为 Web 开发社区用心打造 ❤️
