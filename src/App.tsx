import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMeal, deleteMeal } from "./PlannerSlice";
import { motion, AnimatePresence } from "framer-motion";
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
  const [keywords, setKeywords] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [recipe, setRecipe] = useState<{
    title: string;
    details: string;
  } | null>(null);
  // Fetch meal plan from API
  const handleGenerateMealPlan = async () => {
    if (!keywords.trim()) return alert("Please enter keywords!");

    setLoadingPlan(true);
    try {
      const response = await fetch("http://localhost:5001/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });

      const data = await response.json();
      Object.keys(data).forEach((day) => {
        dispatch(
          addMeal({ day, meal: "Breakfast", value: data[day].breakfast })
        );
        dispatch(addMeal({ day, meal: "Lunch", value: data[day].lunch }));
        dispatch(addMeal({ day, meal: "Dinner", value: data[day].dinner }));
      });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      alert("Failed to fetch meal plan.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const [loadingRecipes, setLoadingRecipes] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch recipe for a meal
  const fetchRecipe = async (query: string, mealKey: string) => {
    if (!query) return;

    setLoadingRecipes((prev) => ({ ...prev, [mealKey]: true })); // Set loading only for this meal

    try {
      const response = await fetch(
        "https://w4pt3atzr4.execute-api.us-east-1.amazonaws.com/dev/assistant/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );

      const data = await response.json();
      setRecipe({ title: query, details: data.recipes });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setRecipe({
        title: "Error",
        details: "Failed to fetch recipe. Try again later.",
      });
    }

    setLoadingRecipes((prev) => ({ ...prev, [mealKey]: false })); // Stop loading
  };

  return (
    <div className="p-6 col-span-3 bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 rounded-xl mb-6 flex justify-between items-center">
        <img className="h-20 rounded-2xl" src={logo} alt="Logo" />
      </nav>

      {/* Meal Plan Generation */}
      <input
        type="text"
        placeholder="Enter keywords (e.g., high protein, vegan)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-white shadow-sm"
      />
      <button
        onClick={handleGenerateMealPlan}
        className="w-full mb-4 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
        disabled={loadingPlan}
      >
        {loadingPlan ? "Generating..." : "Generate Meal Plan"}
      </button>

      {/* Day Selection */}
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

      {/* Meals Input Section */}
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
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-white shadow-sm"
            />

            {/* Get Recipe Button */}
            <button
              onClick={() =>
                fetchRecipe(
                  planner.days[currentDay]?.[meal] || "",
                  `${currentDay}-${meal}`
                )
              }
              className="p-2 w-32 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm focus:outline-none"
              disabled={!planner.days[currentDay]?.[meal]}
            >
              {loadingRecipes[`${currentDay}-${meal}`]
                ? "Loading..."
                : "Get Recipe"}
            </button>

            {/* Delete Meal Button */}
            <button
              onClick={() => dispatch(deleteMeal({ day: currentDay, meal }))}
              className=" p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm focus:outline-none"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            className="fixed overflow-scroll inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {recipe.details}
              </p>
              <button
                className="mt-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
                onClick={() => setRecipe(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
