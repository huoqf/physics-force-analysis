/**
 * 场景：物块受水平推力 F，在粗糙斜面上静止
 * 关键教学点：水平力会改变正压力大小，进而改变最大静摩擦力
 * 本题条件：F 使物块有上滑趋势，摩擦力方向沿斜面向下
 */
export const inclineBlockHorizontalForceScenario = {
  id: 'incline-block-horizontal-force',
  title: '受水平推力的静止物块（有上滑趋势）',
  description: '一个物块在粗糙斜面上，受到水平向右的外力 F 作用，F 较大使物块有上滑趋势但仍静止。',
  
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
      reason: '物块挤压斜面，斜面对物块产生垂直于接触面向上的弹力。注意：由于水平力 F 的存在，正压力会比无水平力时更大。'
    },
    {
      id: 'horizontal-force',
      given: true,
      name: '水平推力',
      symbol: 'F',
      origin: '外部施力体',
      target: '物块',
      direction: '水平向右',
      reason: '题目给定的水平向右的外力，大小较大使物块有上滑趋势。'
    },
    {
      id: 'static-friction-down',
      name: '静摩擦力',
      symbol: 'f_s',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向下',
      reason: '由于水平力较大，物块有沿斜面向上滑动的趋势，因此静摩擦力沿斜面向下阻碍趋势。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-up-wrong',
      name: '摩擦力画向上',
      feedback: '注意！当水平力 F 很大时，物块的相对运动趋势是沿斜面向上，此时静摩擦力方向应沿斜面向下。静摩擦力方向取决于运动趋势，不是固定的。'
    },
    {
      id: 'missing-horizontal',
      name: '漏画水平力',
      feedback: '错误！题目给定了水平向右的外力 F，这是已知的外力，必须画出来。'
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
      id: 'judge-horizontal-force',
      title: '第三步：分析已知外力',
      content: '题目给定了一个水平外力 F，它的方向是？',
      options: [
        { text: '水平向右（推向斜面）', correct: true },
        { text: '水平向左', correct: false }
      ],
      forceId: 'horizontal-force'
    },
    {
      id: 'judge-normal-force',
      title: '第四步：分析支持力',
      content: '斜面对物块的支持力方向是？（注意：加了水平力后，正压力大小会改变，但方向不变）',
      options: [
        { text: '竖直向上', correct: false },
        { text: '垂直斜面向上', correct: true }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction-dir',
      title: '第五步：判断摩擦力方向（关键！）',
      content: '水平力 F 较大，物块的相对运动趋势是沿斜面向上。那么静摩擦力的方向是？',
      options: [
        { text: '沿斜面向上', correct: false, mistakeId: 'friction-up-wrong' },
        { text: '沿斜面向下', correct: true, reason: '完全正确！静摩擦力阻碍相对运动趋势，趋势向上则摩擦力向下。这是此模型的核心难点。' },
        { text: '水平向左', correct: false }
      ],
      forceId: 'static-friction-down'
    },
    {
      id: 'judge-balance',
      title: '第六步：平衡方程验证',
      content: '物块静止（合力为零），沿斜面方向：F·cos θ（上）= G·sin θ（下）+ f_s（下），这说明什么？',
      options: [
        { text: 'F 越大，静摩擦力越大（沿斜面向下）', correct: true, reason: '非常深刻！静摩擦力大小由平衡条件决定，而不是固定的。F 越大，所需的向下摩擦力也越大，直到超过最大静摩擦力为止。' },
        { text: 'F 越大，静摩擦力越小', correct: false },
        { text: '摩擦力大小与 F 无关', correct: false }
      ]
    }
  ]
};
