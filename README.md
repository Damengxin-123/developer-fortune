# 码上好运 · 程序员求签

独立的原生 HTML / CSS / JavaScript 小项目，无第三方依赖，无需构建。

## 在线访问与部署

- 公开网页：<https://damengxin-123.github.io/developer-fortune/>
- GitHub 仓库：<https://github.com/Damengxin-123/developer-fortune>

使用 GitHub Pages 发布，来源为 `main` 分支的根目录。每次将更新推送到 `main` 后，GitHub 会自动构建并重新发布网页；进度可在仓库的 Actions 页面查看。`.nojekyll` 让页面按原生静态文件发布。

访客通过 HTTPS 网址即可使用，无需安装或在本机启动服务。每位访客的抽签记录分别保存在自己的浏览器 Cookie 中。

## 打开页面

在 PowerShell 中执行本目录的 `启动.ps1`，会启动本机 HTTP 服务并打开默认浏览器。也可以在本目录执行：

```powershell
node server.mjs --open
```

需要已安装 Node.js。默认访问地址为 `http://127.0.0.1:4173`；端口被占用时自动尝试下一个端口。按 Ctrl+C 停止服务。服务器仅监听本机。

也可以把 `index.html`、`styles.css`、`app.js` 放进任何静态网站服务。双击 HTML 可以体验动画，但浏览器通常不允许 `file://` 页面可靠保存 Cookie，页面会明确提示；需要保留历史记录时请通过 HTTP 打开。

## 使用

- 点击中央木质竹签筒或“摇一支好运签”按钮。
- 签筒和筒内竹签左右摇晃 3.00 秒，再用 0.65 秒展示一根竹签出筒，随后弹窗展示签文。
- 共 24 支签，三类各 8 支，每支等概率抽取。上签围绕工作和收入，中签围绕开发顺利，下签围绕常见软件 Bug。
- 页面下方显示最近 30 次结果、抽签日期和时间，最新的在前。点击卡片可以重看签文。
- “清空记录”经过确认后删除当前项目的 Cookie 和页面记录。
- 抽签过程中锁定重复点击；支持键盘、Esc 关闭弹窗及移动端布局。

## 记录保存

记录只写入当前浏览器的 `developer_fortune_v1` Cookie，有效期为最后写入后的 365 天。使用 `[签文编号, 时间戳]` 的紧凑形式，编号对应 `app.js` 中的固定签文，可还原等级、标题、签诗和解签。30 条记录的编码长度低于常见的 4 KB Cookie 限制。修改签文时请保持已有编号含义不变；更换整套签文可同时更新 Cookie 名称中的版本号。

Cookie 使用 `SameSite=Lax`，HTTPS 下自动附带 `Secure`。禁止 Cookie、清理浏览器数据或切换浏览器都会影响记录保留。未启用 Cookie 时仍可抽签，但页面会提示仅能保留本次打开期间的记录。

## 文件

- `index.html`：页面结构和原生 SVG 木质签筒。
- `styles.css`：纸感配色、木纹表现、摇签和出签动画、响应式布局。
- `app.js`：签文库、抽签流程、弹窗及 Cookie 记录。
- `server.mjs` / `启动.ps1`：可选的本机静态预览服务。

检查脚本语法：`npm run check`。
