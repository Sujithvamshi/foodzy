import { createSlice } from "@reduxjs/toolkit";

interface Days {
  [key: string]: {
    [meal: string]: string;
  };
}

const initialState: { name: string; days: Days } = {
  name: "",
  days: {},
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    setPlannerName: (state, action) => {
      state.name = action.payload;
    },
    addMeal: (state, action) => {
      const { day, meal, value } = action.payload;
      if (!state.days[day]) {
        state.days[day] = {};
      }
      state.days[day][meal] = value;
    },
    deleteMeal: (state, action) => {
      const { day, meal } = action.payload;
      if (state.days[day]) {
        delete state.days[day][meal];
      }
    },
  },
});

export const { setPlannerName, addMeal, deleteMeal } = plannerSlice.actions;
export default plannerSlice;
