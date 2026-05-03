# physics-coding-style.md

# 高中物理受力分析项目代码规范

本文档用于规范 `physics-force-analysis` 项目中的物理变量命名、单位标注、公式注释、受力数据结构和物理计算代码写法。

本项目面向高中生物理学习场景，代码不仅要能正确运行，还要便于教师、学生和后续开发者理解其中的物理含义。因此，所有涉及物理量、物理公式、受力分析逻辑的代码，都必须尽量做到命名清晰、单位明确、公式来源可读、注释完整。

## 1. 总体原则

### 1.1 物理含义优先

变量名应优先表达物理含义，而不是仅使用单个字母。

推荐写法：

```javascript
const mass = 2.0
const angle = 30
const normalForce = 16.97
const staticFriction = 9.8
```

不推荐写法：

```javascript
const m = 2.0
const a = 30
const n = 16.97
const f = 9.8
```

单字母符号可以出现在公式说明、图像标注或 `symbol` 字段中，但代码变量名应尽量使用完整英文名称。

### 1.2 真实受力与分力必须区分

在受力分析教学中，必须区分“真实存在的力”和“为了计算而分解出来的分力”。

例如：

```javascript
const gravity = mass * g
const gravityParallel = mass * g * Math.sin(angleRad)
const gravityPerpendicular = mass * g * Math.cos(angleRad)
```

其中：

- `gravity` 是真实存在的重力。
- `gravityParallel` 是重力沿斜面方向的分力。
- `gravityPerpendicular` 是重力垂直斜面方向的分力。

在场景的 `correctForces` 中，通常只能放真实存在的力，不能把 `gravityParallel` 或 `gravityPerpendicular` 当成独立受力加入。

### 1.3 单位必须明确

所有涉及物理量的变量、参数、返回值、场景数据字段，都应在注释或文档中标明单位。

例如：

```javascript
/**
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力大小，单位 N。
 */
function calculateGravity(mass, g = 9.8) {
  return mass * g
}
```

### 1.4 面向高中物理表达

本项目用于高中物理辅助学习，注释和反馈文本应尽量使用高中阶段常见表达。

推荐表达：

```text
物块受到重力，方向竖直向下。
支持力方向垂直接触面并指向物块。
摩擦力方向与相对运动趋势方向相反。
```

避免使用过于抽象或超纲的表达，除非在高级模式或扩展说明中单独解释。

## 2. 文件命名规范

### 2.1 Vue 组件文件

Vue 组件使用 PascalCase 命名。

推荐：

```text
ForceCanvas.vue
ControlPanel.vue
StepGuide.vue
LearningView.vue
```

不推荐：

```text
force-canvas.vue
forcecanvas.vue
control_panel.vue
```

### 2.2 普通 JavaScript 文件

普通工具函数、物理计算模块、场景文件使用 kebab-case 或 camelCase，但项目内应保持一致。

推荐：

```text
engine.js
force-calculations.js
incline-scenarios.js
scenario-validator.js
```

如果当前项目已经使用某种风格，应优先保持现有风格，避免无意义重命名。

### 2.3 测试文件

测试文件放在 `__tests__` 目录或与源文件同目录，命名方式如下：

```text
ForceCanvas.test.js
StepGuide.test.js
engine.test.js
scenario-validator.test.js
```

### 2.4 场景文件

场景文件命名应体现物理模型。

推荐：

```text
incline-block-static.js
incline-block-sliding.js
horizontal-block-friction.js
pulley-connected-system.js
spring-block-system.js
```

不推荐：

```text
scene1.js
test.js
newFile.js
data.js
```

## 3. 物理变量命名规范

### 3.1 基本物理量命名

| 物理量 | 推荐变量名 | 物理符号 | 单位 | 说明 |
| --- | --- | --- | --- | --- |
| 质量 | `mass` | m | kg | 物体质量 |
| 时间 | `time` | t | s | 运动时间 |
| 位移 | `displacement` | s 或 x | m | 位置变化 |
| 路程 | `distance` | s | m | 路径长度 |
| 速度 | `velocity` | v | m/s | 可正可负 |
| 初速度 | `initialVelocity` | v0 | m/s | 初始速度 |
| 末速度 | `finalVelocity` | v | m/s | 某时刻速度 |
| 加速度 | `acceleration` | a | m/s² | 速度变化率 |
| 力 | `force` | F | N | 通用力 |
| 合力 | `netForce` | F合 | N | 所有外力的合成 |
| 角度 | `angle` | θ | ° | 对外展示通常使用角度 |
| 弧度 | `angleRad` | θ | rad | 三角函数计算使用弧度 |
| 重力加速度 | `g` 或 `gravityAcceleration` | g | m/s² | 通常取 9.8 |
| 摩擦因数 | `frictionCoefficient` | μ | 无单位 | 通用摩擦因数 |
| 静摩擦因数 | `mu_s` 或 `staticFrictionCoefficient` | μs | 无单位 | 静摩擦 |
| 动摩擦因数 | `mu_k` 或 `kineticFrictionCoefficient` | μk | 无单位 | 动摩擦 |

