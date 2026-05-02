/**
 * 场景：粗糙斜面上的物块（有摩擦加速下滑）
 */
export const inclineBlockFrictionScenario = {
  id: 'incline-block-friction-down',
  title: '粗糙斜面上加速下滑的物块',
  description: '一个物块在倾角为 θ 的粗糙斜面上加速下滑，分析其受力情况。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_k: 0.2, // 动摩擦因数较小，保证能加速下滑
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
      reason: '物块相对斜面向下运动，受到阻碍相对运动的滑动摩擦力。'
    }
  ],

  commonMistakes: [
    {
      id: 'static-friction',
      name: '认为是静摩擦力',
      feedback: '错误！物块已经在斜面上滑动了，所以受到的是滑动摩擦力，而不是静摩擦力。'
    },
    {
      id: 'friction-wrong-direction',
      name: '摩擦力方向画反',
      feedback: '错误！滑动摩擦力总是阻碍物体的相对运动。物块相对斜面向下运动，所以摩擦力方向应该沿斜面向上。'
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
      id: 'judge-friction-type',
      title: '第四步：判断摩擦力类型',
      content: '物块正在粗糙斜面上加速下滑，它受到的是哪种摩擦力？',
      options: [
        { text: '静摩擦力', correct: false, mistakeId: 'static-friction' },
        { text: '滑动摩擦力', correct: true, reason: '正确。因为物体之间发生了相对滑动。' }
      ]
    },
    {
      id: 'judge-friction-dir',
      title: '第五步：判断滑动摩擦力方向',
      content: '滑动摩擦力的方向是？',
      options: [
        { text: '沿斜面向下', correct: false, mistakeId: 'friction-wrong-direction' },
        { text: '沿斜面向上', correct: true },
        { text: '水平向左', correct: false }
      ],
      forceId: 'kinetic-friction-up'
    }
  ]
};
