"use strict";

/** 签文结构；编号用于稳定恢复 Cookie 中的抽签结果。
 * @typedef {Object} Fortune
 * @property {number} id 签文的固定编号。
 * @property {"upper"|"middle"|"lower"} grade 签文等级。
 * @property {string} title 签文标题。
 * @property {string} verse 两行趣味签诗。
 * @property {string} note 签文解释。
 */
/** 抽签记录结构。
 * @typedef {Object} DrawRecord
 * @property {number} id 已抽中的签文编号。
 * @property {number} at 抽签完成时的毫秒时间戳。
 */

/** 固定签文库：三类各八支，独立等概率抽取。 @type {ReadonlyArray<Fortune>} */
const FORTUNES = Object.freeze([
  { id: 1, grade: "upper", title: "工位长安", verse: "任凭组织千般变，\n你的工位稳如山。", note: "愿名单里没有你，团队里少不了你。饭碗端得稳，才有心思写漂亮代码。" },
  { id: 2, grade: "upper", title: "薪水只涨不降", verse: "工资条上春风至，\n每次到账多一点。", note: "愿降本不降你的薪，增效先增你的收入。工作有回报，付出被看见。" },
  { id: 3, grade: "upper", title: "准点收工", verse: "需求落定无新改，\n夕阳尚在已归家。", note: "愿今天的任务按时完成，下班前没有临时会议。关上电脑，把时间留给生活。" },
  { id: 4, grade: "upper", title: "年终有余", verse: "一年提交终有报，\n年终红包厚三分。", note: "愿绩效写得好，奖金发得早。每一行认真写下的代码，都换来踏实的回报。" },
  { id: 5, grade: "upper", title: "贵人相助", verse: "遇事有人搭把手，\n前路自有好队友。", note: "愿有人理解你的难处，有人认可你的贡献。合作顺畅，甩锅退散。" },
  { id: 6, grade: "upper", title: "需求不再改", verse: "一稿通过皆欢喜，\n此版就是最终版。", note: "愿需求明确，验收顺利。文件名里不再出现“最终版_真的最终版”。" },
  { id: 7, grade: "upper", title: "升职有望", verse: "埋头耕耘终有日，\n好事恰在转角间。", note: "愿你的能力被看见，成长有空间，晋升有机会；新头衔和新工资一起到来。" },
  { id: 8, grade: "upper", title: "假期安稳", verse: "消息静默无告警，\n山海之间好度假。", note: "愿休假无人喊上线，周末没有急工单。手机只收到好消息，快乐无需随时待命。" },
  { id: 9, grade: "middle", title: "一遍运行", verse: "代码落定轻敲键，\n一次运行见晴天。", note: "愿编译顺利、运行流畅。今天写下的逻辑，都按你心里想的那样工作。" },
  { id: 10, grade: "middle", title: "今日无 Bug", verse: "测试一路皆为绿，\n报错从此绕道行。", note: "愿边界条件都想到，回归测试都通过。今天的 Bug 列表，只有已解决。" },
  { id: 11, grade: "middle", title: "丝滑如风", verse: "帧帧流畅无停顿，\n每次点击有回音。", note: "愿页面不卡顿，动画不掉帧。性能曲线稳稳当当，用户每次操作都舒心。" },
  { id: 12, grade: "middle", title: "部署顺遂", verse: "流水线里灯常绿，\n发布之后一夜安。", note: "愿构建一遍过，配置全正确，发布平稳无回滚。今晚可以安心睡个好觉。" },
  { id: 13, grade: "middle", title: "接口相知", verse: "字段类型皆对上，\n前后两端心意通。", note: "愿接口文档准确，返回数据齐全。联调一次成功，再也不用猜这个字段是什么意思。" },
  { id: 14, grade: "middle", title: "合并无冲突", verse: "千条分支终相聚，\n一键合并路路通。", note: "愿每次提交清晰，每次评审顺利。合并没有冲突，主分支永远健康。" },
  { id: 15, grade: "middle", title: "灵感在线", verse: "卡住思路忽开窍，\n几行代码解千愁。", note: "愿问题刚出现，思路就跟上。复杂的需求，也能找到清爽、可靠的实现方式。" },
  { id: 16, grade: "middle", title: "查询如电", verse: "索引恰好皆命中，\n万条数据一瞬回。", note: "愿查询计划选得对，慢日志里空荡荡。数据量增长，响应依然从容。" },
  { id: 17, grade: "lower", title: "内存漏风", verse: "对象去了家还在，\n内存悄悄涨起来。", note: "内存泄漏出没：留心未释放的资源、事件监听和缓存。看看内存快照，给不再使用的对象安排退场。" },
  { id: 18, grade: "lower", title: "空指针来访", verse: "以为此处有人在，\n一看原来是个空。", note: "空引用或空指针预警：检查初始化和对象生命周期，先判空再访问，别让一个 null 打断好心情。" },
  { id: 19, grade: "lower", title: "网络迷路", verse: "请求出门无回信，\n重试几番仍超时。", note: "网络超时出没：检查连接、超时设置和重试策略。记得设置次数上限，别让重试变成新的压力。" },
  { id: 20, grade: "lower", title: "边界有坑", verse: "下标只差那一个，\n数组尽头起风波。", note: "数组越界预警：认真检查循环边界、空集合和索引范围。最后一项之外，可没有隐藏彩蛋。" },
  { id: 21, grade: "lower", title: "并发抢跑", verse: "两条线程齐动手，\n结果偏偏不相同。", note: "竞态条件出没：留意共享状态和异步先后关系。正确同步，避免靠“再等一下”解决问题。" },
  { id: 22, grade: "lower", title: "死锁相逢", verse: "你等我来我等你，\n程序静静到天明。", note: "死锁预警：检查锁的获取顺序和持有范围。别让彼此等待，变成一场没有结果的约定。" },
  { id: 23, grade: "lower", title: "缓存念旧", verse: "新码已经传千里，\n页面还在忆从前。", note: "缓存一致性预警：检查失效策略、资源版本和数据更新。刷新能救急，正确的缓存策略才省心。" },
  { id: 24, grade: "lower", title: "域名失联", verse: "地址明明写得对，\n解析偏偏找不回。", note: "DNS 解析故障出没：检查域名、解析配置与本地缓存。分清连不上、找不到和服务没启动，排查会更快。" },
]);