### 3.2 力的命名

#### 重力

```javascript
const gravity = mass * g
```

如需区分方向或分量：

```javascript
const gravityForce = mass * g
const gravityParallel = mass * g * Math.sin(angleRad)
const gravityPerpendicular = mass * g * Math.cos(angleRad)
```

说明：

- `gravityForce` 或 `gravity` 表示真实重力。
- `gravityParallel` 表示重力沿斜面方向的分力。
- `gravityPerpendicular` 表示重力垂直斜面方向的分力。

#### 支持力和压力

```javascript
const normalForce = gravityPerpendicular
const groundNormalForce = mass * g
const inclineNormalForce = mass * g * Math.cos(angleRad)
```

命名要求：

- 使用 `normalForce` 表示支持力或法向力。
- 如果存在多个接触面，应加上来源或对象前缀，例如 `groundNormalForce`、`inclineNormalForce`。
- 不建议只写 `normal`，因为它不够明确。

#### 摩擦力

```javascript
const staticFriction = gravityParallel
const maxStaticFriction = mu_s * normalForce
const kineticFriction = mu_k * normalForce
```

命名要求：

- `staticFriction` 表示实际静摩擦力。
- `maxStaticFriction` 表示最大静摩擦力。
- `kineticFriction` 表示动摩擦力。
- 不要混淆实际静摩擦力和最大静摩擦力。

错误示例：

```javascript
const friction = mu_s * normalForce
```

如果该值表示最大静摩擦力，应写成：

```javascript
const maxStaticFriction = mu_s * normalForce
```

#### 推力、拉力、张力

```javascript
const pushForce = 20
const pullForce = 15
const tensionForce = 10
```

如果存在多个绳子或多个连接体：

```javascript
const tensionForceAB = 12
const tensionForceBC = 8
```

#### 弹簧弹力

```javascript
const springForce = springConstant * compression
const springConstant = 100
const compression = 0.05
const extension = 0.05
```

说明：

- `springConstant` 表示劲度系数，单位 N/m。
- `compression` 表示压缩量，单位 m。
- `extension` 表示伸长量，单位 m。

#### 电场力和磁场力

```javascript
const electricForce = charge * electricField
const magneticForce = charge * velocity * magneticField
```

说明：

- `charge` 表示电荷量，单位 C。
- `electricField` 表示电场强度，单位 N/C。
- `magneticField` 表示磁感应强度，单位 T。

## 4. 方向命名规范

### 4.1 方向字符串

用于教学展示的方向建议使用中文，便于学生理解。

推荐：

```javascript
direction: '竖直向下'
direction: '垂直斜面向上'
direction: '沿斜面向上'
direction: '沿斜面向下'
direction: '水平向右'
direction: '水平向左'
```

不推荐：

```javascript
direction: 'down'
direction: 'up'
direction: 'left'
direction: 'right'
```

### 4.2 计算用方向

计算中可以使用向量或枚举值，但必须有清楚说明。

推荐：

```javascript
const DIRECTION = {
  VERTICAL_DOWN: 'vertical-down',
  VERTICAL_UP: 'vertical-up',
  ALONG_INCLINE_UP: 'along-incline-up',
  ALONG_INCLINE_DOWN: 'along-incline-down',
  HORIZONTAL_LEFT: 'horizontal-left',
  HORIZONTAL_RIGHT: 'horizontal-right'
}
```

### 4.3 向量命名

如果使用二维向量，建议使用 `{ x, y }` 结构。

```javascript
const gravityVector = {
  x: 0,
  y: gravity
}

const normalForceVector = {
  x: -normalForce * Math.sin(angleRad),
  y: -normalForce * Math.cos(angleRad)
}
```

如果坐标系中 `y` 轴向下为正，必须在注释中说明。

