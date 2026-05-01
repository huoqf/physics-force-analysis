# Convert Demo To Learning Scenario

将现有的物理演示组件转换为结构化的学习场景。

## 步骤
1. 检查现有的演示组件，识别物理场景。
2. 将场景提取为可复用的 JSON/JS 对象（包含 id, title, objects, targetObject, correctForces, commonMistakes, steps 等字段）。
3. 重构 Vue 组件，使其从数据对象中读取信息，而不是硬编码。
4. 添加分步学习引导（如：选择对象 -> 判断重力 -> 判断接触力 -> 判断摩擦力）。
5. 为至少 3 个常见错误添加反馈逻辑。