/** 等级中文名称映射。 */
const GRADE_NAMES = Object.freeze({
  /** 上签的显示名称。 */ upper: "上签",
  /** 中签的显示名称。 */ middle: "中签",
  /** 下签的显示名称。 */ lower: "下签",
});
/** Cookie 名称，独立命名以避免与同域其他项目冲突。 */
const COOKIE_NAME = "developer_fortune_v1";
/** 最近记录的最大数量。 */
const MAX_RECORDS = 30;
/** 摇签持续时间，单位为秒。 */
const SHAKE_SECONDS = 3.00;
/** 出签展示时间，单位为秒。 */
const RELEASE_SECONDS = 0.65;
/** 以固定编号检索签文。 */
const fortuneById = new Map(FORTUNES.map((fortune) => [fortune.id, fortune]));
/** 签筒操作按钮。 */
const drawButton = document.querySelector("#draw-button");
/** 下方抽签操作按钮。 */
const startButton = document.querySelector("#start-button");
/** 动画场景容器。 */
const scene = document.querySelector("#draw-scene");
/** 抽签进度的无障碍提示。 */
const drawStatus = document.querySelector("#draw-status");
/** 签文结果弹窗。 */
const fortuneDialog = document.querySelector("#fortune-dialog");
/** 清空确认弹窗。 */
const clearDialog = document.querySelector("#clear-dialog");
/** 抽签记录列表。 */
const historyList = document.querySelector("#history-list");
/** 清空记录按钮。 */
const clearButton = document.querySelector("#clear-button");
/** Cookie 保存状态说明。 */
const storageNote = document.querySelector("#storage-note");
/** 抽签流程锁，阻止重复点击。 */
let isDrawing = false;
/** 最近抽签记录，按时间倒序排列。 @type {DrawRecord[]} */
let records = [];
/** Cookie 最近一次读取或写入是否发生异常。 */
let storageFailed = false;

