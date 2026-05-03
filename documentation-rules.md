# documentation-rules.md

# 项目文档规范：高中物理受力分析训练器

本文档用于规范 `physics-force-analysis` 项目的组件文档、函数注释、场景数据说明、README 更新和教学反馈文本。

本项目是面向高中生的物理受力分析交互学习项目，因此文档不仅要服务开发者，也要服务物理教学。所有文档和注释应做到：表达清楚、物理准确、单位明确、便于高中生理解。

## 1. 总体原则

### 1.1 文档必须说明“为什么”

本项目不是普通展示页面，而是教学型项目。文档不应只说明代码做了什么，还应说明这样设计的教学原因或物理原因。

推荐写法：

```javascript
/**
 * 显示静摩擦力箭头。
 *
 * 教学原因：
 * 物块有沿斜面向下滑动的趋势，因此静摩擦力沿斜面向上。
 */
```

不推荐写法：

```javascript
/**
 * 显示箭头。
 */
```

### 1.2 物理量必须带单位

涉及物理量的注释必须写明单位。

推荐：

```javascript
/**
 * @param {number} mass - 物体质量，单位 kg。
 * @param {number} angle - 斜面倾角，单位 °。
 * @returns {number} 支持力大小，单位 N。
 */
```

不推荐：

```javascript
/**
 * @param {number} mass - 质量。
 * @param {number} angle - 角度。
 */
```

### 1.3 面向学生的文本要通俗

用于页面展示、错误反馈、学习提示的文本应使用高中生容易理解的语言。

推荐：

```javascript
feedback: '支持力方向不是竖直向上，而是垂直接触面并指向受力物体。'
```

不推荐：

```javascript
feedback: '法向约束反力方向应沿接触面外法线方向。'
```

### 1.4 文档应与代码同步

当修改以下内容时，必须同步更新相关文档：

- 新增或删除组件。
- 新增场景。
- 修改场景数据结构。
- 修改受力验证逻辑。
- 新增物理公式。
- 修改物理参数含义。
- 新增测试命令或构建命令。

## 2. 组件文档规范

### 2.1 Vue 文件头部说明

每个核心 Vue 组件建议在文件顶部添加说明。

```vue
<!--
 * @file ForceCanvas.vue
 * @description 物理场景画布组件，用于绘制物体、斜面和受力箭头。
 * @module components/ForceCanvas
 *
 * 教学作用：
 * 帮助学生通过图像理解物体受到的真实力及其方向。
 *
 * 主要功能：
 * 1. 绘制斜面、物块等物理对象。
 * 2. 绘制重力、支持力、摩擦力等受力箭头。
 * 3. 支持点击物体选择研究对象。
 * 4. 根据学习步骤逐步显示受力。
-->
```

说明：

- `@file` 写文件名。
- `@description` 写组件功能。
- `@module` 写组件路径。
- “教学作用”说明该组件对学习目标的帮助。
- “主要功能”列出核心职责。

### 2.2 组件级 JSDoc 模板

在 `<script setup>` 开头添加组件级说明。

```vue
<script setup>
/**
 * ForceCanvas 组件
 *
 * 功能描述：
 * 渲染物理场景中的物体、斜面和受力箭头。
 *
 * 教学作用：
 * 帮助学生观察不同力的方向，并区分真实受力、速度方向和重力分力。
 *
 * 交互行为：
 * 1. 点击物体时触发 object-clicked 事件。
 * 2. 根据 confirmedForces 显示已经确认的受力。
 * 3. 根据 scenario 中的 correctForces 读取受力数据。
 *
 * 使用示例：
 * <ForceCanvas
 *   :scenario="currentScenario"
 *   :confirmed-forces="confirmedForces"
 *   @object-clicked="handleObjectClicked"
 * />
 */
</script>
```

### 2.3 组件 Props 注释规范

Props 必须说明类型、含义和默认值。如果 Props 涉及物理量，必须写明单位。

