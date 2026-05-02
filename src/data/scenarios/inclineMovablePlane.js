/**
 * 场景：可动斜面（光滑水平面）—— 分析斜面
 */
export const inclineMovablePlaneScenario = {
  id: 'incline-movable-plane',
  title: '可动斜面上的物块（分析斜面）',
  description: '斜面置于光滑水平地面上，物块放于光滑斜面上。分析斜面的受力情况。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_s: 0.0,
    g: 9.8
  },

  targetObject: {
    id: 'incline',
    name: '斜面',
    type: 'polygon'
  },

  correctForces: [
    {
      id: 'incline-gravity',
      name: '斜面重力',
      symbol: 'G',
      origin: '地球',
      target: '斜面',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生。'
    },
    {
      id: 'ground-normal',
      name: '地面的支持力',
      symbol: 'F_N地',
      origin: '地面',
      target: '斜面',
      direction: '竖直向上',
      reason: '斜面挤压地面，地面对斜面产生竖直向上的弹力。'
    },
    {
      id: 'block-pressure',
      name: '物块的压力',
      symbol: 'F_N物',
      origin: '物块',
      target: '斜面',
      direction: '垂直斜面向下',
      reason: '物块挤压斜面，这是斜面对物块支持力的反作用力（牛顿第三定律）。'
    }
  ],

  commonMistakes: [
    {
      id: 'ground-friction-movable',
      name: '认为地面有摩擦力',
      feedback: '错误！注意地面是光滑的，所以地面对斜面没有摩擦力。'
    },
    {
      id: 'block-friction-on-plane',
      name: '认为物块给斜面摩擦力',
      feedback: '错误！由于斜面光滑（无摩擦），物块与斜面之间没有摩擦力，物块对斜面也就不存在摩擦力。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的斜面，以斜面为研究对象。',
      action: 'click',
      target: 'incline',
      reason: '正确。我们现在分析的研究对象是斜面。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析重力',
      content: '斜面的重力方向是？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false }
      ],
      forceId: 'incline-gravity'
    },
    {
      id: 'judge-ground-normal',
      title: '第三步：分析地面的支持力',
      content: '斜面与地面接触并有挤压，地面对斜面的支持力方向是？',
      options: [
        { text: '竖直向上', correct: true },
        { text: '垂直斜面向上', correct: false }
      ],
      forceId: 'ground-normal'
    },
    {
      id: 'judge-block-pressure',
      title: '第四步：分析物块的压力',
      content: '物块压在斜面上，物块对斜面的压力方向是？',
      options: [
        { text: '垂直斜面向下', correct: true },
        { text: '竖直向下', correct: false }
      ],
      forceId: 'block-pressure'
    },
    {
      id: 'judge-friction',
      title: '第五步：判断各接触面摩擦力',
      content: '斜面与地面之间是否有摩擦力？物块与斜面之间是否有摩擦力？',
      options: [
        { text: '两处都有摩擦力', correct: false, mistakeId: 'ground-friction-movable' },
        { text: '两处都没有摩擦力', correct: true, reason: '完美！地面光滑，物块与斜面也光滑，所以两处都没有摩擦力。斜面在水平方向上所受合力等于物块压力的水平分量，正是这个力使斜面向右加速。' },
        { text: '只有地面对斜面有摩擦力', correct: false, mistakeId: 'ground-friction-movable' }
      ]
    }
  ]
};
