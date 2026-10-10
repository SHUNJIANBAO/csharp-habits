# Unity C# 习惯 — 好的写法 vs 反例

每条对照都来自用户实际工程归纳出的稳定约定，遵循本 skill 即可命中用户的风格。

## 1. 命名

```csharp
// 反例
public int hp;
protected int MaxHp;
private int _privateHp;
public const int maxLevel = 99;

// 正确
public int Hp;
protected int m_MaxHp;
private int _hp;
public const int MAX_LEVEL = 99;
```

## 2. 类型与方法注释

```csharp
// 反例：方法没有中文 XML 注释，类型也没有总体说明
public class Player
{
    public void Move(Vector3 dir) { }
}

// 正确
/// <summary>
/// 玩家角色控制器。
/// </summary>
public class Player : MonoBehaviour
{
    /// <summary>
    /// 按方向向量移动角色。
    /// </summary>
    /// <param name="dir">移动方向（已归一化）。</param>
    public void Move(Vector3 dir) { }
}
```

## 3. 协程防叠加

```csharp
// 反例：直接 StartCoroutine 会叠加
public void StartDash() => StartCoroutine(DashRoutine());

// 正确：先 StopCoroutine 再启动
private Coroutine _dashCo;
public void StartDash()
{
    if (_dashCo != null) StopCoroutine(_dashCo);
    _dashCo = StartCoroutine(DashRoutine());
}
```

## 4. UI 事件配对

```csharp
// 反例：OnEnable Add 但 OnDisable 没 Remove
private void OnEnable() => btn.onClick.AddListener(OnClick);
private void OnDisable() { /* 漏写 RemoveUIListeners */ }

// 正确：基类提供 Add/Remove 对，OnEnable/OnDisable 调用之
private void OnEnable() => AddUIListeners();
private void OnDisable() => RemoveUIListeners();
protected override void AddUIListeners()
{
    btn.onClick.AddListener(OnClick);
}
protected override void RemoveUIListeners()
{
    btn.onClick.RemoveListener(OnClick);
}
```

## 5. 日志格式

```csharp
// 反例：裸 Log / 英文 / 无模块
Debug.Log("HP changed");
Debug.LogError("Null reference");

// 正确
Debug.Log($"[Battle] 玩家 HP 从 {_hp} 变为 {value}");
Debug.LogError($"[Battle] 角色引用为空，已跳过 {nameof(ApplyDamage)}");
```

## 6. 数据类与行为类分离

```csharp
// 反例：所有字段、逻辑堆在一个类
public class Skill { public int id; public int dmg; public void Cast() { } }

// 正确
public class SkillData { public int id; public int dmg; }
public class Skill : MonoBehaviour
{
    public SkillData Data;
    public void Cast() { /* 基于 Data 行为 */ }
}
```
