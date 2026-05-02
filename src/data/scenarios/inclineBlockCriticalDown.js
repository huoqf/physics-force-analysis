/**
 * 场景：临界下滑状态（静摩擦力达最大值）
 * 高中核心难点：静摩擦力最大值与动摩擦力的关系
 * 条件：tan θ = μs，物块恰好处于即将下滑的临界状态
 */
export const inclineBlockCriticalDownScenario = {
  id: 'incline-block-critical-down',
  title: '即将下滑的临界状态（最大静摩擦力）',
  description: '倾角 θ 恰好等于临界角（tan θ = μs = 0.577），物块在斜面上处于即将下滑的临界状态。此时静摩擦力达到最大值。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30, // tan30° ≈ 0.577
    mu_s: 0.577,
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
      id: 'max-static-friction',
      name: '最大静摩擦力',
      symbol: 'f_s_max',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向上',
      reason: '物块恰好处于临界状态，静摩擦力达到最大值 f_smax = μs·F_N = μs·mg·cosθ。此时 f_smax 刚好等于 mg·sinθ，任何微小扰动都会导致下滑。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-equals-kinetic',
      name: '认为最大静摩擦力等于动摩擦力',
      feedback: '注意！最大静摩擦力（临界值）在数值上近似等于动摩擦力，但它们是不同的概念。静摩擦力可以从零到最大值范围内取值，动摩擦力是固定的 μk·FN。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击物块。',
      action: 'click',
      target: 'block',
      reason: '正确。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析重力',
      content: '重力方向是？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false }
      ],
      forceId: 'gravity'
    },
    {
      id: 'judge-normal-force',
      title: '第三步：分析支持力',
      content: '支持力方向是？',
      options: [
        { text: '垂直斜面向上', correct: true },
        { text: '竖直向上', correct: false }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction',
      title: '第四步：判断摩擦力（核心！）',
      content: '物块处于即将下滑的临界状态，它所受静摩擦力的情况是？',
      options: [
        { text: '不受摩擦力', correct: false },
        { text: '受沿斜面向上的静摩擦力，且大小等于 mg·sinθ', correct: true, reason: '正确！在临界状态下：沿斜面平衡，f_s = mg·sinθ；此时 f_s 正好等于 f_smax = μs·mg·cosθ，即 tan θ = μs。' },
        { text: '受沿斜面向上的最大静摩擦力，大小是 μk·FN', correct: false, mistakeId: 'friction-equals-kinetic' }
      ],
      forceId: 'max-static-friction'
    },
    {
      id: 'judge-critical-angle',
      title: '第五步：理解临界角公式',
      content: '在临界状态下，mg·sinθ = μs·mg·cosθ，化简后得到？',
      options: [
        { text: 'tan θ = μk（动摩擦因数）', correct: false },
        { text: 'sin θ = μs', correct: false },
        { text: 'tan θ = μs（静摩擦因数）', correct: true, reason: '完美！这就是"临界角公式"。当 tan θ > μs 时物块开始下滑，当 tan θ ≤ μs 时静止（静摩擦力未达最大值）。这是高中物理的重要考点。' }
      ]
    }
  ]
};
