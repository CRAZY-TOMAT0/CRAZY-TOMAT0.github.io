# 个人主页 · 郑婧雯

面向老师与同学的个人主页，展示教育背景、科研与实习经历、竞赛获奖与项目作品。
纯静态站点：**无框架、无构建步骤、无依赖**，双击 `index.html` 即可打开。

内容全部为本人真实经历，可直接展示或部署。

---

## 一、页面结构

| 文件 | 页面 | 主要模块 |
| --- | --- | --- |
| `index.html` | ① 首页 | 首屏（身份定位 + 基本信息卡 + GPA·排名·获奖三项数据）→ 精选经历 3 卡片 → 学习轨迹时间轴 → 技能速览 → 行动号召 |
| `about.html` | ② 关于我 | 页面横幅 → 个人简介 → 基本信息 → 教育背景（深大研一 / 本科）→ 主修课程成绩 → 科研经历 → 实习经历 → 竞赛获奖 11 项 → 荣誉与证书 |
| `skills.html` | ③ 技能 | 页面横幅 → 技能矩阵（编程语言 / 算法与机器学习 / 前后端 / 工程与硬件）→ 工具箱 → 能力说明 |
| `projects.html` | ④ 作品展示 | 页面横幅 → 分类筛选 Tab（科研论文 / 实习项目 / 竞赛项目）→ 3 个项目卡片 → 竞赛成果汇总 |
| `contact.html` | ⑤ 联系方式 | 页面横幅 → 联系方式卡片（邮箱一键复制）→ 留言表单 → 常见问题 |

## 二、目录说明

```
personal web/
├── index.html            首页
├── about.html            关于我
├── skills.html           技能
├── projects.html         作品展示
├── contact.html          联系方式
├── README.md             本文件
└── assets/
    ├── css/
    │   ├── base.css      设计变量（颜色/间距/圆角/字体）、重置、按钮与卡片等通用组件
    │   ├── layout.css    顶部导航、页脚、页面横幅、底部行动号召、响应式断点
    │   ├── pages.css     各页面专属样式（Hero、时间轴、课程成绩、获奖列表、表单…）
    │   └── projects.css  作品展示页样式（筛选栏、项目卡片、获奖汇总条）
    ├── js/
    │   ├── main.js       主题切换、移动端菜单、滚动动效、一键复制、表单校验
    │   └── projects.js   作品分类筛选
    └── img/
        ├── favicon.svg      站点图标
        ├── project-1.svg    标记分布学习框架示意图
        ├── project-2.svg    AI 数字人纪念馆示意图
        └── project-3.svg    远程心电监测系统示意图
```

CSS 分层约定：`base.css` 定义变量与通用组件 → `layout.css` 负责页面骨架 →
`pages.css` / `projects.css` 只写具体页面的细节。都不重复定义颜色，统一取用 CSS 变量。

## 三、本地预览

方式一：直接双击 `index.html`。

方式二（推荐，行为更接近线上）：在本目录启动一个本地服务器

```bash
npx serve .          # 或者： python -m http.server 8000
```

然后访问命令行输出的地址。

## 四、修改指南

全站搜索这些关键词即可批量替换：

| 搜索词 | 出现位置 | 替换成 |
| --- | --- | --- |
| `郑婧雯` | 标题、品牌、页脚、版权 | 你的姓名 |
| `ZJW` | 品牌图标、页脚 | 姓名首字母缩写 |
| `深圳大学` | 导航副标题、首页名片、教育背景 | 你的学校 |
| `研一` | 导航副标题、教育背景 | 你的年级 |
| `mnnu_zhengjingwen@163.com` | 页脚、联系方式、表单按钮 | 你的真实邮箱 |
| `4.1` / `3/99` / `11` | 首页数据卡、基本信息 | 你的 GPA、排名、获奖数 |

### 新增一个项目

复制 `projects.html` 中任意一张 `.project-card` 整段，改掉标题、
`data-category`、`assets/img/` 封面路径即可。筛选栏会自动识别新分类。

分类可选值：`research`（科研论文）、`internship`（实习项目）、`contest`（竞赛项目）。
多个分类用空格分隔：`data-category="research contest"`。

### 新增一项竞赛获奖

复制 `about.html` 中任意一条 `.award-item`，按层级选一个角标样式：

- `.award-badge--national` 橙色，用于国家级奖项
- `.award-badge--intl` 蓝色，用于国际级奖项
- `.award-badge--prov` 灰色，用于省级奖项

同时记得更新首页的获奖计数、`projects.html` 的 `.filter-count` 项目数与
`.award-summary` 汇总数字。

### 调整技能进度条

修改进度条的内联变量即可：

```html
<div class="skill-bar__track">
  <div class="skill-bar__fill" style="--level:88%"></div>
</div>
```

`--level` 是 0–100 的百分比，右上角的文字标签单独写在 `.skill-bar__top` 里。

### 让留言表单真正发送

目前表单只做格式校验，提交后会提示改用邮箱联系。`assets/js/main.js` 第 6 节的
表单处理处有注释标记，替换为真实请求即可：

```js
fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
});
```

后端可以用 Serverless 函数或表单服务。如果不想折腾后端，保持现状即可。

## 五、设计与响应式

- **配色**：中性冷灰底 + 单一靛蓝强调色（`--accent`），深浅两套主题。
  换主色只需改 `base.css` 里的 `--accent` 与 `--accent-hover`。
- **主题切换**：右上角按钮，偏好写入 `localStorage`，首次访问跟随系统深浅色。
- **响应式**：移动优先，断点为 `560px` / `760px` / `900px`。
  导航在 760px 以下折叠为汉堡菜单，栅格全部使用 `auto-fit` 自动换列。
- **动效**：基于 `IntersectionObserver` 的滚动入场；系统开启
  `prefers-reduced-motion` 时自动全部关闭。
- **可访问性**：语义化标签、跳转链接、`aria-current` 标记当前页、
  可见焦点环、表单错误用 `aria-live` 播报。

## 六、部署

任选其一，都是免费的：

1. **GitHub Pages**：新建仓库 → 上传整个文件夹 → Settings → Pages →
   选择 `main` 分支根目录。
2. **Netlify / Vercel**：把文件夹直接拖进控制台，无需配置构建命令。
3. **学校服务器**：上传到任意支持静态文件的目录即可。

注意：若从 `file://` 直接打开，浏览器会限制剪贴板 API，
"复制"按钮会自动退回到手动复制提示，这是正常现象。