```javascript
const props = defineProps({
  /**
   * 当前物理学习场景。
   *
   * 包含场景标题、物理参数、研究对象、正确受力列表、常见错误和教学步骤。
   */
  scenario: {
    type: Object,
    required: true
  },

  /**
   * 已经确认显示的受力 ID 列表。
   *
   * 示例：
   * ['gravity', 'normal-force', 'static-friction']
   */
  confirmedForces: {
    type: Array,
    default: () => []
  },

  /**
   * 当前选中的研究对象 ID。
   *
   * 示例：
   * block 表示物块，incline 表示斜面。
   */
  selectedObjectId: {
    type: String,
    default: ''
  }
})
```

### 2.4 组件 Events 注释规范

每个 `emit` 事件都应说明触发时机和参数。

```javascript
const emit = defineEmits([
  /**
   * 用户点击画布中的物体时触发。
   *
   * @event object-clicked
   * @param {string} objectId - 被点击物体的 ID，例如 block 或 incline。
   */
  'object-clicked',

  /**
   * 用户确认某个受力后触发。
   *
   * @event force-confirmed
   * @param {string} forceId - 被确认的受力 ID，例如 gravity。
   */
  'force-confirmed',

  /**
   * 用户提交最终受力分析答案时触发。
   *
   * @event answer-submitted
   * @param {Object} answer - 用户提交的答案对象。
   */
  'answer-submitted'
])
```

如果当前 Vue 语法不适合在 `defineEmits` 数组里写注释，也可以改成下面方式：

```javascript
/**
 * 组件事件：
 *
 * object-clicked:
 * - 触发时机：用户点击画布中的物体。
 * - 参数：objectId，被点击物体的 ID。
 *
 * force-confirmed:
 * - 触发时机：用户确认某个受力。
 * - 参数：forceId，被确认的受力 ID。
 *
 * answer-submitted:
 * - 触发时机：用户提交最终答案。
 * - 参数：answer，用户提交的受力分析结果。
 */
const emit = defineEmits([
  'object-clicked',
  'force-confirmed',
  'answer-submitted'
])
```

## 3. 函数文档规范

### 3.1 通用函数注释模板

普通函数应使用下面模板：

```javascript
/**
 * 函数名称或简短说明。
 *
 * 功能描述：
 * 说明该函数完成什么任务。
 *
 * 使用场景：
 * 说明该函数通常在什么组件或流程中被调用。
 *
 * @param {type} paramName - 参数说明。
 * @returns {type} 返回值说明。
 */
function exampleFunction(paramName) {
  // ...
}
```

### 3.2 物理计算函数注释模板

涉及物理计算的函数必须写明公式、单位和教学提醒。

```javascript
/**
 * 计算重力沿斜面方向的分力。
 *
 * 功能描述：
 * 根据物体质量、斜面角度和重力加速度，计算重力沿斜面方向的分力。
 *
 * 物理公式：
 * F_parallel = m * g * sin(theta)
 *
 * 物理含义：
 * 该值表示重力在沿斜面方向上的分量，用于判断物体是否有下滑趋势。
 *
 * 教学提醒：
 * 该分力不是一个独立存在的真实受力，不能直接作为“下滑力”画在受力图中。
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

### 3.3 判断类函数注释模板

判断类函数要写清楚判断条件。

```javascript
/**
 * 判断物块是否会沿斜面下滑。
 *
 * 判断条件：
 * - 若重力沿斜面方向的分力大于最大静摩擦力，则物块会下滑。
 * - 若重力沿斜面方向的分力小于或等于最大静摩擦力，则物块可以保持静止。
 *
 * 公式关系：
 * F_parallel > f_s_max 时下滑。
 *
 * @param {number} gravityParallel - 重力沿斜面方向的分力，单位 N。
 * @param {number} maxStaticFriction - 最大静摩擦力，单位 N。
 * @returns {boolean} 若物块会下滑，返回 true；否则返回 false。
 */