```javascript
// 画布坐标系：x 轴向右为正，y 轴向下为正。
const gravityVector = {
  x: 0,
  y: gravity
}
```

## 5. 单位标注要求

### 5.1 常用单位表

| 物理量 | 单位 | 单位符号 |
| --- | --- | --- |
| 质量 | 千克 | kg |
| 长度 | 米 | m |
| 时间 | 秒 | s |
| 速度 | 米每秒 | m/s |
| 加速度 | 米每二次方秒 | m/s² |
| 力 | 牛顿 | N |
| 角度 | 度 | ° |
| 弧度 | 弧度 | rad |
| 摩擦因数 | 无单位 | 无 |
| 电荷量 | 库仑 | C |
| 电场强度 | 牛每库仑 | N/C |
| 磁感应强度 | 特斯拉 | T |
| 劲度系数 | 牛每米 | N/m |

### 5.2 参数注释必须标明单位

推荐：

```javascript
/**
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} velocity - 速度，单位 m/s。
 * @param {number} normalForce - 支持力大小，单位 N。
 */
```

不推荐：

```javascript
/**
 * @param {number} mass - 质量。
 * @param {number} angle - 角度。
 */
```

### 5.3 返回值注释必须标明单位

推荐：

```javascript
/**
 * @returns {number} 最大静摩擦力，单位 N。
 */
function calculateMaxStaticFriction(mu_s, normalForce) {
  return mu_s * normalForce
}
```

### 5.4 场景参数必须有隐含或显式单位说明

推荐：

```javascript
physicsParams: {
  mass: 2.0,       // kg
  angle: 30,       // °
  mu_s: 0.6,       // 无单位
  g: 9.8           // m/s²
}
```

更推荐在场景文档中说明：

```javascript
/**
 * physicsParams:
 * - mass: 物体质量，单位 kg。
 * - angle: 斜面倾角，单位 °。
 * - mu_s: 静摩擦因数，无单位。
 * - g: 重力加速度，单位 m/s²。
 */
```

## 6. 公式注释格式

### 6.1 简单公式注释

适用于较简单的物理计算。

```javascript
// G = m * g，计算重力，单位 N。
const gravity = mass * g

// f_max = μs * F_N，计算最大静摩擦力，单位 N。
const maxStaticFriction = mu_s * normalForce
```

### 6.2 函数级公式注释

涉及物理公式的函数必须添加函数级注释。

```javascript
/**
 * 计算重力大小。
 *
 * 物理公式：
 * G = m * g
 *
 * 其中：
 * - G 表示重力，单位 N。
 * - m 表示质量，单位 kg。
 * - g 表示重力加速度，单位 m/s²。
 *
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} g - 重力加速度，单位 m/s²，默认值为 9.8。
 * @returns {number} 重力大小，单位 N。
 */
function calculateGravity(mass, g = 9.8) {
  return mass * g
}
```

### 6.3 推导型公式注释

对于学生容易出错的公式，建议写出推导说明。

```javascript
/**
 * 计算重力沿斜面方向的分力。
 *
 * 物理公式：
 * F_parallel = m * g * sin(theta)
 *
 * 推导说明：
 * 1. 物体受到的重力大小为 G = m * g。
 * 2. 将重力分解到沿斜面方向和垂直斜面方向。
 * 3. 沿斜面方向的分力为 G * sin(theta)。
 * 4. 因此 F_parallel = m * g * sin(theta)。
 *
 * 教学提醒：
 * gravityParallel 是重力的分力，不是一个新的真实受力。
 * 在受力图中不能把它作为独立的力画出。
 *
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} g - 重力加速度，单位 m/s²，默认值为 9.8。
 * @returns {number} 重力沿斜面方向的分力，单位 N。
 */
function calculateGravityParallel(mass, angle, g = 9.8) {
  const angleRad = angle * Math.PI / 180
  return mass * g * Math.sin(angleRad)
}
```

### 6.4 判断型逻辑注释

涉及静止、滑动、临界条件判断时，必须写清楚物理条件。

```javascript
/**
 * 判断物块是否会沿斜面下滑。
 *
 * 物理原理：
 * - 沿斜面向下的重力分力为 F_parallel = m * g * sin(theta)。
 * - 最大静摩擦力为 f_s_max = μs * F_N。
 * - 若 F_parallel > f_s_max，则静摩擦力不足以维持静止，物块会下滑。
 * - 若 F_parallel <= f_s_max，则物块可以保持静止。
 *
 * @param {number} gravityParallel - 重力沿斜面方向的分力，单位 N。
 * @param {number} maxStaticFriction - 最大静摩擦力，单位 N。
 * @returns {boolean} 若会下滑，返回 true；否则返回 false。
 */
function willSlideDown(gravityParallel, maxStaticFriction) {
  return gravityParallel > maxStaticFriction
}
```

