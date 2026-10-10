/**
 * dsh-unity-csharp-habits 宿主半：把包内 `skills/unity-csharp-habits/` 注册到
 * `ctx.skills`。纯技能包，没有浏览器半。
 *
 * @module dsh-unity-csharp-habits
 */
import { fileURLToPath } from 'node:url'
import { createSkillProvider } from './provider.js'

/** 插件名 = 包名，与 bundle patch 里的行名一致。 */
export const name = 'dsh-unity-csharp-habits'

/** 本插件需要技能注册表。 */
export const inject = ['skills']

/** 技能注册表里的提供方名。 */
const PROVIDER_NAME = 'dsh-unity-csharp-habits'

/**
 * 技能优先级，数值越小越优先。
 *
 * 取 350：高于用户本地 `~/.dsh/skills`（400）与 `~/.agents/skills`（500），
 * 低于项目内 `.dsh/skills`（100）与 `.agents/skills`（200）。含义是
 * 「插件自带的这份是用户级技能的来源，但项目可以按项目覆写」。
 */
const RANK = 350

/**
 * 注册技能提供方。
 *
 * @param ctx - Cordis 插件上下文（已注入 `skills`）。
 */
export function apply(ctx) {
  try {
    const skillsRoot = fileURLToPath(new URL('../skills/', import.meta.url))
    ctx.skills.registerProvider(
      createSkillProvider({ name: PROVIDER_NAME, rank: RANK, source: 'custom', skillsRoot }),
    )
  } catch (error) {
    // apply 抛错会把这一行变成 failed。技能装不上可以接受，宿主起不来不行。
    console.warn('[dsh-unity-csharp-habits] 技能提供方注册失败：', error)
  }
}
