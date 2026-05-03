# /add-scenario

## Workflow Name

add-scenario

## Trigger

/add-scenario

## Description

为 `physics-force-analysis` 项目添加新的高中物理受力分析学习场景，包括场景数据、正确受力、常见错误、分步引导和必要的注册逻辑。

## User Input

请从用户输入中提取以下信息：

- 场景名称
- 场景类型
- 研究对象
- 物理参数
- 学习目标
- 是否需要新增组件或只新增数据

如果用户没有提供完整信息，请先提出必要的澄清问题，不要直接编造复杂物理场景。

## Prompt

你正在维护 `physics-force-analysis` 项目。

这是一个面向高中生的高中物理受力分析交互学习项目，技术栈为 Vue 3 + Vite + matter.js。项目通过网页交互动画帮助学生学习受力分析。

请根据用户需求添加一个新的物理受力分析场景。

你必须遵守以下项目规则：

1. 遵守 `.agents/rules/physics-coding-style.md`。
2. 遵守 `.agents/rules/documentation-rules.md`。
3. `correctForces` 中只能放真实存在的力。
4. 不得把“下滑力”“合力”“向心力”“重力分力”“加速度方向上的力”作为独立真实受力放入 `correctForces`。
5. 每个真实受力必须包含 `id`、`name`、`symbol`、`origin`、`target`、`direction`、`reason`。
6. 面向学生的解释必须通俗，适合高中生理解。
7. 所有物理参数必须标明单位。
8. 所有涉及公式的地方必须说明公式含义。
9. 必须添加常见错误 `commonMistakes`。
10. 必须添加分步引导 `steps`。

## Task

请完成以下任务。

### 1. 分析现有项目结构

先查看以下目录和文件：

- `src/data/`
- `src/data/scenarios/`
- `src/views/LearningView.vue`
- `src/components/ForceCanvas.vue`
- `src/components/StepGuide.vue`
- `src/components/ControlPanel.vue`
- `src/physics/engine.js`

确认当前项目的场景数据结构、导入方式、注册方式和画布展示方式。

### 2. 新增场景数据

在合适的位置新增场景文件，或者在现有场景文件中追加新场景。

场景数据必须包含以下结构：

```javascript
export const scenarioName = {
  id: '',
  title: '',
  description: '',
  difficulty: '',
  category: '',
  learningGoals: [],
  physicsParams: {
    mass: 0,
    angle: 0,
    mu_s: 0,
    mu_k: 0,
    g: 9.8
  },
  targetObject: {
    id: '',
    name: '',
    type: '',
    dimensions: {}
  },
  correctForces: [
    {
      id: '',
      name: '',
      symbol: '',
      origin: '',
      target: '',
      direction: '',
      reason: ''
    }
  ],
  commonMistakes: [
    {
      id: '',
      name: '',
      feedback: ''
    }
  ],
  steps: [
    {
      id: '',
      title: '',
      content: '',
      action: '',
      target: '',
      forceId: '',
      options: [],
      reason: ''
    }
  ]
}
```

如果现有项目结构与上述结构不完全一致，请优先保持现有项目风格，但必须保留以下核心字段：

- `id`
- `title`
- `description`
- `physicsParams`
- `targetObject`
- `correctForces`
- `commonMistakes`
- `steps`

### 3. 场景数据要求

新增场景必须满足：

1. `id` 使用 kebab-case，例如 `horizontal-block-pulled`。
2. `title` 使用中文，适合学生阅读。
3. `description` 简洁说明题目情境。
4. `physicsParams` 中的物理量必须能解释单位。
5. `targetObject` 必须明确研究对象。
6. `correctForces` 只包含研究对象真实受到的力。
7. 每个力必须写明施力物体和受力物体。
8. 每个力的方向必须具体，例如“竖直向下”“垂直斜面向上”“沿斜面向上”。
9. `commonMistakes` 至少包含 3 个常见错误。
10. `steps` 应按照受力分析流程设计。

### 4. 标准受力分析步骤

优先使用以下步骤设计：

1. 选择研究对象。
2. 判断是否受重力。
3. 寻找接触物体。
4. 判断支持力或弹力。
5. 判断是否存在摩擦力。
6. 判断摩擦力方向。
7. 检查是否多画或漏画力。

### 5. 注册场景

根据项目现有结构，将新场景注册到场景列表中。

通常需要检查并修改：

- `src/data/scenarios/index.js`
- `src/views/LearningView.vue`
- 其他实际负责场景列表的文件

如果项目没有统一的 `index.js`，请按照现有导入方式处理。

### 6. 更新画布或控制面板

如果新场景引入了新的模型类型，例如滑轮、弹簧、连接体、水平面、圆周运动等，请检查：

- `ForceCanvas.vue` 是否能正确绘制该模型。
- `ControlPanel.vue` 是否需要新增参数控制。
- `engine.js` 是否需要新增物理模型逻辑。

如果需要新增逻辑，请保持最小修改，不要大规模重构。

### 7. 添加文档注释

为新增场景添加注释，说明：

- 教学目标
- 研究对象
- 物理参数和单位
- 正确受力
- 常见错误
- 教学重点

### 8. 自检

完成后请输出自检报告，包含：

```markdown
## 新增场景自检报告

### 场景信息

- 场景 ID：
- 场景标题：
- 研究对象：
- 场景分类：
- 难度：

### 正确受力

| 力 | 施力物体 | 受力物体 | 方向 | 是否真实受力 |
| --- | --- | --- | --- | --- |

### 常见错误

| 错误 | 反馈是否解释原因 |
| --- | --- |

### 修改文件

- 

### 是否需要后续测试

- 
```

## Output Requirements

完成任务后，请输出：

1. 修改了哪些文件。
2. 新增场景的完整数据。
3. 是否修改了画布、控制面板或物理引擎。
4. 物理正确性自检结果。
5. 建议补充的测试用例。