## 7. 场景数据规范

### 7.1 场景基本结构

每个场景应尽量使用统一结构。

```javascript
export const inclineBlockStaticScenario = {
  id: 'incline-block-static',
  title: '粗糙斜面上的静止物块',
  description: '一个物块静止在粗糙斜面上，请分析物块受到的力。',
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_s: 0.6,
    g: 9.8
  },
  targetObject: {
    id: 'block',
    name: '物块',
    type: 'rectangle',
    dimensions: {
      width: 80,
      height: 50
    }
  },
  correctForces: [],
  commonMistakes: [],
  steps: []
}
```

### 7.2 场景 ID 命名

场景 ID 使用 kebab-case，格式建议为：

```text
模型-对象-状态
```

示例：

```text
incline-block-static
incline-block-sliding
incline-block-pushed-up
horizontal-block-friction
pulley-two-blocks
spring-block-horizontal
```

### 7.3 correctForces 规范

`correctForces` 中只能包含研究对象真实受到的力。

推荐结构：

```javascript
correctForces: [
  {
    id: 'gravity',
    name: '重力',
    symbol: 'G',
    origin: '地球',
    target: '物块',
    direction: '竖直向下',
    reason: '地球对物块有引力作用，因此物块受到重力。'
  },
  {
    id: 'normal-force',
    name: '支持力',
    symbol: 'F_N',
    origin: '斜面',
    target: '物块',
    direction: '垂直斜面向上',
    reason: '物块与斜面接触并相互挤压，因此斜面对物块有支持力。'
  }
]
```

字段说明：

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 力的唯一标识 |
| `name` | string | 是 | 力的中文名称 |
| `symbol` | string | 是 | 物理符号 |
| `origin` | string | 是 | 施力物体 |
| `target` | string | 是 | 受力物体 |
| `direction` | string | 是 | 力的方向 |
| `reason` | string | 是 | 产生该力的原因 |

### 7.4 力 ID 命名

力 ID 使用 kebab-case。

推荐：

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

如果同一场景中存在多个同类力，应加来源或对象说明。

```text
normal-force-from-ground
normal-force-from-incline
tension-force-left-rope
tension-force-right-rope
friction-from-block-a
friction-from-block-b
```

### 7.5 禁止把分力写入 correctForces

不推荐：

```javascript
correctForces: [
  {
    id: 'gravity-parallel',
    name: '下滑力',
    symbol: 'G_x',
    origin: '重力分解',
    target: '物块',
    direction: '沿斜面向下',
    reason: '重力沿斜面方向的分力。'
  }
]
```

推荐：

```javascript
commonMistakes: [
  {
    id: 'mistake-downhill-force',
    name: '误画下滑力',
    feedback: '下滑力不是一个真实存在的力，它只是重力沿斜面方向的分力，不能作为单独受力画出。'
  }
]
```

## 8. 常见错误数据规范

### 8.1 commonMistakes 结构

```javascript
commonMistakes: [
  {
    id: 'mistake-downhill-force',
    name: '误画下滑力',
    feedback: '下滑力不是一个真实存在的力，它只是重力沿斜面方向的分力。'
  }
]
```

字段说明：

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 错误唯一标识 |
| `name` | string | 是 | 错误名称 |
| `feedback` | string | 是 | 给学生的反馈说明 |

### 8.2 常见错误 ID 命名

推荐格式：

```text
mistake-错误类型
```

示例：

```text
mistake-downhill-force
mistake-normal-direction
mistake-friction-direction
mistake-missing-friction
mistake-extra-force
mistake-wrong-object
mistake-action-reaction-confusion
```

### 8.3 错误反馈写法

错误反馈应做到：

1. 指出错误。
2. 解释原因。
3. 给出正确判断方法。

推荐：

```javascript
feedback: '支持力方向不是竖直向上，而是垂直接触面并指向受力物体。本题中物块在斜面上，因此支持力应垂直斜面向上。'
```

不推荐：

```javascript
feedback: '错了。'
```

## 9. StepGuide 步骤数据规范

### 9.1 标准步骤顺序

