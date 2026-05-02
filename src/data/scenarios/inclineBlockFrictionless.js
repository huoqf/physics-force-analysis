/**
 * 场景：光滑斜面上的物块（无摩擦下滑）
 */
export const inclineBlockFrictionlessScenario = {
  id: 'incline-block-frictionless',
  title: '光滑斜面上的物块（无摩擦）',
  description: '一个物块在倾角为 θ 的绝对光滑斜面上自由下滑，分析其受力情况。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_s: 0.0,
    mu_k: 0.0,
    g: 9.8
  },

  motion: {
    direction: 'down-incline',
    label: 'v'
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
      reason: '受地球吸引产生，竖直向下。'
    },
    {
      id: 'normal-force',
      name: '斜面的支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块挤压斜面产生的弹力，垂直于接触面向上。'
    }
  ],

  commonMistakes: [
    {
      id: 'downward-sliding-force',
      name: '下滑力',
      feedback: '错误！不存在“下滑力”。所谓的下滑力实际上是重力沿斜面向下的分力，受力分析时不能把分力和合力同时画出。'
    },
    {
      id: 'static-friction',
      name: '静摩擦力',
      feedback: '错误！题目已经说明是“光滑斜面”，不存在摩擦力。'
    },
    {
      id: 'kinetic-friction',
      name: '动摩擦力',
      feedback: '错误！题目已经说明是“光滑斜面”，不存在摩擦力。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的物块，确定本次受力分析的研究对象。',
      action: 'click',
      target: 'block',
      reason: '选择正确。进行受力分析必须先明确研究对象。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析场力（重力）',
      content: '物块受到的重力方向如何？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false },
        { text: '沿斜面向下', correct: false, mistakeId: 'downward-sliding-force' }
      ],
      forceId: 'gravity'
    },
    {
      id: 'judge-normal-force',
      title: '第三步：分析弹力（支持力）',
      content: '物块与斜面接触并产生挤压，斜面对物块的支持力方向是？',
      options: [
        { text: '竖直向上', correct: false },
        { text: '垂直斜面向上', correct: true },
        { text: '垂直斜面向下', correct: false }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction',
      title: '第四步：判断摩擦力',
      content: '物块在光滑斜面上下滑，它受摩擦力吗？',
      options: [
        { text: '受沿斜面向上的动摩擦力', correct: false, mistakeId: 'kinetic-friction' },
        { text: '受沿斜面向下的动摩擦力', correct: false, mistakeId: 'kinetic-friction' },
        { text: '不受摩擦力', correct: true, reason: '非常正确！光滑斜面意味着接触面没有粗糙度，因此没有摩擦力。' }
      ]
    },
    {
      id: 'judge-sliding-force',
      title: '第五步：检查是否遗漏',
      content: '物块在加速下滑，是否需要额外画出一个向下的“下滑力”或“动力”？',
      options: [
        { text: '需要', correct: false, mistakeId: 'downward-sliding-force' },
        { text: '不需要', correct: true, reason: '完美！物块之所以加速下滑，是因为重力在沿斜面方向的分力提供了加速度，不需要额外画一个不存在的“下滑力”。' }
      ]
    }
  ]
};
