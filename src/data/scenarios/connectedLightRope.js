/**
 * 场景：轻绳连接两物体（水平面）
 */
export const connectedLightRopeScenario = {
  id: 'connected-light-rope-horizontal',
  type: 'horizontal-connected',
  title: '轻绳连接两物体（水平面）',
  description: '两个物块A和B放在光滑水平面上，由一根不可伸长的轻绳连接。用水平向右的外力F拉动B，分析它们的受力情况，体会“整体法与隔离法”的应用。',
  
  // 物理参数
  physicsParams: {
    massA: 2.0, // kg
    massB: 3.0, // kg
    forceF: 10.0, // N
    angle: 0, // 水平面
    g: 9.8
  },

  // 研究对象
  targetObject: {
    id: 'blockB',
    name: '物块B',
    type: 'rectangle'
  },

  // 运动状态
  motion: {
    direction: 'right-horizontal',
    label: 'a' // 加速度
  },

  // 正确的受力列表 (以隔离法分析B为例)
  // 虽然场景有A和B，但在此场景中我们聚焦在物块B的隔离分析上，以计算绳的张力。
  // 若需扩展，可在后续步骤里增加对A的分析，这里为了保持组件简单，只要求用户标出物块B的受力。
  correctForces: [
    {
      id: 'gravity-B',
      name: '物块B重力',
      symbol: 'G_B',
      origin: '地球',
      target: '物块B',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生。'
    },
    {
      id: 'normal-force-B',
      name: '水平面支持力',
      symbol: 'F_N',
      origin: '水平面',
      target: '物块B',
      direction: '竖直向上',
      reason: '物块B挤压水平面，水平面对其产生向上的支持力。'
    },
    {
      id: 'external-force-F',
      name: '水平外力F',
      symbol: 'F',
      origin: '外部',
      target: '物块B',
      direction: '水平向右',
      reason: '题目给定的向右拉力。'
    },
    {
      id: 'tension-left',
      name: '绳子拉力T',
      symbol: 'T',
      origin: '轻绳',
      target: '物块B',
      direction: '水平向左',
      reason: '轻绳发生微小弹性形变，对B产生沿绳收缩方向（向左）的拉力。'
    }
  ],

  // 常见错误列表
  commonMistakes: [
    {
      id: 'missing-tension',
      name: '漏画绳子拉力',
      feedback: '错误！B还受到A通过轻绳对它施加的拉力。'
    },
    {
      id: 'wrong-tension-direction',
      name: '绳子拉力方向错误',
      feedback: '错误！轻绳只能提供拉力，不能提供推力。对B而言，绳子拉力方向必须沿绳指向A（向左）。'
    },
    {
      id: 'tension-equals-F',
      name: '认为T=F',
      feedback: '错误！如果T=F，则B水平方向合力为0，加速度为0。但由于A也在向右加速，T必然小于F。'
    }
  ],

  // 分步引导步骤
  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '我们的目标是求轻绳的拉力T。根据“整体求加速度，隔离求内力”的原则，请点击物块B作为本次受力分析的研究对象。',
      action: 'click',
      target: 'blockB',
      reason: '选择正确。将B隔离出来进行受力分析，能够直接暴露出轻绳拉力。'
    },
    {
      id: 'judge-gravity-normal',
      title: '第二步：分析竖直方向受力',
      content: '物块B在竖直方向上受哪些力？',
      options: [
        { text: '仅受重力', correct: false },
        { text: '受重力和向上的支持力', correct: true, reason: '正确。竖直方向B没有加速度，重力和支持力平衡。' }
      ]
    },
    {
      id: 'add-gravity-force',
      title: '标出重力',
      content: '首先确认重力。',
      options: [
        { text: '标出重力', correct: true }
      ],
      forceId: 'gravity-B'
    },
    {
      id: 'add-normal-force',
      title: '标出支持力',
      content: '确认水平面支持力。',
      options: [
        { text: '标出支持力', correct: true }
      ],
      forceId: 'normal-force-B'
    },
    {
      id: 'judge-external-force',
      title: '第三步：分析水平方向外力',
      content: '在水平方向，题目明确提到用外力F拉动B。',
      options: [
        { text: '标出水平外力F', correct: true, reason: '正确。向右的外力F是系统加速运动的动力。' }
      ],
      forceId: 'external-force-F'
    },
    {
      id: 'judge-tension-exists',
      title: '第四步：分析绳子拉力',
      content: '物块B与绳子接触，是否受到绳子的拉力？',
      options: [
        { text: '受拉力', correct: true, reason: '正确。绳子发生形变会对B产生拉力。' },
        { text: '不受拉力', correct: false, mistakeId: 'missing-tension' }
      ]
    },
    {
      id: 'judge-tension-direction',
      title: '判断拉力方向',
      content: '轻绳对物块B的拉力方向是？',
      options: [
        { text: '水平向右', correct: false, mistakeId: 'wrong-tension-direction' },
        { text: '水平向左', correct: true }
      ],
      forceId: 'tension-left'
    },
    {
      id: 'judge-tension-magnitude',
      title: '第五步：探究拉力大小',
      content: '此时轻绳的拉力T是否等于外力F？',
      options: [
        { text: '等于 (T = F)', correct: false, mistakeId: 'tension-equals-F' },
        { text: '不等于 (T < F)', correct: true, reason: '非常棒！对整体而言 F = (m_A + m_B)a，求出 a 后；隔离A可得 T = m_A a，由此可见 T 仅为 F 的一部分。这就是处理连接体问题的核心思路！' }
      ]
    }
  ]
};