建议所有受力分析场景遵循以下顺序：

1. 选择研究对象。
2. 判断重力。
3. 寻找接触物体。
4. 判断弹力或支持力。
5. 判断是否存在摩擦力。
6. 判断摩擦力方向。
7. 检查是否多画或漏画力。

### 9.2 steps 结构

```javascript
steps: [
  {
    id: 'select-object',
    title: '选择研究对象',
    content: '本题要求分析物块受力，因此研究对象应选择物块。',
    action: 'select-object',
    target: 'block'
  },
  {
    id: 'check-gravity',
    title: '判断重力',
    content: '物块在地球表面附近，因此一定受到重力。',
    action: 'confirm-force',
    forceId: 'gravity'
  }
]
```

### 9.3 步骤 ID 命名

推荐：

```text
select-object
check-gravity
check-contact
check-normal-force
check-friction-existence
check-friction-direction
check-final-answer
```

### 9.4 选项数据规范

如果步骤中包含选择题，建议使用：

```javascript
options: [
  {
    id: 'option-block',
    text: '物块',
    correct: true,
    feedback: '正确。本题要求分析物块受力。'
  },
  {
    id: 'option-incline',
    text: '斜面',
    correct: false,
    feedback: '本题要求分析物块，不是分析斜面。'
  }
]
```

每个选项应尽量有单独反馈，便于学生理解错误原因。

## 10. 物理计算函数规范

### 10.1 函数命名

物理计算函数使用动词开头，建议格式为：

```text
calculate + 物理量
```

示例：

```javascript
calculateGravity()
calculateNormalForce()
calculateGravityParallel()
calculateGravityPerpendicular()
calculateMaxStaticFriction()
calculateKineticFriction()
calculateNetForce()
calculateAcceleration()
```

判断函数使用 `is`、`has`、`can`、`will` 开头。

```javascript
isAtRest()
isSliding()
hasFriction()
canRemainStatic()
willSlideDown()
```

### 10.2 输入校验

涉及物理计算的函数建议进行必要的输入校验。

```javascript
function calculateGravity(mass, g = 9.8) {
  if (mass < 0) {
    throw new RangeError('质量不能为负数。')
  }

  return mass * g
}
```

### 10.3 角度计算规范

对外展示和场景数据中使用角度，三角函数计算时必须转为弧度。

```javascript
function toRadians(angle) {
  return angle * Math.PI / 180
}

const angleRad = toRadians(angle)
```

不推荐在多个地方重复写：

```javascript
const angleRad = angle / 180 * Math.PI
```

推荐统一封装，减少错误。

### 10.4 浮点数比较

物理计算中涉及浮点数时，不要直接使用严格相等判断。

不推荐：

```javascript
if (netForce === 0) {
  return '静止或匀速'
}
```

推荐：

```javascript
const EPSILON = 1e-6

function isApproximatelyZero(value) {
  return Math.abs(value) < EPSILON
}

if (isApproximatelyZero(netForce)) {
  return '静止或匀速'
}
```

## 11. 画布绘制规范

### 11.1 坐标系说明

所有画布绘制函数必须明确坐标系。

```javascript
// Canvas 坐标系：x 轴向右为正，y 轴向下为正。
// 物理坐标系：可根据场景定义，但必须在转换时说明。
```

### 11.2 受力箭头颜色规范

建议统一使用以下颜色。

| 力的类型 | 推荐颜色 | 十六进制 |
| --- | --- | --- |
| 重力 | 红色 | `#ef4444` |
| 支持力 / 弹力 | 蓝色 | `#3b82f6` |
| 静摩擦力 | 绿色 | `#22c55e` |
| 动摩擦力 | 深绿色 | `#15803d` |
| 推力 / 拉力 | 紫色 | `#a855f7` |
| 水平外力 | 橙色 | `#f97316` |
| 张力 | 青色 | `#06b6d4` |
| 电场力 | 粉色 | `#ec4899` |
| 磁场力 | 靛蓝色 | `#6366f1` |
| 速度 | 灰色 | `#64748b` |
| 加速度 | 黄色 | `#eab308` |

### 11.3 受力箭头绘制命名

推荐：

```javascript
drawForceArrow()
drawGravityArrow()
drawNormalForceArrow()
drawFrictionArrow()
drawVelocityArrow()
```

受力箭头与速度箭头、加速度箭头应区分。速度和加速度不是力，不应放入 `correctForces`。

### 11.4 标签显示规范