function willSlideDown(gravityParallel, maxStaticFriction) {
  return gravityParallel > maxStaticFriction
}
```

### 3.4 Canvas 绘制函数注释模板

绘制函数要说明坐标系、绘制对象和教学含义。

```javascript
/**
 * 绘制受力箭头。
 *
 * 功能描述：
 * 在 Canvas 上从指定起点绘制一个力的箭头，并显示力的符号。
 *
 * 坐标说明：
 * Canvas 坐标系中，x 轴向右为正，y 轴向下为正。
 *
 * 教学作用：
 * 用箭头方向帮助学生理解力的方向，用颜色区分不同类型的力。
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 绘图上下文。
 * @param {number} startX - 箭头起点 x 坐标，单位 px。
 * @param {number} startY - 箭头起点 y 坐标，单位 px。
 * @param {Object} force - 力对象，包含 id、name、symbol、direction 等字段。
 * @param {Object} options - 绘制选项。
 * @returns {void}
 */
function drawForceArrow(ctx, startX, startY, force, options = {}) {
  // ...
}
```

## 4. 场景数据文档规范

### 4.1 场景文件头部说明

每个场景文件应添加整体说明。

```javascript
/**
 * @file incline-block-static.js
 * @description 粗糙斜面上的静止物块场景数据。
 *
 * 教学目标：
 * 1. 理解斜面上物块受到重力、支持力和静摩擦力。
 * 2. 区分真实受力和重力分力。
 * 3. 判断静摩擦力方向。
 *
 * 适用知识点：
 * - 受力分析
 * - 斜面模型
 * - 静摩擦力
 * - 平衡条件
 */
```

### 4.2 单个场景注释模板

```javascript
/**
 * 场景：粗糙斜面上的静止物块。
 *
 * 场景描述：
 * 一个质量为 2 kg 的物块静止在倾角为 30° 的粗糙斜面上。
 *
 * 研究对象：
 * 物块。
 *
 * 物理参数：
 * - mass: 2.0 kg
 * - angle: 30°
 * - mu_s: 0.6，无单位
 * - g: 9.8 m/s²
 *
 * 正确受力：
 * 1. 重力 G：地球对物块的引力，方向竖直向下。
 * 2. 支持力 F_N：斜面对物块的支持力，方向垂直斜面向上。
 * 3. 静摩擦力 f_s：斜面对物块的摩擦力，方向沿斜面向上。
 *
 * 常见错误：
 * 1. 误画“下滑力”。
 * 2. 将支持力画成竖直向上。
 * 3. 将摩擦力方向画反。
 * 4. 漏画摩擦力。
 *
 * 教学重点：
 * 下滑力不是一个真实存在的力，它只是重力沿斜面方向的分力。
 */
export const inclineBlockStaticScenario = {
  // ...
}
```

### 4.3 correctForces 文档要求

`correctForces` 中每个力都必须能回答四个问题：

1. 这个力叫什么？
2. 施力物体是谁？
3. 受力物体是谁？
4. 为什么存在这个力？

示例：

```javascript
{
  id: 'normal-force',
  name: '支持力',
  symbol: 'F_N',
  origin: '斜面',
  target: '物块',
  direction: '垂直斜面向上',
  reason: '物块与斜面接触并相互挤压，因此斜面对物块产生支持力。'
}
```

### 4.4 commonMistakes 文档要求

`commonMistakes` 中的反馈必须包含：

1. 错在哪里。
2. 为什么错。
3. 正确判断方法。

示例：

```javascript
{
  id: 'mistake-normal-direction',
  name: '支持力方向错误',
  feedback: '支持力方向不是竖直向上，而是垂直接触面并指向受力物体。本题中物块在斜面上，因此支持力应垂直斜面向上。'
}
```

不推荐：

```javascript
{
  id: 'mistake-normal-direction',
  name: '支持力方向错误',
  feedback: '方向错了。'
}
```

### 4.5 steps 文档要求

每个步骤应说明“做什么”和“为什么”。

```javascript
{
  id: 'check-friction-direction',
  title: '判断摩擦力方向',
  content: '物块有沿斜面向下滑动的趋势，因此静摩擦力方向应沿斜面向上。',
  action: 'confirm-force',
  forceId: 'static-friction',
  reason: '静摩擦力总是阻碍相对运动趋势。'
}
```

## 5. README 文档规范

### 5.1 README 必须包含的内容

项目 README 应至少包含：

- 项目名称。
- 项目简介。
- 项目目标。
- 核心功能。
- 技术栈。
- 项目目录结构。
- 核心模块说明。
- 当前支持的学习场景。
- 本地运行方式。
- 测试方式。
- 后续优化方向。

### 5.2 README 更新时机

以下情况必须更新 README：

- 新增物理模型。
- 新增核心功能。
- 修改安装或运行命令。
- 新增测试命令。
- 修改目录结构。
- 新增 Antigravity 工作流。
- 变更项目定位。

### 5.3 README 表达要求

README 面向开发者、教师和学习者，应避免只写技术内容，也要说明教学价值。

推荐：

```markdown
本项目通过交互式受力箭头帮助学生理解“力必须有施力物体”这一核心原则。
```

不推荐：

```markdown
本项目使用 Canvas 绘制 arrow。
```

## 6. 测试文档规范

### 6.1 测试文件说明

测试文件顶部建议说明测试目标。

```javascript
/**
 * @file ForceCanvas.test.js
 * @description ForceCanvas 组件测试。
 *
 * 测试目标：
 * 1. 验证画布能正确渲染。
 * 2. 验证受力箭头能根据 confirmedForces 显示。
 * 3. 验证点击物体时能触发 object-clicked 事件。
 */
