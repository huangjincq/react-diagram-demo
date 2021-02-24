import React, { memo, useCallback, useState } from 'react'

export interface TestProps {
}

const deepClone = (origin: any) => JSON.parse(JSON.stringify(origin))

const Item = memo(({item}: any) => {
  console.log('renderId: ' + item.value)

  return <li>{item.label}</li>
})

export const Test: React.FC<TestProps> = React.memo(() => {
  const [list, setList] = useState([
    {value: 1, label: '第一项'},
    {value: 2, label: '第二项'}
  ])


  const handleSwap = () => {
    const newList = [list[1], list[0]]
    setList(newList)
  }

  const handleUpdate = () => {
    const newList = [...list]
    newList[0] = {...newList[0], label: `第${Math.random()}项`}
    setList(newList)
  }

  return (
    <ul>
      {list.map((item) => (
        <Item key={item.value} item={item}/>
      ))}
      <button onClick={handleSwap}>交换</button>
      <button onClick={handleUpdate}>修改第一项</button>
    </ul>
  )
})

Test.displayName = 'Test'