/** 从 Cookie 读取原始记录，兼容浏览器禁止 Cookie 的情况。 */
function readCookie() {
  try {
    const entry = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
    return entry ? entry.slice(COOKIE_NAME.length + 1) : "";
  } catch {
    storageFailed = true;
    return "";
  }
}

/** 校验并恢复签文编号和时间戳；忽略损坏记录，不把 Cookie 当成 HTML。 */
function loadRecords() {
  const raw = readCookie();
  if (!raw) return [];
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(data)) throw new Error("记录格式无效");
    return data.filter((row) => Array.isArray(row) && row.length === 2 && fortuneById.has(row[0]) && Number.isSafeInteger(row[1]) && row[1] > 0 && row[1] <= Date.now() + 60000)
      .slice(0, MAX_RECORDS).map(([id, at]) => ({ id, at })).sort((a, b) => b.at - a.at);
  } catch {
    storageFailed = true;
    return [];
  }
}

/** 显示 Cookie 的真实保存状态，避免在本地文件协议下误报保存成功。 */
function updateStorageNote() {
  const unavailable = location.protocol === "file:" || storageFailed;
  storageNote.classList.toggle("warning", unavailable);
  storageNote.textContent = unavailable
    ? (location.protocol === "file:"
      ? "当前记录仅在本次页面中可用：请通过“启动.ps1”打开，并允许浏览器 Cookie，以便刷新后恢复。"
      : "浏览器未能保存 Cookie，当前记录仅在本次页面中可用；允许本站 Cookie 后可保存抽签记录。")
    : "◈ 最近 30 条记录仅通过 Cookie 保存在当前浏览器，有效期 365 天。";
}

