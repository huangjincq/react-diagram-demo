---
# 主题列表：juejin, github, smartblue, cyanosis, channing-cyan, fancy, hydrogen, condensed-night-purple, greenwillow, v-green, vue-pro, healer-readable, mk-cute, jzman, geek-black, awesome-green, qklhk-chocolate

# 贡献主题：https://github.com/xitu/juejin-markdown-themes

theme: juejin
highlight:
---

## 前言

> 最近做了一个 svg 图表项目记录总结一下项目中遇到的问题和技术要点

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1068f6b37be7424aa995242d79605c66~tplv-k3u1fbpfcp-watermark.image)

## 计算元素尺寸的常用方法

    图形工具需要对dom元素对宽高、所在位置进行计算，先提前复习一些常用对 dom 宽高位置计算对方法。

1. 通过 [HTMLElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetHeight) 的属性获取

   - 常用的获取元素的宽高：`offsetHeight`/`offsetWidth`|`clientHeight`/`clientWidth`这`offset`和`client`的大概区别就是 `offset` 是包含边框的而 `client` 不包含边框。在项目里面都是用的 `offset` 相关属性计算的。
   - `offsetLeft`/`offsetTop` 获取 dom 距离 上层有定位的父亲元素 的 左边/顶部 的距离

   [详情参考](https://www.cnblogs.com/ranyonsue/p/8109388.html)

2. 通过 [getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 获取

   该函数返回一个 `Object` 对象，该对象有 8 个属性：`top,left,right,bottom,width,height,x,y`

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1363b9518404405398f9ce57a06ec04f~tplv-k3u1fbpfcp-zoom-1.image)

   - `top,left,right,bottom` 对应获取的是元素的上下左右边界到窗口的距离 `x,y`同`left,top`

   - `width,height` 获取的元素的显示宽高

   **注意：通过 HTMLElement 获取的值不受 `CSS3 sacle` 影响，获取的依然是原始值，而通过`getBoundingClientRect` 获取的是缩放元素后实际显示的宽高，由于这个特殊的特性，2 种方法都有实际的使用场景**

## 1.界面和需求功能分析

我们先把页面的元素 分为几大类
`node(节点)、port(点)、link(生成的连线)、segment(点击一个点拖拽拉出的连线)`
我们需要实现的是

- node 拖拽移动
- port-port 连线
- port-node 连线
- 从 port 拉出线条

## 2.数据结构分析

根据功能我们定义一下数据类型如下：![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e141176ce3e34173b56ea5c48692aed7~tplv-k3u1fbpfcp-watermark.image)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff40cc6f20454cdb946021ea6b440448~tplv-k3u1fbpfcp-watermark.image)

nodes 用来渲染 页面所有的 node
links 用来根据 起点终点 的 id 渲染 svg 曲线

## 3.拖拽元素到画布

1.  给元素设置 `draggable` 属性
2.  `onDragStart` 拖拽开始事件携带数据 [源代码](http://www.juejin.com)

```typescript
// 伪代码
const handleDragStart = useCallback(
  (event: any) => {
    event.dataTransfer?.setData('nodeType', type)
  },
  [type]
)
return (
  <div draggable onDragStart={handleDragStart}>
    <div className="node-list-text">{label}</div>
  </div>
)
```

3.  `onDrop` 在目标区域释放的时候,获取携带数据根据鼠标所在位置生成一个 `node` 对象，并且添加到 `nodes` 中 [源代码](http://www.juejin.com)

```typescript
// 伪代码
const handleDrop = useCallback(
  (event: any) => {
    if (event) {
      event = window.event
    }
    const nodeType = event.dataTransfer.getData('nodeType')

    const coordinates: ICoordinateType = [event.clientX, event.clientY]
    const newNode = createNode(nodeType, coordinates)

    handleChange({ ...value, nodes: [...value.nodes, newNode] })
  },
  [handleChange, transform, value]
)

return <div onDrop={handleDrop}></div>
```

## 4.移动 node

1. 将画布设为相对定位 position: relative，然后把每个 `node` 设为绝对定位 position: absolute。
2. `mousedown` 记录 鼠标按下的起点位置 `info.start = [event.clientX, event.clientY]`
3. `mousemove` 计算出移动的偏移量 `offset = [info.start[0] - event.clientX, info.start[1] - event.clientY]`
4. 通过 `offset` 偏移量 更新 `node` 的 `coordinates`

为了复用 移动的逻辑 把 mouse 移动 事件封装成 [`useDrag`]() hook

## 5.点和 node 点关系

## 6.默认连线原理

## 7.新增连线原理

## 8.平移画布

## 9.鼠标中心缩放画布

## 10.撤销重做

## 11.辅助线
