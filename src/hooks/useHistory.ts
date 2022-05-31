import { useReducer, useCallback } from 'react'
import { IDiagramType } from '../types'

// 初始化useReducer中的state
const initialState = {
  // 当我们每次添加新state时，用来储存更新前状态的数组
  past: [],
  // 当前的state值
  present: null,
  // 让我们可以用使用重做功能的，future数组
  future: [],
}

// 根据action处理state的改变
const reducer = (state: any, action: any) => {
  const { past, present, future } = state
  const { newPresent } = action

  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    case 'REDO':
      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    case 'SET':
      return {
        past: [...past],
        present: newPresent,
        future: [],
      }

    case 'SET_WIDTH_HISTORY':
      if (newPresent === present) {
        return state
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      }

    case 'ADD_A_HISTORY':
      if (newPresent === present) {
        return state
      }
      return {
        past: [...past, newPresent],
        present: present,
        future: [],
      }

    case 'CLEAR':
      const { initialPresent } = action

      return {
        ...initialState,
        present: initialPresent,
      }
  }
}

// Hook
export const useHistory = (initialPresent: IDiagramType) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  })

  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: 'UNDO' })
    }
  }, [canUndo, dispatch])

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: 'REDO' })
    }
  }, [canRedo, dispatch])

  // 只设置值 不追加历史记录 例如 移动 node的过程不需要记录
  const set = useCallback((newPresent: IDiagramType) => dispatch({ type: 'SET', newPresent }), [dispatch])

  // 设置值 并且追加历史记录 例如 增加删除节点，修改节点data数据等
  const setWithHistory = useCallback(
    (newPresent: IDiagramType) => dispatch({ type: 'SET_WIDTH_HISTORY', newPresent }),
    [dispatch]
  )

  // 仅追加一条历史记录不设置值 例如 节点移动后，把节点拖拽的起始位置 追加进入历史栈
  const addAHistory = useCallback(
    (newPresent: IDiagramType) => dispatch({ type: 'ADD_A_HISTORY', newPresent }),
    [dispatch]
  )

  const clear = useCallback(() => dispatch({ type: 'CLEAR', initialPresent }), [dispatch, initialPresent])

  return { present: state.present, set, setWithHistory, addAHistory, undo, redo, clear, canUndo, canRedo }
}