画布上的力标签应优先显示物理符号。

示例：

```text
G
F_N
f_s
f_k
F
T
```

可以在悬浮提示或右侧说明面板中显示完整名称。

## 12. Vue 组件代码规范

### 12.1 Props 命名

Props 使用 camelCase。

推荐：

```javascript
const props = defineProps({
  scenario: {
    type: Object,
    required: true
  },
  confirmedForces: {
    type: Array,
    default: () => []
  },
  selectedObjectId: {
    type: String,
    default: ''
  }
})
```

### 12.2 Events 命名

事件使用 kebab-case。

推荐：

```javascript
const emit = defineEmits([
  'object-clicked',
  'force-confirmed',
  'answer-submitted',
  'scenario-completed',
  'params-changed'
])
```

触发事件：

```javascript
emit('object-clicked', objectId)
emit('force-confirmed', forceId)
emit('answer-submitted', answer)
```

### 12.3 组件内函数命名

事件处理函数使用 `handle` 开头。

```javascript
function handleObjectClick(objectId) {
  emit('object-clicked', objectId)
}

function handleForceConfirm(forceId) {
  emit('force-confirmed', forceId)
}

function handleSubmitAnswer() {
  emit('answer-submitted')
}
```

计算函数使用 `calculate` 开头。

```javascript
function calculateArrowEndPoint(startPoint, forceVector) {
  // ...
}
```

状态判断使用 `is`、`has`、`can` 开头。

```javascript
function isCorrectForce(forceId) {
  return props.scenario.correctForces.some(force => force.id === forceId)
}

function hasConfirmedForce(forceId) {
  return props.confirmedForces.includes(forceId)
}
```

## 13. 注释语言规范

### 13.1 面向开发者的注释

开发者注释应说明代码意图，而不是重复代码。

推荐：

```javascript
// 将角度转换为弧度，因为 Math.sin 和 Math.cos 接收弧度。
const angleRad = angle * Math.PI / 180
```

不推荐：

```javascript
// angle 乘以 Math.PI 再除以 180。
const angleRad = angle * Math.PI / 180
```

### 13.2 面向学生的解释

面向学生的解释应避免过度技术化。

推荐：

```javascript
reason: '物块有沿斜面向下滑动的趋势，因此斜面对物块的静摩擦力沿斜面向上。'
```

不推荐：

```javascript
reason: '由于切向分量大于零，约束反力产生摩擦响应。'
```

## 14. 错误处理规范

### 14.1 物理参数错误

对于明显不合理的参数，应给出清晰错误信息。

```javascript
function validateMass(mass) {
  if (typeof mass !== 'number') {
    throw new TypeError('质量必须是数字。')
  }

  if (mass <= 0) {
    throw new RangeError('质量必须大于 0。')
  }
}
```

### 14.2 场景数据错误

场景数据校验应检查：

- 是否有 `id`。
- 是否有 `title`。
- 是否有 `physicsParams`。
- 是否有 `targetObject`。
- 是否有 `correctForces`。
- `correctForces` 中每个力是否有 `origin`、`target`、`direction`。
- 是否错误地把分力放入 `correctForces`。

示例：

```javascript
function validateScenario(scenario) {
  if (!scenario.id) {
    throw new Error('场景缺少 id。')
  }

  if (!Array.isArray(scenario.correctForces)) {
    throw new Error('场景 correctForces 必须是数组。')
  }

  scenario.correctForces.forEach(force => {
    if (!force.origin || !force.target || !force.direction) {
      throw new Error(`力 ${force.id} 缺少施力物体、受力物体或方向。`)
    }
  })
}
```

## 15. 测试代码规范

### 15.1 测试命名

测试描述应使用中文或清晰英文，优先描述物理行为。

推荐：

```javascript
it('能够正确计算重力大小', () => {
  expect(calculateGravity(2, 9.8)).toBeCloseTo(19.6)
})

it('当重力沿斜面分力大于最大静摩擦力时，物块会下滑', () => {
  expect(willSlideDown(12, 10)).toBe(true)
})
```

不推荐：

```javascript
it('test 1', () => {
  // ...
})
```

### 15.2 物理计算测试

物理计算测试应包含：

- 正常值。
- 边界值。
- 异常值。
- 单位说明。
- 浮点误差处理。

示例：

