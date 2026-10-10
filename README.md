# dsh-unity-csharp-habits

Unity C# 项目代码习惯技能包：命名、文件与目录结构、中文 XML 注释硬规则、
Unity 写法、日志与生命周期、设计取向，外加一份正反例对照表。

纯技能包，**没有浏览器半**：宿主半把 `skills/unity-csharp-habits/` 注册进 `ctx.skills`。

## 技能

| 技能 | 内容 |
| --- | --- |
| `unity-csharp-habits` | `SKILL.md`（规则正文）+ `examples.md`（逐条「反例 → 好写法」对照） |

覆盖范围包括：新建/修改 Unity `.cs`、补写或审查中文 XML 注释、`.cs` 文件编码
（统一 UTF-8 不带 BOM）、编译报「找不到类型/命名空间」时补 `using`、
`[InspectorName]` 中文显示名、单例/协程/UI 事件写法、设计取向。

## 安装

```sh
# GitHub
dsh plugin --profile <profile> add github:SHUNJIANBAO/dsh-unity-csharp-habits

# 本地开发 / 离线
dsh plugin --profile <profile> add /abs/path/to/dsh-unity-csharp-habits
```

官方桌面客户端：侧栏 **插件 → 添加插件**，粘包名、`github:` 地址或本地绝对路径。
装完重启 profile。

> **装了插件就别再在 `~/.dsh/skills/unity-csharp-habits/` 放同名技能目录。**
> 技能注册表按 rank 裁决重名：本插件是 350，用户级 `~/.dsh/skills` 是 400，
> 所以插件版会赢、本地那份被静默隐藏 —— 看起来「能用」，但你改本地文件不会有任何效果。
> 只留一份。

## 验收

```sh
node test/offline-regression.mjs   # 20 条断言：技能目录、正文、资源文件
```

装好后确认：新会话的技能目录里出现 `unity-csharp-habits`；
让它改一个 Unity `.cs` 时，命名/注释规则按技能正文执行。

## 回滚

```sh
dsh plugin --profile <profile> remove dsh-unity-csharp-habits
```

或手工：从 profile 的 `package.json` 里删掉 `dependencies` 与 `dsh.profile.bundles` 两处的
`dsh-unity-csharp-habits`，删掉 `node_modules/dsh-unity-csharp-habits`，重启。
需要恢复成文件系统技能的话，把 `skills/unity-csharp-habits/` 整个拷回
`~/.dsh/skills/` 即可（内容一致）。

## 结构

```
dsh-unity-csharp-habits/
├── package.json          # dsh.bundle.patch（无 dsh.client：纯技能包）
├── cordis.patch.yml      # bundle patch：插入一行
├── lib/
│   ├── index.js          # 宿主半：注册技能提供方（rank 350）
│   ├── frontmatter.js    # 零依赖 SKILL.md frontmatter 解析器
│   └── provider.js       # 技能提供方工厂
├── skills/unity-csharp-habits/
│   ├── SKILL.md
│   └── examples.md       # 技能资源（SKILL.md 第 9 节指向它）
└── test/                 # 离线回归
```

零 npm 运行时依赖，不声明 `@deepseek-ai/*` peerDependencies。

## 许可

MIT。见 [LICENSE](LICENSE)。
