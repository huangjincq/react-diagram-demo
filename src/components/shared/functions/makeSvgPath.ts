/**
 * Rounds coordinates
 */
import {ICoordinateType} from "../../../types";

const roundPoint = (point: ICoordinateType) => [Math.floor(point[0]), Math.floor(point[1])]


/**
 * Given a source point and an output point produces the SVG path between them
 */
const makeSvgPath = (startPoint?: ICoordinateType, endPoint?: ICoordinateType) => {
  if (!startPoint || !endPoint) return ''
  const roundedStart = roundPoint(startPoint)
  const roundedEnd = roundPoint(endPoint)

  const start = `${roundedStart[0]}, ${roundedStart[1]}`
  const end = `${roundedEnd[0]}, ${roundedEnd[1]}`


  const ctrl = `${roundedEnd[0]}, ${roundedStart[1]}`

  return `M ${start} Q ${ctrl}, ${end}`
}

export default makeSvgPath
