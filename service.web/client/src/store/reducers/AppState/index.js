export default function createReducer(config = {}) {

  const initialState = {
    ...config
  }
  return function (state = initialState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
}
