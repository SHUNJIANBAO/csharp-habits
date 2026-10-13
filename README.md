# csharp-habits

C# 项目代码习惯技能包：命名、文件结构、中文 XML 注释硬规则（任何 C# 项目都生效）、
Unity 写法、日志与生命周期、设计取向，外加正反例对照。

**纯技能包**：技能目录直接放在 `.dsh/skills/`，不再需要宿主半托管。

## 技能

| 技能 | 内容 |
| --- | --- |
| `csharp-habits` | `SKILL.md`（规则正文）+ `examples.md`（正反例对照） |

覆盖范围包括：新建/修改 C# 代码（Unity 或纯 C#）、补写或审查中文 XML 注释、
`.cs` 文件编码（统一 UTF-8 不带 BOM）、编译报「找不到类型/命名空间」时补 `using`、
`[InspectorName]` 中文显示名、单例/协程/UI 事件写法、设计取向。

## 安装

```sh
# GitHub
dsh plugin --profile <profile> add github:SHUNJIANBAO/csharp-habits

# 本地开发 / 离线
dsh plugin --profile <profile> add /abs/path/to/csharp-habits
```

官方桌面客户端：侧栏 **插件 → 添加插件**，粘包名、`github:` 地址或本地绝对路径。
装完重启 profile。

> **装了插件就别再在 `~/.dsh/skills/csharp-habits/` 放同名技能目录。**
> 技能注册表按 rank 裁决重名：本插件是 350，用户级 `~/.dsh/skills` 是 400，
> 所以插件版会赢、本地那份被静默隐藏 —— 看起来「能用」，但你改本地文件不会有任何效果。
> 只留一份。

## 验收

装好后确认：新会话的技能目录里出现 `csharp-habits`；
让它修改任何 C# 代码（Unity 或纯 C#）时，命名/注释/编码/文档注释规则按技能正文执行。

## 回滚

```sh
dsh plugin --profile <profile> remove dsh-unity-csharp-habits
```

或手工：从 profile 的 `package.json` 里删掉 `dependencies` 与 `dsh.profile.bundles` 两处的
`dsh-unity-csharp-habits`，删掉 `node_modules/dsh-unity-csharp-habits`，重启。
需要恢复成文件系统技能的话，把 `csharp-habits/` 整个拷回
`~/.dsh/skills/` 即可（内容一致）。

## 结构

```
csharp-habits/
└── csharp-habits/
    ├── SKILL.md
    └── examples.md       # 技能资源（SKILL.md 第 9 节指向它）
└── LICENSE
```

零 npm 运行时依赖，不声明 `@deepseek-ai/*` peerDependencies。

## 许可

MIT。见 [LICENSE](LICENSE)。