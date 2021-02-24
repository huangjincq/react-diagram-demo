import React, { memo, useCallback, useState } from 'react'

export interface TestProps {}

const Item = memo(({ item }: any) => {
  console.log('remder- ' + item.value)

  return <li>{item.label}</li>
})

export const Test: React.FC<TestProps> = React.memo(() => {
  const [list, setList] = useState([
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
  ])

  const hanldeClick = () => {
    const newList = [...list].sort((a: any, b: any) => Math.random() - 0.5)
    newList[0] = { value: newList[0].value, label: Math.random() }
    setList(newList)
  }

  return (
    <ul>
      {list.map((item) => (
        <Item key={item.value} item={item} />
      ))}
      <button onClick={hanldeClick}>点我</button>
    </ul>
  )
})

Test.displayName = 'Test'
