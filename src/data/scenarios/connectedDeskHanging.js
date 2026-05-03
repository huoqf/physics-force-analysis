/**
 * 场景：一个在桌面上，一个悬挂
 */
export const connectedDeskHangingScenario = {
  id: 'connected-desk-hanging',
  type: 'desk-hanging-connected',
  title: '桌面与悬挂连接体',
  description: '物体A在光滑水平桌面上，物体B悬挂在桌边，两者由绕过光滑定滑轮的轻绳连接。释放后，B带动A共同加速运动。',
  
  physicsParams: {
    massA: 2.0,
    massB: 3.0,
    g: 9.8
  },

  targetObject: {
    id: 'blockB',
    name: '物块B',
    type: 'rectangle'
  },

  motion: {
    direction: 'down-vertical',
    label: 'a'
  },

  correctForces: [
    { id: 'gravity-B', name: '物块B重力', symbol: 'G_B', origin: '地球', target: '物块B', direction: '竖直向下', reason: '地球引力产生。' },
    { id: 'tension-up', name: '绳子向上拉力', symbol: 'T', origin: '轻绳', target: '物块B', direction: '竖直向上', reason: '轻绳对下方的物体产生向上的拉力。' }
  ],

  commonMistakes: [
    { id: 'tension-equals-gravity', name: '认为拉力等于悬挂物重力', feedback: '经典错误！很多人认为拉动A的力就是B的重力。实际上B正在向下加速，处于失重状态，拉力T必定小于m_B*g。' }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '我们将隔离悬挂物体B，分析其下落时的受力。请点击物块B。',
      action: 'click',
      target: 'blockB',
      reason: '选择B可以直观看到悬挂重力与拉力的关系。'
    },
    {
      id: 'judge-forces',
      title: '第二步：分析悬挂物B的受力',
      content: '悬挂物B受到哪些力？',
      options: [
        { text: '重力、绳子拉力和向下的加速力', correct: false },
        { text: '仅受重力和向上的绳子拉力', correct: true, reason: '正确！不存在所谓的“加速力”。' }
      ]
    },
    {
      id: 'add-gravity',
      title: '标出重力',
      content: '确认向下重力。',
      options: [{ text: '标出重力', correct: true }],
      forceId: 'gravity-B'
    },
    {
      id: 'add-tension',
      title: '标出拉力',
      content: '确认向上拉力。',
      options: [{ text: '标出拉力T', correct: true }],
      forceId: 'tension-up'
    },
    {
      id: 'judge-tension',
      title: '第三步：判断拉力大小',
      content: 'B带动A加速下落，此时绳子的拉力T与B的重力m_Bg是什么关系？',
      options: [
        { text: 'T = m_B * g', correct: false, mistakeId: 'tension-equals-gravity' },
        { text: 'T < m_B * g', correct: true, reason: '非常棒！因为B向下加速（失重），合力必须向下，即 m_B*g - T = m_B*a，所以 T 必定小于 B 的重力。' }
      ]
    }
  ]
};
