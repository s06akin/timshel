// Собирает самостоятельный сайт из index.html: node build.js
// Результат: docs/index.html — его можно выложить на любой хостинг и открыть как Telegram Mini App.
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const title = (src.match(/<title>([^<]*)<\/title>/) || [, "Timshel"])[1];
const fontLink = (src.match(/<link rel="stylesheet"[^>]*>/) || [""])[0];
const body = src
  .replace(/<title>[^<]*<\/title>\s*/, "")
  .replace(/<meta name="claude:[^>]*>\s*/, "")
  .replace(fontLink, "");

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="Игра-путешествие внутрь себя: ситуации выбора, путь по уровням сознания, Бацзы, Матрица судьбы и личная карта.">
<meta property="og:title" content="${title} — познай себя">
<meta property="og:description" content="Ты проходишь игру не чтобы стать кем-то, а чтобы увидеть, кто ты уже есть.">
<meta name="theme-color" content="#F1F5F3">
${fontLink}
<style>html{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
<script>
// Внутри Telegram: разворачиваем окно и берём светлую или тёмную тему из настроек Telegram.
function tgInit(){
  var t = window.Telegram && window.Telegram.WebApp;
  if(!t || !t.initData) return;            // обычный браузер: ничего не меняем
  t.ready(); t.expand();
  var set = function(){ document.documentElement.setAttribute("data-theme", t.colorScheme === "dark" ? "dark" : "light"); };
  set(); t.onEvent("themeChanged", set);
}
</script>
<script async src="https://telegram.org/js/telegram-web-app.js" onload="tgInit()"></script>
</head>
<body>
${body}
</body>
</html>
`;

fs.mkdirSync(path.join(__dirname, "docs"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "docs", "index.html"), html);
console.log("Готово: docs/index.html, " + Math.round(html.length / 1024) + " КБ");
