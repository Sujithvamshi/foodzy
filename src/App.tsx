import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMeal, deleteMeal, setPlannerName } from "./PlannerSlice";
import logo from "./assets/logo.png";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const meals = ["Breakfast", "Lunch", "Dinner"];

export default function FoodPlanner() {
  const dispatch = useDispatch();
  const planner = useSelector((state: { planner: any }) => state.planner);
  const [currentDay, setCurrentDay] = useState("Sunday");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-md p-4 rounded-xl mb-6 flex justify-between items-center">
        <img className="h-20 rounded-2xl" src={logo}></img>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Save Plan
        </button>
      </nav>
      <div className="w-full flex justify-center pb-4"></div>
      <input
        type="text"
        placeholder="Planner Name"
        value={planner.name}
        onChange={(e) => dispatch(setPlannerName(e.target.value))}
        className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-white shadow-sm"
      />
      <div className="flex space-x-2 overflow-x-auto pb-4">
        {days.map((day) => (
          <button
            key={day}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none ${
              currentDay === day
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {meals.map((meal) => (
          <div key={meal} className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Enter ${meal} plan`}
              value={planner.days[currentDay]?.[meal] || ""}
              onChange={(e) =>
                dispatch(
                  addMeal({ day: currentDay, meal, value: e.target.value })
                )
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-white shadow-sm"
            />
            <button
              onClick={() => dispatch(deleteMeal({ day: currentDay, meal }))}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm focus:outline-none"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
