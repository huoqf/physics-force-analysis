/**
 * 场景：粗糙斜面上的匀速下滑物块
 */
export const inclineBlockUniformScenario = {
  id: 'incline-block-uniform',
  title: '粗糙斜面上匀速下滑的物块',
  description: '一个物块在倾角为 θ 的粗糙斜面上恰好匀速下滑，分析其受力及其关系。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_k: 0.577, // Math.tan(30 * Math.PI / 180) 恰好匀速
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
      reason: '受地球吸引产生。'
    },
    {
      id: 'normal-force',
      name: '斜面的支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块挤压斜面产生的弹力。'
    },
    {
      id: 'kinetic-friction-up',
      name: '滑动摩擦力',
      symbol: 'f_k',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向上',
      reason: '物块相对斜面向下运动，摩擦力沿斜面向上，且大小正好等于重力沿斜面的分力。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-wrong-size',
      name: '受力不平衡',
      feedback: '错误！匀速运动意味着合外力为零。沿斜面方向，向上的摩擦力必须等于向下的重力分力。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的物块，开始受力分析。',
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
      title: '第三步：分析弹力',
      content: '支持力方向是？',
      options: [
        { text: '竖直向上', correct: false },
        { text: '垂直斜面向上', correct: true }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction-dir',
      title: '第四步：判断摩擦力方向',
      content: '物块匀速下滑，滑动摩擦力的方向是？',
      options: [
        { text: '沿斜面向下', correct: false },
        { text: '沿斜面向上', correct: true }
      ],
      forceId: 'kinetic-friction-up'
    },
    {
      id: 'judge-balance',
      title: '第五步：受力平衡分析',
      content: '因为物块是“匀速”下滑，根据牛顿第一定律，以下哪个等式成立？（设重力沿斜面分力为 G_x）',
      options: [
        { text: 'G_x > f_k', correct: false, mistakeId: 'friction-wrong-size' },
        { text: 'G_x < f_k', correct: false, mistakeId: 'friction-wrong-size' },
        { text: 'G_x = f_k', correct: true, reason: '非常正确！匀速直线运动处于平衡状态，沿运动方向上的合力为零。' }
      ]
    }
  ]
};