```

### 6.2 测试用例命名

测试用例名称应描述行为，而不是简单编号。

推荐：

```javascript
it('点击物块时应触发 object-clicked 事件', () => {
  // ...
})

it('当 confirmedForces 包含 gravity 时应显示重力箭头', () => {
  // ...
})
```

不推荐：

```javascript
it('test 1', () => {
  // ...
})
```

### 6.3 物理计算测试说明

物理计算测试必须说明输入单位和预期结果单位。

```javascript
it('能够计算 2 kg 物块在 30° 斜面上的重力沿斜面分力', () => {
  // mass = 2 kg, angle = 30°, g = 9.8 m/s²
  // F_parallel = 2 * 9.8 * sin(30°) = 9.8 N
  const result = calculateGravityParallel(2, 30, 9.8)

  expect(result).toBeCloseTo(9.8, 2)
})
```

## 7. 教学反馈文本规范

### 7.1 正确反馈

正确反馈要强化原因。

推荐：

```javascript
feedback: '正确。物块受到重力，方向竖直向下，施力物体是地球。'
```

不推荐：

```javascript
feedback: '答对了。'
```

### 7.2 错误反馈

错误反馈要温和、具体、可操作。

推荐：

```javascript
feedback: '这里不能画“下滑力”。下滑力不是一个新的真实受力，而是重力沿斜面方向的分力。受力图中应该画重力本身。'
```

不推荐：

```javascript
feedback: '错，不能这么画。'
```

### 7.3 提示文本

提示文本应帮助学生回到分析步骤。

推荐：

```javascript
hint: '先找施力物体。这个力是谁施加给物块的？如果找不到施力物体，就不能把它当作真实受力。'
```

不推荐：

```javascript
hint: '再想想。'
```

## 8. Antigravity 使用规则

当使用 Antigravity 生成或修改代码时，应要求它遵守本文档。

推荐提示词：

```text
请遵守 .agents/rules/documentation-rules.md：
1. 为新增组件添加组件说明、Props 注释和事件说明。
2. 为物理计算函数添加公式、单位和教学提醒。
3. 为场景数据添加教学目标、正确受力和常见错误说明。
4. 面向学生的反馈必须解释原因，不能只写“正确”或“错误”。
5. 修改 README、测试命令或场景结构时，同步更新文档。
```

### 8.1 生成组件时

可以这样要求 Antigravity：

```text
请为新增的 ForceSummaryPanel.vue 生成完整组件代码，并遵守 documentation-rules.md：
- 文件顶部要有组件说明。
- script setup 中要有组件级 JSDoc。
- Props 和 Events 要有注释。
- 面向学生展示的文本要通俗。
```

### 8.2 生成场景时

可以这样要求 Antigravity：

```text
请新增一个“水平面上受拉力的物块”场景，并遵守 documentation-rules.md：
- 场景数据前添加教学目标说明。
- correctForces 中每个力必须有 origin、target、direction、reason。
- commonMistakes 的 feedback 必须指出错误原因和正确判断方法。
```

### 8.3 生成测试时

可以这样要求 Antigravity：

```text
请为 StepGuide.vue 生成 Vitest 测试，并遵守 documentation-rules.md：
- 测试文件顶部写明测试目标。
- 测试用例名称要描述具体行为。
- 涉及物理计算时注明输入单位和预期单位。
```

## 9. 文档检查清单

每次提交前检查：

- [ ] 新增组件是否有组件说明。
- [ ] Props 是否写清楚类型和含义。
- [ ] Events 是否写清楚触发时机和参数。
- [ ] 物理函数是否写明公式。
- [ ] 物理函数是否写明参数单位和返回值单位。
- [ ] 场景数据是否写明教学目标。
- [ ] correctForces 是否写明施力物体和受力物体。
- [ ] commonMistakes 是否能解释错误原因。
- [ ] 学生反馈是否通俗易懂。
- [ ] README 是否与当前项目功能同步。
- [ ] 测试文件是否说明测试目标。
- [ ] Antigravity 工作流是否引用了正确的规则文件。

## 10. 推荐文件保存位置

```text
.agents/
├── rules/
│   ├── physics-coding-style.md
│   └── documentation-rules.md
├── references/
│   ├── physics-coding-style-full.md
│   └── documentation-rules-full.md
└── workflows/
    ├── add-scenario.md
    ├── generate-tests.md
    ├── add-docs.md
    └── validate-physics.md
