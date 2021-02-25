import React, { memo, useCallback, useState, useEffect, useRef } from 'react'

export interface TestProps {}

const deepClone = (origin: any) => JSON.parse(JSON.stringify(origin))

function useEventCallback(fn: any, dependencies: any) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useEffect(() => {
    ref.current = fn
  }, [fn, ...dependencies])

  return useCallback(
    (arg) => {
      const fn = ref.current
      return fn(arg)
    },
    [ref]
  )
}

const Item = memo(({ item, onClick }: any) => {
  console.log('renderId: ' + item.value)
  const handleClick = useCallback(() => {
    onClick(item.value)
  }, [item.value, onClick])

  return (
    <li>
      {item.label}
      <button onClick={handleClick}>更新</button>
    </li>
  )
})
const defaultV = [
  { value: 1, label: '第一项' },
  { value: 2, label: '第二项' },
]

export const Test: React.FC<TestProps> = React.memo(() => {
  const [list, setList] = useState(defaultV)

  // const ref = useRef<any>(defaultV)

  // useEffect(() => {
  //   ref.current = list
  // }, [ref, list])

  const handleSwap = () => {
    const newList = [list[1], list[0]]
    setList(newList)
  }

  const handleUpdate = () => {
    const newList = [...list]
    newList[0] = { ...newList[0], label: `第${Math.random()}项` }
    // newList[0].label = `第${Math.random()}项`
    setList(newList)
  }
  const handleChange = useEventCallback(
    (id: number) => {
      const newList = [...list]

      const index = newList.findIndex((item: any) => item.value === id)
      newList[index] = { ...newList[index], label: `第${Math.random()}项` }

      setList(newList)
    },
    [list]
  )

  return (
    <ul>
      {list.map((item) => (
        <Item key={item.value} onClick={handleChange} item={item} />
      ))}
      <button onClick={handleSwap}>交换</button>
      <button onClick={handleUpdate}>修改第一项</button>
    </ul>
  )
})

Test.displayName = 'Test'
