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
4. 通过 `offset` 偏移量 更新该 `node` 的 `coordinates`

为了复用 移动的逻辑 把 mouse 移动 事件封装成 [`useDrag`](https://github.com/huangjincq/react-diagram-demo/blob/master/src/hooks/useDrag.ts) hook

在 `DiagramNode` 组件中 更新 新的 `coordinates` [源代码](https://github.com/huangjincq/react-diagram-demo/blob/master/src/components/Diagram/DiagramNode.tsx#L65)

## 5.点和 node 点关系

一个 `node` 内可能有多个输入和输出的点，我们移动的是 `node` ，修改的是 `node` 的 `left` 和 `top` 值，我们在移动的同时也要更新由 `port` 生成的 `link`。所以我们需要遵循一个约定。`port` 是 position:relative 定位在 `node` 内，我们通过 `node` 的 `left` 和 `top` 值，加上 `offsetLeft`/`offsetTop` 就可以实时获取 `port` 当前所在的坐标。（这里需要注意的是 `offsetLeft`/`offsetTop` 是找最近的父元素，然后获取偏移量，要保证找到最近的父元素是 `node` 而不是其他定位元素）

## 6.默认连线原理

在此之前我们先复习一下 `svg` 画线条的原理：在 `svg` 画布中，只需要 起点 `start = "x,y"` 和终点 `end = "x,y"` 坐标 通过 `<path />` 标签设置 `d` 属性 `M ${start}, ${end}` 就可以生成一条直线

```html
<svg>
  <path d="M 0,0, 50,80" stroke="red" />
</svg>
```

该代码可以在 `svg` 元素下 生成起点 坐标 (0,0) 终点为 (50,80) 的红色直线，**注意 坐标的 原点是 svg 元素的左上角**

而连线是根据 `links` 数据生成，一条 `link` 由 `input`(起点) `output` (终点) 组成，所以我们只需要知道 起点元素 在 svg 内的坐标，即可把线画出来。

1. 建立 `svg` 画布大小等同 `node` 画布，层级小于 `node画布`，这个简单在 同一个 div 容器下，都用相对定位宽高 100% 即可。（这样才能保证不在同一容器内的线和点，计算位置是相同的）
2. 第一步：在每个 `node` 和 `port` `Mount` 后把 `dom` 根据 `id` 储存起来

```javascript
// 伪代码 存储 node dom 节点  存储 port 同理
const nodeRefs = useRef({})
const ref = useRef()

useEffect(() => {
  nodeRefs[nodeId] = ref.current
}, [nodeId, ref])

return <div className="node" ref={ref}></div>
```

3. 然后我们将分成两种情况

1. 情况一：起点是 `port`, 终点是 `node` 例: `[{input: 'port-1', output: 'node-1'}]`

   起点 `port-1` 的位置计算方法:

   1. 找到 `port-1` 父元素 `node` 的 `coordinates` 坐标
   2. 找到 `port-1` 的 dom 节点 `port1Dom`
   3. 得出 `port-1` 的坐标 为 `[coordinates[0] + port1Dom.offsetLeft + port1Dom.offsetWidth / 2, coordinates[1] + port1Dom.offsetTop + port1Dom.offsetHeight / 2]`

   终点 `node-1` 的位置计算方法(node 连接位置为左边的中间):

   1. 找到 `node-1` 父元素 `node` 的 `coordinates` 坐标
   2. 找到 `node-1` 的 dom 节点 `node1Dom`
   3. 得出 `node-1` 的坐标 为 `[coordinates[0], coordinates[1] + node1Dom.offsetHeight / 2]`

   拿到起点终点坐标后 设置 `svg` 的 `d` 就自动生成了一条 `link` `link` 位置也会时时随着 `node` 的位置更新

1. 情况二：起点是 `port`, 终点是 `port` 同上 `port-1` 计算

到这一步骤后就可生成直线，我们通过改变 `path` d 的算法可生成曲线 [曲线算法源代码]()

## 7.新增连线原理

## 8.平移画布

## 9.鼠标中心缩放画布

## 10.撤销重做

## 11.辅助线