```javascript
import { describe, it, expect } from 'vitest'

describe('calculateGravityParallel', () => {
  it('能够计算 30° 斜面上重力沿斜面方向的分力', () => {
    const result = calculateGravityParallel(2, 30, 9.8)
    expect(result).toBeCloseTo(9.8, 2)
  })
})
```

### 15.3 场景数据测试

建议为每个场景添加数据完整性测试。

```javascript
it('每个正确受力都应包含施力物体、受力物体和方向', () => {
  scenario.correctForces.forEach(force => {
    expect(force.origin).toBeTruthy()
    expect(force.target).toBeTruthy()
    expect(force.direction).toBeTruthy()
  })
})
```

## 16. 推荐工具函数

建议将常用物理计算封装为工具函数，避免分散在组件中。

```javascript
/**
 * 角度转弧度。
 *
 * @param {number} angle - 角度，单位 °。
 * @returns {number} 弧度，单位 rad。
 */
export function toRadians(angle) {
  return angle * Math.PI / 180
}

/**
 * 计算重力。
 *
 * @param {number} mass - 质量，单位 kg。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力，单位 N。
 */
export function calculateGravity(mass, g = 9.8) {
  return mass * g
}

/**
 * 计算重力沿斜面方向的分力。
 *
 * @param {number} mass - 质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力沿斜面方向的分力，单位 N。
 */
export function calculateGravityParallel(mass, angle, g = 9.8) {
  const angleRad = toRadians(angle)
  return mass * g * Math.sin(angleRad)
}

/**
 * 计算重力垂直斜面方向的分力。
 *
 * @param {number} mass - 质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @param {number} g - 重力加速度，单位 m/s²。
 * @returns {number} 重力垂直斜面方向的分力，单位 N。
 */
export function calculateGravityPerpendicular(mass, angle, g = 9.8) {
  const angleRad = toRadians(angle)
  return mass * g * Math.cos(angleRad)
}

/**
 * 计算最大静摩擦力。
 *
 * @param {number} mu_s - 静摩擦因数，无单位。
 * @param {number} normalForce - 支持力，单位 N。
 * @returns {number} 最大静摩擦力，单位 N。
 */
export function calculateMaxStaticFriction(mu_s, normalForce) {
  return mu_s * normalForce
}

/**
 * 判断物体是否会沿斜面下滑。
 *
 * @param {number} gravityParallel - 重力沿斜面方向的分力，单位 N。
 * @param {number} maxStaticFriction - 最大静摩擦力，单位 N。
 * @returns {boolean} 若会下滑，返回 true；否则返回 false。
 */
export function willSlideDown(gravityParallel, maxStaticFriction) {
  return gravityParallel > maxStaticFriction
}
```

## 17. 禁止事项

### 17.1 不要把效果力当作真实力

以下内容通常不应作为 `correctForces` 中的真实力：

```text
下滑力
向心力
回复力
合力
重力分力
加速度方向的力
运动力
惯性力
```

其中“向心力”“回复力”“合力”通常是按作用效果命名的力，不一定对应一个新的施力物体。在高中受力分析中，应追问它们分别由哪些真实力或真实力的合力提供。

### 17.2 不要省略施力物体

不推荐：

```javascript
{
  name: '支持力',
  target: '物块',
  direction: '向上'
}
```

推荐：

```javascript
{
  name: '支持力',
  origin: '斜面',
  target: '物块',
  direction: '垂直斜面向上'
}
```

### 17.3 不要用模糊方向

不推荐：

```javascript
direction: '向上'
```

如果是在斜面上，应写：

```javascript
direction: '垂直斜面向上'
```

或者：

```javascript
direction: '沿斜面向上'
```

### 17.4 不要让教学解释只给结论

不推荐：

```javascript
reason: '因为它受摩擦力。'
```

推荐：

```javascript
reason: '物块有沿斜面向下滑动的趋势，且接触面粗糙，因此斜面对物块产生沿斜面向上的静摩擦力。'
```

## 18. 推荐目录组织

建议后续将物理计算、场景校验和数据定义拆分清楚。

```text
src/
├── physics/
│   ├── engine.js
│   ├── calculations.js
│   ├── force-vectors.js
│   └── scenario-validator.js
├── data/
│   └── scenarios/
│       ├── incline-block-static.js
│       ├── incline-block-sliding.js
│       └── index.js
├── components/
│   ├── ForceCanvas.vue
│   ├── ControlPanel.vue
│   └── StepGuide.vue
└── views/
    └── LearningView.vue
```

## 19. 代码审查检查清单

每次新增或修改物理相关代码时，应检查以下内容：

