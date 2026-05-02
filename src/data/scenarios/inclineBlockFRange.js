/**
 * 场景：水平力 F 的范围分析（临界上滑与临界下滑）
 * 高中物理难点：用水平力维持物块在斜面上静止，分析 F 的范围
 * 要求学生分析两个临界状态：F_min（即将下滑）和 F_max（即将上滑）
 */
export const inclineBlockFRangeScenario = {
  id: 'incline-block-f-range',
  title: '水平力 F 的范围分析（临界状态）',
  description: '在倾角 θ=30° 的粗糙斜面上，用水平力 F 推住物块使其静止。分析 F 的最小值（即将下滑临界）和最大值（即将上滑临界）。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_s: 0.5,
    g: 9.8
  },

  targetObject: {
    id: 'block',
    name: '物块',
    type: 'rectangle',
    dimensions: { width: 60, height: 40 }
  },

  correctForces: [
    {
      id: 'gravity',
      name: '重力',
      symbol: 'G',
      origin: '地球',
      target: '物块',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生。'
    },
    {
      id: 'normal-force',
      name: '斜面的支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块挤压斜面，斜面对物块产生垂直于接触面向上的弹力。'
    },
    {
      id: 'horizontal-force',
      given: true,
      name: '水平推力',
      symbol: 'F',
      origin: '外部施力体',
      target: '物块',
      direction: '水平向右',
      reason: '题目给定的水平推力，大小待定（在某范围内变化）。'
    },
    {
      id: 'static-friction-variable',
      name: '静摩擦力',
      symbol: 'f_s',
      origin: '斜面',
      target: '物块',
      direction: '方向随 F 大小而变化',
      reason: '当 F 很小时，物块有下滑趋势，摩擦力向上；当 F 很大时，物块有上滑趋势，摩擦力向下；在某个特定的 F 值，摩擦力为零。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-fixed-direction',
      name: '认为摩擦力方向固定',
      feedback: '关键思维！摩擦力方向不是固定的，它随 F 的大小改变。当 F 小时物块趋势下滑，摩擦力向上；当 F 大时物块趋势上滑，摩擦力向下。这就是 F 有范围的根本原因。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击物块，分析受水平力作用的物块。',
      action: 'click',
      target: 'block',
      reason: '正确。'
    },
    {
      id: 'judge-constant-forces',
      title: '第二步：分析固定受力（重力、支持力、水平力）',
      content: '物块必然受到哪几个力（无论 F 多大）？',
      options: [
        { text: '重力、支持力、水平力 F', correct: true, reason: '正确。这三个力在任何 F 值下都存在。' },
        { text: '只有重力和支持力', correct: false },
        { text: '重力、支持力、水平力 F 和摩擦力', correct: false }
      ],
      forceId: 'gravity'
    },
    {
      id: 'judge-friction-direction-key',
      title: '第三步：摩擦力方向（核心难点！）',
      content: '静摩擦力的方向是确定的吗？',
      options: [
        { text: '一定沿斜面向上', correct: false, mistakeId: 'friction-fixed-direction' },
        { text: '一定沿斜面向下', correct: false, mistakeId: 'friction-fixed-direction' },
        { text: '不确定，与 F 的大小有关', correct: true, reason: '正确！这是本题的关键。F 较小时，物块趋势下滑，摩擦力向上；F 较大时，趋势上滑，摩擦力向下；某特定 F 值时，摩擦力为零。' }
      ],
      forceId: 'static-friction-variable'
    },
    {
      id: 'judge-fmin',
      title: '第四步：求 F 的最小值（临界下滑）',
      content: '当 F 达到最小值时，物块即将下滑，此时静摩擦力达到最大值且方向向上。沿斜面方向平衡，F_min 是？（θ=30°，μs=0.5，g=10）',
      options: [
        { text: 'F_min = mg(sinθ - μs·cosθ)/(cosθ + μs·sinθ)，约为 2.7N', correct: true, reason: '正确！这是用联立方程（沿斜面 + 垂直斜面）解出的 F_min。实际推导需要建立两个方向的平衡方程。' },
        { text: 'F_min = mg·tanθ', correct: false },
        { text: 'F_min = 0', correct: false }
      ]
    },
    {
      id: 'judge-fmax',
      title: '第五步：求 F 的最大值（临界上滑）',
      content: '当 F 达到最大值时，物块即将上滑，此时静摩擦力达到最大值且方向向下。F_max 是？',
      options: [
        { text: 'F_max = mg(sinθ + μs·cosθ)/(cosθ - μs·sinθ)，约为 17N', correct: true, reason: '完美！分子比 F_min 多了 μs·cosθ 项（因为摩擦力方向变了），这就是临界上滑与临界下滑不同之处。当 F 在 [F_min, F_max] 范围内，物块静止。' },
        { text: 'F_max = mg·tanθ + μs·mg', correct: false },
        { text: 'F_max = 2·F_min', correct: false }
      ]
    }
  ]
};
