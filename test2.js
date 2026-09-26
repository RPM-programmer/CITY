import { consola } from "consola";

async function main() {
  // 1. Одиночный выбор (select)
  const projectType = await consola.prompt("Pick a project type.", {
    type: "select",
    options: [
      "JavaScript",
      "TypeScript",
      { label: "CoffeeScript", value: "CoffeeScript", hint: "oh no" }, // с подсказкой
    ],
    initial: "TypeScript", // значение по умолчанию
  });

  console.log(`Вы выбрали: ${projectType}`);

  // 2. Множественный выбор (multiselect)
  const tools = await consola.prompt("Select additional tools.", {
    type: "multiselect",
    required: false,
    options: [
      { value: "eslint", label: "ESLint", hint: "recommended" },
      { value: "prettier", label: "Prettier" },
      { value: "vitest", label: "Vitest" },
    ],
  });

  console.log(`Выбранные инструменты:`, tools);
}

main();

const stripAnsi = (str) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

function getVisibleWidth(str) {
  const cleanStr = stripAnsi(str);
  let width = 0;
  for (const char of cleanStr) {
    const code = char.codePointAt(0);
    if (code >= 0x1F300 && code <= 0x1F9FF) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

// 1. Словарь со стилями рамок (прямо как в пакетах boxen или @unjs/box)
const BOX_STYLES = {
  round:  { topL: "╭", topR: "╮", botL: "╰", botR: "╯", hor: "─", vert: "│" },
  double: { topL: "╔", topR: "╗", botL: "╚", botR: "╝", hor: "═", vert: "║" },
  single: { topL: "┌", topR: "┐", botL: "└", botR: "┘", hor: "─", vert: "│" }
};

function createCustomBox(text, title = "", styleType = "double") {
  const lines = text.split("\n");
  
  // Выбираем символы рамки
  const chars = BOX_STYLES[styleType] || BOX_STYLES.round;

  const maxTextWidth = Math.max(...lines.map(l => getVisibleWidth(l)));
  const titleWidth = getVisibleWidth(title);
  const innerWidth = Math.max(maxTextWidth, title ? titleWidth + 4 : 0);

  // Сборка шапки
  let header = "";
  if (title) {
    const totalHorizontals = innerWidth + 2 - (titleWidth + 2);
    const padLeft = Math.floor(totalHorizontals / 2);
    const padRight = Math.ceil(totalHorizontals / 2);
    header = chars.topL + chars.hor.repeat(padLeft) + ` ${title} ` + chars.hor.repeat(padRight) + chars.topR;
  } else {
    header = chars.topL + chars.hor.repeat(innerWidth + 2) + chars.topR;
  }

  // Сборка тела
  const body = lines.map(line => {
    const visibleLineWidth = getVisibleWidth(line);
    const spaceToFill = innerWidth - visibleLineWidth;
    return `${chars.vert} ${line}${" ".repeat(spaceToFill)} ${chars.vert}`;
  }).join("\n");

  // Сборка низа
  const footer = chars.botL + chars.hor.repeat(innerWidth + 2) + chars.botR;

  return `${header}\n${body}\n${footer}`;
}

// Проверяем работу с двойной рамкой, цветом и эмодзи
const content = "\x1b[36mДвойная рамка выглядит солидно! 💎\x1b[0m\nВсе отступы посчитаны автоматически.";
console.log(createCustomBox(content, "Премиум Бокс", "round"));
