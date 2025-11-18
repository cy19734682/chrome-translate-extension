# 网页翻译器 - Chrome 扩展

一个基于 Vue3 开发的高效网页翻译浏览器扩展，支持超过 60 种语言的即时页面翻译。

## 功能特性

- 支持 60+ 种语言的整页翻译
- 使用微软翻译服务，翻译质量高
- 简洁直观的用户界面
- 支持通过扩展图标快速访问
- 可通过右键菜单快速切换中英文
- 即时翻译进度提示
- 提供扩展选项页面进行个性化配置

## 支持的语言

包括但不限于：
- 简体中文
- 繁体中文
- 英语
- 日语
- 韩语
- 俄语
- 法语
- 西班牙语
- 德语
- 意大利语
- 葡萄牙语

## 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **插件**：@crxjs/vite-plugin, @vitejs/plugin-vue
- **翻译引擎**：i18n-jsautotranslate
- **浏览器扩展 API**：Chrome Extensions API v3
- **开发语言**：JavaScript

## 项目结构

```
├── src/
│   ├── background/        # 后台服务工作线程
│   │   └── service-worker.js
│   ├── content-scripts/   # 内容脚本
│   │   └── content.js
│   ├── options/           # 扩展选项页面
│   │   ├── App.vue
│   │   ├── index.html
│   │   └── main.js
│   ├── popup/             # 扩展弹窗
│   │   ├── App.vue
│   │   ├── index.html
│   │   └── main.js
│   ├── translate/         # 翻译核心功能
│   │   └── index.js
│   └── utils/             # 工具函数
│       ├── constant.js
│       └── wordTranslation.js
├── manifest.json          # 扩展配置文件
├── package.json           # 项目依赖和脚本
├── public/                # 静态资源
├── dist/                  # 构建输出目录
└── vite.config.js         # Vite配置文件
```

## 安装方法

### 开发环境安装

1. 克隆项目到本地
   ```bash
   git clone [仓库地址]
   cd chrome-translate-extension
   ```

2. 安装依赖（使用pnpm或npm）
   ```bash
   pnpm install
   # 或
   npm install
   ```

3. 构建项目
   ```bash
   npm run build
   ```

4. 加载到 Chrome 浏览器
  - 打开 Chrome 浏览器，输入 `chrome://extensions/`
  - 开启右上角的「开发者模式」
  - 点击「加载已解压的扩展程序」
  - 选择项目的 `dist` 目录

### 直接安装打包好的扩展

1. 使用已生成的 `.crx` 文件
  - 打开 Chrome 浏览器，输入 `chrome://extensions/`
  - 将 `chrome-translate-extension.crx` 文件拖入扩展页面
  - 点击「添加扩展程序」

## 使用说明

1. **通过扩展图标翻译**
  - 点击浏览器右上角的扩展图标
  - 从下拉菜单中选择目标语言
  - 点击「翻译当前页面」按钮开始翻译

2. **使用右键菜单翻译**
  - 在网页上右键点击
  - 选择翻译选项可快速切换中英文

3. **访问扩展选项**
  - 点击扩展图标，然后点击设置按钮
  - 或右键点击扩展图标，选择「选项」
  - 在选项页面中可以进行个性化配置

## 核心功能实现

- 翻译服务：使用微软 Edge 翻译服务
- 缓存策略：使用 sessionStorage 存储翻译配置
- 翻译范围：默认对整个页面进行翻译
- 用户体验：提供翻译进度提示和遮罩层

## 浏览器权限

该扩展需要以下权限以正常工作：

- `activeTab`：访问当前活动标签页
- `contextMenus`：创建右键菜单
- `storage`：存储用户设置
- `scripting`：注入脚本到网页
- `<all_urls>`：在所有网站上工作

## 开发说明

### 启动开发服务器

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 预览构建

```bash
npm run preview
```

## 注意事项

- 翻译质量取决于微软翻译服务的准确度
- 某些复杂网页可能无法完全翻译或可能出现布局问题
- 扩展使用 sessionStorage 存储翻译状态，关闭标签页后将重置
- 确保在使用前已正确配置扩展权限

## License

MIT
```
        