- [ ] 变量名是否表达了明确的物理含义。
- [ ] 所有物理量是否标明单位。
- [ ] 角度传入三角函数前是否转换为弧度。
- [ ] 是否区分了真实受力和分力。
- [ ] `correctForces` 中是否只包含真实受力。
- [ ] 每个力是否写明施力物体和受力物体。
- [ ] 摩擦力方向是否根据相对运动或相对运动趋势判断。
- [ ] 支持力方向是否垂直接触面。
- [ ] 是否避免了“下滑力”“运动力”等错误力。
- [ ] 公式注释是否足够高中生理解。
- [ ] 物理计算是否有单元测试。
- [ ] 场景数据是否通过完整性校验。
- [ ] 反馈文案是否能帮助学生理解错误原因。

## 20. 示例：规范场景片段

```javascript
/**
 * 场景：粗糙斜面上的静止物块。
 *
 * 物理情境：
 * 一个质量为 2 kg 的物块静止在倾角为 30° 的粗糙斜面上。
 *
 * 正确受力：
 * 1. 重力 G：地球施加，方向竖直向下。
 * 2. 支持力 F_N：斜面施加，方向垂直斜面向上。
 * 3. 静摩擦力 f_s：斜面施加，方向沿斜面向上。
 *
 * 易错点：
 * 学生可能会误画“下滑力”。下滑力不是独立存在的真实力，
 * 而是重力沿斜面方向的分力，不能画在受力图中。
 */
export const inclineBlockStaticScenario = {
  id: 'incline-block-static',
  title: '粗糙斜面上的静止物块',
  description: '物块静止在粗糙斜面上，请分析物块受到的力。',
  physicsParams: {
    mass: 2.0,       // kg
    angle: 30,       // °
    mu_s: 0.6,       // 无单位
    g: 9.8           // m/s²
  },
  targetObject: {
    id: 'block',
    name: '物块',
    type: 'rectangle',
    dimensions: {
      width: 80,
      height: 50
    }
  },
  correctForces: [
    {
      id: 'gravity',
      name: '重力',
      symbol: 'G',
      origin: '地球',
      target: '物块',
      direction: '竖直向下',
      reason: '地球对物块有引力作用，因此物块受到重力。'
    },
    {
      id: 'normal-force',
      name: '支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块与斜面接触并相互挤压，因此斜面对物块有支持力。'
    },
    {
      id: 'static-friction',
      name: '静摩擦力',
      symbol: 'f_s',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向上',
      reason: '物块有沿斜面向下滑动的趋势，因此受到沿斜面向上的静摩擦力。'
    }
  ],
  commonMistakes: [
    {
      id: 'mistake-downhill-force',
      name: '误画下滑力',
      feedback: '下滑力不是一个真实存在的力，它只是重力沿斜面方向的分力，不能作为单独受力画出。'
    },
    {
      id: 'mistake-normal-direction',
      name: '支持力方向错误',
      feedback: '支持力应垂直接触面并指向受力物体。本题中支持力应垂直斜面向上。'
    },
    {
      id: 'mistake-friction-direction',
      name: '摩擦力方向错误',
      feedback: '物块有沿斜面向下滑动的趋势，因此静摩擦力应沿斜面向上。'
    }
  ]
}
```

## 21. Antigravity 使用建议

在 Antigravity 中修改本项目时，应将本文档作为项目规则使用。

建议保存路径：

```text
.agents/rules/physics-coding-style.md
```

使用 Antigravity 生成或修改代码时，应要求它遵守以下原则：

```text
请严格遵守 .agents/rules/physics-coding-style.md：
1. 所有物理变量必须有明确命名和单位说明。
2. correctForces 中只能放真实存在的力。
3. 分力、合力、效果力不能作为独立受力加入 correctForces。
4. 所有物理计算函数必须包含公式注释。
5. 面向学生的反馈必须解释错误原因，而不是只给结论。
6. 场景数据必须包含施力物体、受力物体、方向和原因。
```

## 22. 版本维护

当项目新增以下内容时，应同步更新本文档：

- 新增物理模型。
- 新增力的类型。
- 新增场景数据字段。
- 新增物理计算工具函数。
- 修改受力分析验证逻辑。
- 修改画布绘制规则。
- 修改测试规范。

当前规范适用于：

```text
项目：physics-force-analysis
方向：高中物理受力分析交互学习
技术栈：Vue 3 + Vite + matter.js
```
