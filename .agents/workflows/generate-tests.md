# /generate-tests

## Workflow Name

generate-tests

## Trigger

/generate-tests

## Description

为 `physics-force-analysis` 项目的 Vue 组件、物理计算函数、场景数据或交互流程生成 Vitest 单元测试，目标覆盖率不低于 80%。

## User Input

请从用户输入中提取以下信息：

- 要测试的目标文件
- 测试类型：组件测试、物理函数测试、场景数据测试、集成测试
- 是否需要创建测试配置
- 是否要求覆盖率报告

如果用户没有指定目标文件，请优先建议测试以下文件：

- `src/components/ForceCanvas.vue`
- `src/components/StepGuide.vue`
- `src/components/ControlPanel.vue`
- `src/views/LearningView.vue`
- `src/physics/engine.js`
- `src/data/scenarios/`

## Prompt

你正在维护 `physics-force-analysis` 项目。

这是一个面向高中生的高中物理受力分析交互学习项目，技术栈为 Vue 3 + Vite + matter.js。

请为用户指定的目标文件生成 Vitest 单元测试，目标覆盖率不低于 80%。

你必须遵守以下规则：

1. 遵守 `.agents/rules/physics-coding-style.md`。
2. 遵守 `.agents/rules/documentation-rules.md`。
3. 测试名称必须描述具体行为，不要使用 `test 1` 之类的名称。
4. 涉及物理计算时，必须在测试注释中说明输入单位和预期单位。
5. 对高中物理受力分析逻辑进行测试时，必须区分真实受力和分力。
6. 测试应覆盖正常情况、边界情况和错误情况。
7. 不要为了通过测试而修改业务逻辑，除非发现明确 bug。
8. 如果需要修改业务代码，必须说明原因。

## Task

请完成以下任务。

### 1. 检查测试环境

先检查项目中是否已经配置测试工具：

- `package.json`
- `vite.config.js`
- `vitest.config.js`
- `src/**/*.test.js`
- `src/**/__tests__/`

如果尚未配置 Vitest，请添加或建议添加以下依赖：

```bash
npm install -D vitest @vue/test-utils jsdom @testing-library/vue @vitest/coverage-v8
```

并在 `package.json` 中添加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

如果项目已经有测试配置，请优先保持现有风格。

### 2. 配置 Vitest

如果 `vite.config.js` 中没有测试配置，请添加：

```javascript
test: {
  globals: true,
  environment: 'jsdom',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
}
```

如果当前 Vitest 版本使用 `threshold` 而不是 `thresholds`，请根据实际版本调整。

### 3. 为 Vue 组件生成测试

如果目标是 Vue 组件，请使用：

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
```

组件测试至少覆盖：

1. 组件能正常渲染。
2. Props 能正确传入。
3. 关键文本能显示。
4. 用户交互能触发正确事件。
5. 边界 Props 不会导致组件崩溃。
6. 与受力分析相关的状态能正确变化。

### 4. 为 ForceCanvas.vue 生成测试时

重点测试：

1. Canvas 是否渲染。
2. `scenario` 为空或缺字段时是否安全处理。
3. `confirmedForces` 包含某个受力时是否尝试绘制对应箭头。
4. 点击画布时是否触发 `object-clicked`。
5. 速度箭头和受力箭头是否区分。
6. 不应把速度、加速度作为真实受力处理。

需要 mock Canvas API，例如：

```javascript
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  closePath: vi.fn(),
  setLineDash: vi.fn(),
  measureText: vi.fn(() => ({ width: 20 }))
}))
```

### 5. 为 StepGuide.vue 生成测试时

重点测试：

1. 当前步骤标题和内容显示。
2. 选择正确选项时显示正确反馈。
3. 选择错误选项时显示错误反馈。
4. 确认受力时触发 `force-confirmed`。
5. 提交答案时触发 `answer-submitted`。
6. 漏选、多选、错选时能给出反馈。
7. 最后一步能触发场景完成事件。

### 6. 为 ControlPanel.vue 生成测试时

重点测试：

1. 参数初始值显示正确。
2. 修改质量、角度、摩擦因数等参数时触发 `params-changed`。
3. 参数边界值处理正确。
4. 不同场景类型下显示对应控制项。
5. 非法输入不会破坏状态。

### 7. 为物理计算函数生成测试

如果目标是物理函数，请测试：

1. 重力：`G = m * g`
2. 斜面方向分力：`F_parallel = m * g * sin(theta)`
3. 垂直斜面分力：`F_perpendicular = m * g * cos(theta)`
4. 最大静摩擦力：`f_s_max = μs * F_N`
5. 动摩擦力：`f_k = μk * F_N`
6. 滑动判断：`F_parallel > f_s_max`
7. 平衡判断：`ΣF = 0`

测试示例：

```javascript
it('能够计算 2 kg 物块在 30° 斜面上的重力沿斜面分力', () => {
  // mass = 2 kg, angle = 30°, g = 9.8 m/s²
  // F_parallel = 2 * 9.8 * sin(30°) = 9.8 N
  const result = calculateGravityParallel(2, 30, 9.8)

  expect(result).toBeCloseTo(9.8, 2)
})
```

### 8. 为场景数据生成测试

如果目标是 `src/data/scenarios/`，请测试：

1. 每个场景都有 `id`。
2. 每个场景都有 `title`。
3. 每个场景都有 `targetObject`。
4. 每个场景都有 `correctForces`。
5. `correctForces` 中每个力都有 `origin`、`target`、`direction`、`reason`。
6. `correctForces` 不包含 “下滑力”“合力”“重力分力”等错误真实力。
7. 每个场景至少包含一个教学步骤。
8. 每个常见错误都有反馈说明。

### 9. 覆盖率目标

生成测试后，请尝试运行：

```bash
npm run test:coverage
```

如果无法运行，请说明原因。

目标：

- statements >= 80%
- branches >= 80%
- functions >= 80%
- lines >= 80%

### 10. 输出测试报告

完成后输出：

```markdown
## 测试生成报告

### 目标文件

- 

### 新增或修改文件

- 

### 测试覆盖内容

- 

### 需要 mock 的对象

- 

### 推荐运行命令

```bash
npm run test
npm run test:coverage
```

### 覆盖率目标

| 类型 | 目标 |
| --- | --- |
| statements | 80% |
| branches | 80% |
| functions | 80% |
| lines | 80% |

### 后续建议

- 
```

## Output Requirements

完成任务后，请输出：

1. 测试文件路径。
2. 测试内容摘要。
3. 是否修改了测试配置。
4. 如何运行测试。
5. 当前测试可能覆盖不到的风险点。