/** 将紧凑记录写入 Cookie；编号可还原完整签文，30 条记录远低于单条 Cookie 的常见容量限制。 */
function saveRecords() {
  const value = encodeURIComponent(JSON.stringify(records.slice(0, MAX_RECORDS).map(({ id, at }) => [id, at])));
  try {
    document.cookie = `${COOKIE_NAME}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    storageFailed = readCookie() !== value;
  } catch {
    storageFailed = true;
  }
  updateStorageNote();
}

/** 将时间戳转换为带年月日和秒的本地时间。 */
function formatTime(timestamp) {
  const time = new Date(timestamp);
  const parts = [time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()].map((part) => String(part).padStart(2, "0"));
  return `${time.getFullYear()}/${parts[0]}/${parts[1]} ${parts[2]}:${parts[3]}:${parts[4]}`;
}

/** 创建纯文本节点，统一避免将持久化内容作为 HTML 注入。 */
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/** 显示签文；历史重看只展示内容，不增加抽签记录。 */
function showFortune(fortune) {
  fortuneDialog.dataset.grade = fortune.grade;
  document.querySelector("#fortune-grade").textContent = GRADE_NAMES[fortune.grade];
  document.querySelector("#fortune-number").textContent = `第 ${String(fortune.id).padStart(2, "0")} 签`;
  document.querySelector("#fortune-title").textContent = fortune.title;
  document.querySelector("#fortune-verse").textContent = fortune.verse;
  document.querySelector("#fortune-note").textContent = fortune.note;
  if (!fortuneDialog.open) fortuneDialog.showModal();
}

/** 更新最近记录列表，点击历史卡片可重新阅读签文。 */
function renderHistory() {
  historyList.replaceChildren();
  document.querySelector("#history-count").textContent = String(records.length).padStart(2, "0");
  clearButton.disabled = records.length === 0 || isDrawing;
  if (records.length === 0) {
    const empty = makeElement("div", "history-empty");
    empty.append(makeElement("span", "", "✧"), document.createTextNode("签筒已备好，第一份好运等你来摇。"));
    historyList.append(empty);
    return;
  }
  for (const record of records) {
    const fortune = fortuneById.get(record.id);
    const card = makeElement("button", "history-card");
    card.type = "button";
    card.dataset.grade = fortune.grade;
    card.disabled = isDrawing;
    card.setAttribute("aria-label", `${GRADE_NAMES[fortune.grade]}，${fortune.title}，${formatTime(record.at)}，查看签文`);
    const top = makeElement("span", "history-card-top");
    top.append(makeElement("span", "grade-tag", GRADE_NAMES[fortune.grade]), makeElement("span", "record-number", `NO. ${String(fortune.id).padStart(2, "0")}`));
    const time = makeElement("time", "", formatTime(record.at));
    time.dateTime = new Date(record.at).toISOString();
    card.append(top, makeElement("span", "record-title", fortune.title), time, makeElement("span", "record-arrow", "↗"));
    card.addEventListener("click", () => showFortune(fortune));
    historyList.append(card);
  }
}

/** 等待指定秒数，保持动画状态转换清晰。 */
function waitSeconds(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/** 同步操作按钮、清空按钮与历史卡片的可操作状态。 */
function setDrawing(drawing) {
  isDrawing = drawing;
  drawButton.disabled = drawing;
  startButton.disabled = drawing;
  startButton.setAttribute("aria-busy", String(drawing));
  drawButton.setAttribute("aria-busy", String(drawing));
  clearButton.disabled = drawing || records.length === 0;
  historyList.querySelectorAll("button").forEach((card) => { card.disabled = drawing; });
}

/** 锁定抽签流程：摇晃 3.00 秒、飞出单根竹签、保存结果并显示弹窗。 */
async function drawFortune() {
  if (isDrawing || fortuneDialog.open || clearDialog.open) return;
  setDrawing(true);
  scene.classList.remove("is-releasing");
  scene.classList.add("is-shaking");
  drawStatus.textContent = "正在摇签，心里默念一个愿望……";
  try {
    await waitSeconds(SHAKE_SECONDS);
    scene.classList.remove("is-shaking");
    scene.classList.add("is-releasing");
    drawStatus.textContent = "一支签已出筒，好运正在揭晓……";
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    await waitSeconds(RELEASE_SECONDS);
    records = [{ id: fortune.id, at: Date.now() }, ...records].slice(0, MAX_RECORDS);
    saveRecords();
    renderHistory();
    showFortune(fortune);
    drawStatus.textContent = `抽得${GRADE_NAMES[fortune.grade]} · ${fortune.title}。愿下一行代码，也有好运。`;
  } finally {
    scene.classList.remove("is-shaking", "is-releasing");
    setDrawing(false);
  }
}

/** 删除当前项目的 Cookie 和记录，保留同域其他 Cookie。 */
function clearRecords() {
  try {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    storageFailed = readCookie() !== "";
  } catch {
    storageFailed = true;
  }
  records = [];
  renderHistory();
  updateStorageNote();
  clearDialog.close();
  drawStatus.textContent = "记录已清空，再摇一支，开启新的好运。";
}

/** 点击弹窗外部时关闭，弹窗内部的空白区域不触发关闭。 */
function closeOnBackdrop(event) {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
}

/** 初始化记录并绑定页面交互。 */
function initialize() {
  records = loadRecords();
  renderHistory();
  updateStorageNote();
  drawButton.addEventListener("click", drawFortune);
  startButton.addEventListener("click", drawFortune);
  document.querySelector("#close-dialog").addEventListener("click", () => fortuneDialog.close());
  document.querySelector("#done-button").addEventListener("click", () => fortuneDialog.close());
  clearButton.addEventListener("click", () => clearDialog.showModal());
  document.querySelector("#cancel-clear").addEventListener("click", () => clearDialog.close());
  document.querySelector("#confirm-clear").addEventListener("click", clearRecords);
  fortuneDialog.addEventListener("click", closeOnBackdrop);
  clearDialog.addEventListener("click", closeOnBackdrop);
}

initialize();
