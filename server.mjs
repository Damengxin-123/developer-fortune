import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

/** 静态文件根目录，始终使用当前脚本所在位置。 */
const root = dirname(fileURLToPath(import.meta.url));
/** 可访问文件的固定白名单及其响应类型。 */
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
]);
/** 默认端口；被占用时递增，不干扰已运行的服务。 */
let port = 4173;

/** 提供本机静态页面，不需要安装第三方依赖。 */
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("未找到页面");
    return;
  }
  try {
    const body = await readFile(join(root, file[0]));
    response.writeHead(200, { "Content-Type": file[1], "Cache-Control": "no-cache" });
    response.end(body);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("页面文件读取失败");
  }
});

/** 地址被占用时寻找空闲端口；其他错误直接显示。 */
server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && port < 4200) {
    port += 1;
    server.listen(port, "127.0.0.1");
    return;
  }
  console.error(`启动失败：${error.message}`);
  process.exitCode = 1;
});

/** 服务就绪时打印访问地址，可按启动参数打开系统默认浏览器。 */
server.on("listening", () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`码上好运已启动：${url}`);
  console.log("按 Ctrl+C 停止服务。抽签记录只保存在浏览器 Cookie 中。");
  if (process.argv.includes("--open")) {
    if (process.platform === "win32") {
      spawn("rundll32.exe", ["url.dll,FileProtocolHandler", url], { detached: true, stdio: "ignore", windowsHide: true }).unref();
    } else {
      spawn(process.platform === "darwin" ? "open" : "xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    }
  }
});

server.listen(port, "127.0.0.1");
