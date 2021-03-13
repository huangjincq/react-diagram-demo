export const SCALE_STEP = 0.1


export const DRAG_STATE = {
  DEFAULT: 'DEFAULT',
  START: 'START',
  MOVE: 'MOVE',
  END: 'END',
  SELECTION: 'SELECTION'
}

export const CURSOR_MAP = {
  [DRAG_STATE.DEFAULT]: 'default',
  [DRAG_STATE.SELECTION]: 'default',
  [DRAG_STATE.START]: 'grab',
  [DRAG_STATE.MOVE]: 'grabbing'
}
