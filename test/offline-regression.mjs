// dsh-unity-csharp-habits 离线回归：宿主半技能提供方。
//
// 纯技能包，没有浏览器半，所以这里只验证「SKILL.md 能被正确解析并作为技能交付」。
//
// 跑法：node test/offline-regression.mjs
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createChecker, registerSkillProviderFake } from "./harness.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const hostFile = path.join(here, "..", "lib", "index.js");
const skillDir = path.join(here, "..", "skills", "unity-csharp-habits");

const { check, report } = createChecker();

const host = await import(pathToFileURL(hostFile).href);

// ── 1. 插件形态 ──
{
  console.log("\n1. 插件形态");
  check("导出 name = dsh-unity-csharp-habits", host.name === "dsh-unity-csharp-habits");
  check("inject = ['skills']", JSON.stringify(host.inject) === JSON.stringify(["skills"]));
  check("导出 apply 是函数", typeof host.apply === "function");
}

// ── 2. 注册提供方 ──
let provider = null;
{
  console.log("\n2. 注册提供方");
  let threw = null;
  try {
    host.apply({ skills: { registerProvider: registerSkillProviderFake((instance) => { provider = instance; }) } });
  } catch (error) { threw = error; }
  check("apply 未抛错且已注册提供方", threw === null && provider !== null);
  check("提供方名 = dsh-unity-csharp-habits", provider.name === "dsh-unity-csharp-habits");
}

// ── 3. 目录与正文 ──
{
  console.log("\n3. 技能目录与正文");
  const candidates = await provider.list({});
  check("只列出一个技能（examples.md 不会被当成技能）", JSON.stringify(candidates.map((c) => c.name)) === JSON.stringify(["unity-csharp-habits"]));
  check("候选不带正文（列举不读正文）", candidates[0].content === undefined);
  check("description 非空且含 Unity", candidates[0].description.includes("Unity"));
  check("rank = 350（高于用户本地技能 400，低于项目内技能 200）", candidates[0].rank === 350);

  const definition = await provider.get(candidates[0], {});
  check("get 返回完整正文", typeof definition.content === "string" && definition.content.length > 5000);
  check("正文含命名规则章节", definition.content.includes("## 1. 命名"));
  check("正文含全局注释硬规则", definition.content.includes("全局硬规则"));
  check("正文含 examples.md 指针（本次新增）", definition.content.includes("examples.md"));
  check("resourceBase 指向技能目录", definition.resourceBase.kind === "directory" && definition.resourceBase.path === skillDir);
  check("模型可调用且用户可调用", definition.invocation.modelInvocable === true && definition.invocation.userInvocable === true);
  check("折叠块标量 description 解析正确（>-)", definition.description.startsWith("用户在 Unity C# 项目中稳定的命名"));
}

// ── 4. examples.md 作为资源确实存在且可读 ──
{
  console.log("\n4. 资源文件");
  const { readFileSync } = await import("node:fs");
  const examples = readFileSync(path.join(skillDir, "examples.md"), "utf8");
  check("examples.md 与 SKILL.md 同目录（resourceBase 可解析相对路径）", examples.includes("反例"));
  check("examples.md 不是技能（没有 frontmatter 也不会被列出）", !examples.startsWith("---\nname:"));
}

// ── 5. 异常输入不抛错 ──
{
  console.log("\n5. 异常输入");
  const missing = await provider.get({ path: path.join(skillDir, "nope.md"), locator: skillDir }, {});
  check("不存在的技能返回 undefined 而不是抛错", missing === undefined);
  const badRoot = await provider.list({ signal: { aborted: true } });
  check("已中止的查询返回空数组而不是抛错", Array.isArray(badRoot) && badRoot.length === 0);
}

report();
