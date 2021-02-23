import { ICoordinateType } from '../types'

const roundPoint = (point: ICoordinateType): ICoordinateType => [Math.floor(point[0]), Math.floor(point[1])]

// 贝塞尔曲线算法
const makeBezierCurve = (from: ICoordinateType, to: ICoordinateType) => {
  if (to[0] >= from[0]) {
    return getCubicBezierPath(from, to)
  } else {
    return getAdvancedCubicBezierPath(from, to)
  }
}

const getPointsString = (points: ICoordinateType[]) => {
  return points.map((item) => `${item[0]},${item[1]}`).join(' ')
}

// 正向 贝塞尔曲线
const getCubicBezierPath = (from: ICoordinateType, to: ICoordinateType) => {
  const controlPointForStart: ICoordinateType = [(to[0] + from[0]) / 2, from[1]]
  const controlPointForEnd: ICoordinateType = [(to[0] + from[0]) / 2, to[1]]

  return `M ${from[0]},${from[1]} C ${getPointsString([controlPointForStart, controlPointForEnd])} ${to[0]},${to[1]}`
}

// 反向 贝塞尔曲线
const getAdvancedCubicBezierPath = (from: ICoordinateType, to: ICoordinateType) => {
  const midX = (from[0] + to[0]) / 2
  const midY = (from[1] + to[1]) / 2

  return `M${from[0]},${from[1]} ${from[0] + 20},${from[1]} C ${from[0] + 100},${from[1]} ${from[0] + 130},${
    (midY + from[1]) / 2
  }  ${midX},${midY} C ${midX},${midY} ${to[0] - 130},${(midY + to[1]) / 2} ${to[0] - 2},${to[1]} M ${to[0] - 2},${
    to[1]
  } ${to[0]},${to[1]}`
}

/**
 * 生成连点之间的贝塞尔曲线
 */
const makeSvgPath = (startPoint?: ICoordinateType, endPoint?: ICoordinateType) => {
  if (!startPoint || !endPoint) return ''
  const roundedStart = roundPoint(startPoint)
  const roundedEnd = roundPoint(endPoint)

  // const start = `${roundedStart[0]}, ${roundedStart[1]}`
  // const end = `${roundedEnd[0]}, ${roundedEnd[1]}`

  // 生成 直线
  // return `M ${start}, ${end}`

  // 生成 曲线
  return makeBezierCurve(roundedStart, roundedEnd)
}

export default makeSvgPath
