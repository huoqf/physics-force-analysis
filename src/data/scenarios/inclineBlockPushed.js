/**
 * 场景：受沿斜面向上的外力推动匀速上滑
 */
export const inclineBlockPushedScenario = {
  id: 'incline-block-pushed',
  title: '受外力推动匀速上滑的物块',
  description: '一个物块受到沿斜面向上的恒定外力 F 推动，在粗糙斜面上匀速上滑。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_k: 0.3,
    g: 9.8
  },

  motion: {
    direction: 'up-incline',
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
      id: 'push-force',
      given: true,
      name: '外力推力',
      symbol: 'F',
      origin: '外部推力源',
      target: '物块',
      direction: '沿斜面向上',
      reason: '题目给定的沿斜面向上的外力。'
    },
    {
      id: 'kinetic-friction-down',
      name: '滑动摩擦力',
      symbol: 'f_k',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向下',
      reason: '物块相对斜面向上滑动，受到阻碍相对运动的滑动摩擦力，方向沿斜面向下。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-wrong-direction',
      name: '摩擦力方向画反',
      feedback: '错误！滑动摩擦力方向与相对运动方向相反。物块正在向上滑动，摩擦力应该向下。'
    },
    {
      id: 'missing-push',
      name: '漏画推力',
      feedback: '错误！不要忘记题目中给定的外力 F。'
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
      id: 'judge-push-force',
      title: '第四步：分析已知外力',
      content: '题目中提到有外力推动，它的方向是？',
      options: [
        { text: '沿斜面向下', correct: false, mistakeId: 'missing-push' },
        { text: '水平向右', correct: false },
        { text: '沿斜面向上', correct: true }
      ],
      forceId: 'push-force'
    },
    {
      id: 'judge-friction-dir',
      title: '第五步：判断摩擦力方向',
      content: '物块正在沿斜面向上运动，滑动摩擦力的方向应该是？',
      options: [
        { text: '沿斜面向上', correct: false, mistakeId: 'friction-wrong-direction' },
        { text: '沿斜面向下', correct: true, reason: '正确！摩擦力总是阻碍物体间的相对运动。' }
      ],
      forceId: 'kinetic-friction-down'
    },
    {
      id: 'judge-balance',
      title: '第六步：多力平衡分析',
      content: '物块正在匀速上滑，说明合力为零。沿斜面方向上，推力 F 的大小等于什么？',
      options: [
        { text: 'F = f_k', correct: false },
        { text: 'F = G_x (重力分力)', correct: false },
        { text: 'F = G_x + f_k', correct: true, reason: '完美！匀速运动时受力平衡，向上的推力必须克服向下的重力分力和滑动摩擦力。' }
      ]
    }
  ]
};
