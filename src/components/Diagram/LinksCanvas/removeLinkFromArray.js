import { isEqual } from 'lodash-es'

const removeLinkFromArray = (link, links) => links.filter((item) => !isEqual(item, link))

export default removeLinkFromArray
