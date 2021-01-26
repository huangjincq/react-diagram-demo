/**
 * Rounds coordinates
 */
// @ts-nocheck

import { ICoordinateType } from '../types'

const roundPoint = (point: ICoordinateType): ICoordinateType => [Math.floor(point[0]), Math.floor(point[1])]

/**
 * Given a source point and an output point produces the SVG path between them
 */
const makeSvgPath = (startPoint?: ICoordinateType, endPoint?: ICoordinateType) => {
  if (!startPoint || !endPoint) return ''
  const roundedStart = roundPoint(startPoint)
  const roundedEnd = roundPoint(endPoint)

  const start = `${roundedStart[0]}, ${roundedStart[1]}`
  const end = `${roundedEnd[0]}, ${roundedEnd[1]}`


  // return `M ${start}, ${end}`
  return makeBezierCurve({x: roundedStart[0], y: roundedStart[1]}, {x: roundedEnd[0], y: roundedEnd[1]})
}

export default makeSvgPath

const makeBezierCurve = (from: any, to: any) => {
  if (to.x >= from.x + 40 || Math.abs(to.y - from.y) <= 40) {
    return getCubicBezierPath(from, to)
  } else {
    return getAdvancedCubicBezierPath(from, to)
  }
}

const getPointsString = (points: any) => {
  return points.map((item) => `${item.x},${item.y}`).join(' ')
}

const getCubicBezierPath = (from: any, to: any) => {
  const controlPointForStart = {x: (to.x + from.x) / 2, y: from.y}
  const controlPointForEnd = {x: (to.x + from.x) / 2, y: to.y}

  return `M ${from.x},${from.y} C ${getPointsString([controlPointForStart, controlPointForEnd])} ${to.x},${to.y}`
}


const getAdvancedCubicBezierPath = (from: any, to: any) => {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2

  return `M${from.x},${from.y} ${from.x + 20},${from.y} C ${from.x + 100},${from.y} ${from.x + 130},${(midY + from.y) / 2}  ${midX},${midY} C ${midX},${midY} ${to.x - 130},${(midY + to.y) / 2} ${to.x - 2},${to.y} M ${to.x - 2},${to.y} ${to.x},${to.y}`
}
