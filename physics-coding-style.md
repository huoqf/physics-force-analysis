# physics-coding-style.md

# 物理代码规范：高中物理受力分析项目

本规则适用于 `physics-force-analysis` 项目。项目面向高中生，所有代码、场景数据和教学反馈必须优先保证物理概念准确、表达清晰、符合高中物理受力分析习惯。

## 1. 核心原则

1. 变量命名必须表达明确物理含义，避免使用无意义缩写。
2. 所有物理量必须在注释或字段说明中标注单位。
3. 必须区分“真实受力”和“分力、合力、效果力”。
4. `correctForces` 中只能放真实存在的力。
5. 面向学生的解释必须说明原因，不能只给结论。
6. 所有涉及公式的函数必须写明公式、单位和物理意义。

## 2. 变量命名

推荐使用以下命名：

| 物理量 | 变量名 | 单位 |
| --- | --- | --- |
| 质量 | `mass` | kg |
| 角度 | `angle` | ° |
| 弧度 | `angleRad` | rad |
| 速度 | `velocity` | m/s |
| 加速度 | `acceleration` | m/s² |
| 重力 | `gravity` / `gravityForce` | N |
| 支持力 | `normalForce` | N |
| 静摩擦力 | `staticFriction` | N |
| 最大静摩擦力 | `maxStaticFriction` | N |
| 动摩擦力 | `kineticFriction` | N |
| 推力 | `pushForce` | N |
| 拉力 | `pullForce` | N |
| 张力 | `tensionForce` | N |
| 合力 | `netForce` | N |

不得使用含义不清的变量名，例如：

```javascript
const a = 30
const f = 9.8
const n = 16.97
```

应改为：

```javascript
const angle = 30
const staticFriction = 9.8
const normalForce = 16.97
```

## 3. 真实受力与分力

以下是真实受力，可以出现在 `correctForces` 中：

- 重力
- 支持力 / 压力 / 弹力
- 摩擦力
- 推力
- 拉力
- 绳子张力
- 弹簧弹力
- 电场力
- 磁场力

以下通常不是独立真实受力，不得直接放入 `correctForces`：

- 下滑力
- 向心力
- 回复力
- 合力
- 重力分力
- 加速度方向上的力
- 运动力

示例：

```javascript
const gravity = mass * g
const gravityParallel = mass * g * Math.sin(angleRad)
const gravityPerpendicular = mass * g * Math.cos(angleRad)
```

其中 `gravity` 是真实受力，`gravityParallel` 和 `gravityPerpendicular` 是计算用分力，不能作为独立力加入 `correctForces`。

## 4. 单位标注

所有物理函数必须标注参数和返回值单位。

```javascript
/**
 * 计算重力大小。
 *
 * 公式：G = m * g
 *
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力大小，单位 N。
 */
function calculateGravity(mass, g = 9.8) {
  return mass * g
}
```

场景参数建议写明单位：

```javascript
physicsParams: {
  mass: 2.0, // kg
  angle: 30, // °
  mu_s: 0.6, // 无单位
  g: 9.8 // m/s²
}
```

## 5. 场景数据规范

每个场景应包含：

```javascript
{
  id: '',
  title: '',
  description: '',
  physicsParams: {},
  targetObject: {},
  correctForces: [],
  commonMistakes: [],
  steps: []
}
```

`correctForces` 中每个力必须包含：

```javascript
{
  id: '',
  name: '',
  symbol: '',
  origin: '',
  target: '',
  direction: '',
  reason: ''
}
```

字段要求：

- `origin`：施力物体，必须明确。
- `target`：受力物体，必须明确。
- `direction`：力的方向，必须具体。
- `reason`：为什么存在这个力，必须适合高中生理解。

## 6. 力 ID 命名

使用 kebab-case：

```text
gravity
normal-force
static-friction
kinetic-friction
push-force
pull-force
tension-force
spring-force
electric-force
magnetic-force
```

如果同一场景存在多个同类力，应加来源：

```text
normal-force-from-ground
normal-force-from-incline
tension-force-left-rope
```

## 7. 方向表达

面向学生展示的方向使用中文：

```javascript
direction: '竖直向下'
direction: '垂直斜面向上'
direction: '沿斜面向上'
direction: '沿斜面向下'
direction: '水平向右'
direction: '水平向左'
```

避免模糊表达：

```javascript
direction: '向上'
direction: '向下'
```

## 8. 摩擦力判断

摩擦力存在条件：

1. 两物体接触。
2. 接触面粗糙。
3. 存在相对运动或相对运动趋势。
4. 接触面之间存在压力。

方向规则：

- 静摩擦力方向与相对运动趋势方向相反。
- 动摩擦力方向与相对运动方向相反。

反馈必须解释判断依据，例如：

```javascript
reason: '物块有沿斜面向下滑动的趋势，且接触面粗糙，因此斜面对物块产生沿斜面向上的静摩擦力。'
```

## 9. 公式注释规范

涉及物理计算的函数必须写清：

1. 公式。
2. 参数单位。
3. 返回值单位。
4. 是否为真实受力或计算分力。

```javascript
/**
 * 计算重力沿斜面方向的分力。
 *
 * 公式：F_parallel = m * g * sin(theta)
 *
 * 教学提醒：
 * 该值是重力分力，不是独立存在的真实受力，不能直接画在受力图中。
 *
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力沿斜面方向的分力，单位 N。
 */
function calculateGravityParallel(mass, angle, g = 9.8) {
  const angleRad = angle * Math.PI / 180
  return mass * g * Math.sin(angleRad)
}
```

## 10. Canvas 绘制规则

受力箭头颜色建议统一：

| 力的类型 | 颜色 |
| --- | --- |
| 重力 | `#ef4444` |
| 支持力 / 弹力 | `#3b82f6` |
| 静摩擦力 | `#22c55e` |
| 动摩擦力 | `#15803d` |
| 推力 / 拉力 | `#a855f7` |
| 水平外力 | `#f97316` |
| 张力 | `#06b6d4` |
| 速度 | `#64748b` |
| 加速度 | `#eab308` |

注意：速度和加速度不是力，不能加入 `correctForces`。

## 11. Vue 组件规范

Props 使用 camelCase：

```javascript
confirmedForces
selectedObjectId
currentScenario
```

Events 使用 kebab-case：

```javascript
object-clicked
force-confirmed
answer-submitted
scenario-completed
params-changed
```

事件处理函数使用 `handle` 开头：

```javascript
handleObjectClick()
handleForceConfirm()
handleSubmitAnswer()
```

物理计算函数使用 `calculate` 开头：

```javascript
calculateGravity()
calculateNormalForce()
calculateMaxStaticFriction()
```

判断函数使用 `is`、`has`、`can`、`will` 开头：

```javascript
isSliding()
hasFriction()
canRemainStatic()
willSlideDown()
```

## 12. 检查清单

新增或修改物理相关代码前，必须检查：

- [ ] 变量名是否表达物理含义。
- [ ] 物理量是否标注单位。
- [ ] 角度计算前是否转换为弧度。
- [ ] 是否区分真实受力和分力。
- [ ] `correctForces` 是否只包含真实受力。
- [ ] 每个力是否包含施力物体、受力物体、方向和原因。
- [ ] 摩擦力方向是否根据相对运动或相对运动趋势判断。
- [ ] 支持力方向是否垂直接触面。
- [ ] 是否避免了“下滑力”“运动力”等错误力。
- [ ] 学生反馈是否解释了原因。
- [ ] 物理计算是否有单元测试。
