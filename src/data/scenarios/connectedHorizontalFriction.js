/**
 * 场景：轻绳连接两物体（粗糙水平面）
 */
export const connectedHorizontalFrictionScenario = {
  id: 'connected-horizontal-friction',
  type: 'horizontal-connected',
  title: '粗糙水平面上两物体连接',
  description: '两物块A和B放在粗糙水平面上，由轻绳连接。用水平向右的外力F拉动B，系统向右加速。此时F必须克服两物块的摩擦力，绳子的拉力T与无摩擦时有何不同？',
  
  physicsParams: {
    massA: 2.0,
    massB: 3.0,
    forceF: 30.0,
    mu_k: 0.2,
    angle: 0,
    g: 9.8
  },

  targetObject: {
    id: 'blockB',
    name: '物块B',
    type: 'rectangle'
  },

  motion: {
    direction: 'right-horizontal',
    label: 'a'
  },

  correctForces: [
    { id: 'gravity-B', name: '物块B重力', symbol: 'G_B', origin: '地球', target: '物块B', direction: '竖直向下', reason: '地球引力产生。' },
    { id: 'normal-force-B', name: '水平面支持力', symbol: 'F_N', origin: '水平面', target: '物块B', direction: '竖直向上', reason: '水平面对B的支持力。' },
    { id: 'external-force-F', name: '水平外力F', symbol: 'F', origin: '外部', target: '物块B', direction: '水平向右', reason: '拉动整体向右的动力。' },
    { id: 'tension-left', name: '绳子拉力T', symbol: 'T', origin: '轻绳', target: '物块B', direction: '水平向左', reason: '轻绳产生的拉力。' },
    { id: 'kinetic-friction-B', name: '滑动摩擦力', symbol: 'f_B', origin: '水平面', target: '物块B', direction: '水平向左', reason: 'B相对地面向右滑动，受向左滑动摩擦力。' }
  ],

  commonMistakes: [
    { id: 'missing-friction', name: '漏画摩擦力', feedback: '错误！粗糙表面且有相对滑动，必定有滑动摩擦力。' },
    { id: 'tension-equals-friction', name: '认为拉力等于摩擦力', feedback: '错误！B不仅要克服摩擦力，还要与A共同加速，因此 T + f_B < F。' }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击物块B作为研究对象。',
      action: 'click',
      target: 'blockB',
      reason: '隔离B可求出轻绳对B的拉力。'
    },
    {
      id: 'judge-gravity-normal',
      title: '第二步：竖直方向分析',
      content: '确认竖直方向受力情况。',
      options: [
        { text: '标出重力和支持力', correct: true }
      ],
      forceId: 'gravity-B'
    },
    {
      id: 'force-normal',
      title: '标出支持力',
      content: '标出支持力',
      options: [{ text: '标出支持力', correct: true }],
      forceId: 'normal-force-B'
    },
    {
      id: 'judge-horizontal',
      title: '第三步：水平方向动力与阻力',
      content: 'B在水平方向受到哪些力？',
      options: [
        { text: '仅受F和绳子拉力T', correct: false, mistakeId: 'missing-friction' },
        { text: '受F、拉力T以及向左的摩擦力', correct: true, reason: '正确！接触面粗糙且相对滑动，滑动摩擦力向左。' }
      ]
    },
    {
      id: 'add-f',
      title: '标出外力F',
      content: '确认水平外力F。',
      options: [{ text: '标出F', correct: true }],
      forceId: 'external-force-F'
    },
    {
      id: 'add-t',
      title: '标出张力T',
      content: '确认拉力T。',
      options: [{ text: '标出T', correct: true }],
      forceId: 'tension-left'
    },
    {
      id: 'add-friction',
      title: '标出摩擦力',
      content: '确认摩擦力f_B。',
      options: [{ text: '标出滑动摩擦力', correct: true }],
      forceId: 'kinetic-friction-B'
    },
    {
      id: 'conclusion',
      title: '第四步：比较张力大小',
      content: '在粗糙水平面上，只要A和B的动摩擦因数相同，内部拉力T = m_A * F / (m_A + m_B)，与摩擦因数无关！你觉得这个结论神奇吗？',
      options: [
        { text: '明白了，张力由质量分配决定', correct: true, reason: '正确！通过列方程推导可以发现，不论整体是否有摩擦，只要摩擦系数相同，绳子拉力的表达式相同。' }
      ]
    }
  ]
};
