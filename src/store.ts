import { configureStore } from '@reduxjs/toolkit'
import plannerSlice from './PlannerSlice'

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `planner`, handled by `plannerSlice`
    planner: plannerSlice.reducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store