```

如果担心规则文件过长，可以将本文档精简版放在：

```text
.agents/rules/documentation-rules.md
```

将更详细的扩展版放在：

```text
.agents/references/documentation-rules-full.md
```

## 11. 精简规则版本

如果需要更短的规则文件，可以只保留以下内容作为 `.agents/rules/documentation-rules.md`：

```markdown
# documentation-rules.md

# 项目文档规范

本项目是面向高中生的物理受力分析交互学习项目。所有文档、注释和反馈文本必须做到物理准确、表达清楚、单位明确、适合高中生理解。

## 核心要求

1. 新增组件必须添加组件说明。
2. Props 必须说明含义；涉及物理量时必须写单位。
3. Events 必须说明触发时机和参数。
4. 物理计算函数必须写明公式、参数单位、返回值单位和教学提醒。
5. 场景数据必须说明教学目标、研究对象、正确受力和常见错误。
6. correctForces 中每个力必须包含 origin、target、direction、reason。
7. commonMistakes 的 feedback 必须指出错误原因和正确判断方法。
8. 面向学生的文本必须通俗，不使用过度专业化表达。
9. 修改功能、场景、命令或目录结构时必须同步更新 README。
10. 测试文件应说明测试目标，测试用例名称应描述具体行为。

## 组件注释模板

```vue
<!--
 * @file ComponentName.vue
 * @description 组件功能说明。
 *
 * 教学作用：
 * 说明该组件如何帮助学生理解物理概念。
 *
 * 主要功能：
 * 1. 功能一。
 * 2. 功能二。
-->
```

## 物理函数注释模板

```javascript
/**
 * 计算某个物理量。
 *
 * 物理公式：
 * 写明公式。
 *
 * 教学提醒：
 * 说明该物理量是否是真实受力、分力或计算中间量。
 *
 * @param {number} mass - 物体质量，单位 kg。
 * @returns {number} 返回值说明，单位 N。
 */
function example() {}
```

## 场景数据注释要求

每个场景必须说明：

- 教学目标。
- 研究对象。
- 物理参数和单位。
- 正确受力。
- 常见错误。
- 教学重点。

## 学生反馈要求

正确反馈不能只写“正确”，错误反馈不能只写“错误”。

推荐：

```javascript
feedback: '这里不能画“下滑力”。下滑力不是一个真实受力，而是重力沿斜面方向的分力。'
```
```

## 12. 版本维护

当前文档适用于：

```text
项目：physics-force-analysis
方向：高中物理受力分析交互学习
技术栈：Vue 3 + Vite + matter.js
用途：组件注释、函数注释、场景文档、测试文档和 README 维护
```
