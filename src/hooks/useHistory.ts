import {useReducer, useCallback} from 'react';


// 初始化useReducer中的state
const initialState = {
  // 当我们每次添加新state时，用来储存更新前状态的数组
  past: [],
  // 当前的state值
  present: null,
  // 让我们可以用使用重做功能的，future数组
  future: []
};

// 根据action处理state的改变
const reducer = (state: any, action: any) => {
  const {past, present, future} = state;
  const {newPresent} = action;


  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    case 'SET':

      if (newPresent === present) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };

    case 'CLEAR':
      const {initialPresent} = action;

      return {
        ...initialState,
        present: initialPresent
      };
  }
};

// Hook
export const useHistory = (initialPresent: any) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;


  const undo = useCallback(
    () => {
      if (canUndo) {
        dispatch({type: 'UNDO'});
      }
    },
    [canUndo, dispatch]
  );

  const redo = useCallback(
    () => {
      if (canRedo) {
        dispatch({type: 'REDO'});
      }
    },
    [canRedo, dispatch]
  );

  const set = useCallback(newPresent => dispatch({type: 'SET', newPresent}), [
    dispatch
  ]);


  const clear = useCallback(() => dispatch({type: 'CLEAR', initialPresent}), [
    dispatch
  ]);
  console.log(state);
  // 如果需要，同样可以到处过去和未来的state
  return {state: state.present, set, undo, redo, clear, canUndo, canRedo};
};
