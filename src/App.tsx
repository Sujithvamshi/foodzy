import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMeal, deleteMeal } from "./PlannerSlice";
import { motion, AnimatePresence } from "framer-motion";
import RandomMeal from "./RandomMeal";
import { GiFruitBowl } from "react-icons/gi";

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
      const response = await fetch(
        "https://1snuye1hkk.execute-api.eu-west-1.amazonaws.com/api/meal-plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywords }),
        }
      );

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
    <div className="col-span-3 min-h-screen">
      {/* Navbar */}

      {/* Meal Plan Generation */}
      <div className="relative h-screen">
        <nav className="p-4 mb-6 flex items-center gap-4">
          <GiFruitBowl className="text-white" size={90} />
          <p className="text-6xl font-light pacifico-regular text-white">
            foodzy
          </p>
        </nav>
        <div className="absolute grid gap-8 top-1/2 left-2/5 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
          <p className="text-5xl font-light pacifico-regular text-white">
            Plan Your Plate. Love Your Week.
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter keywords (e.g., high protein, vegan)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-3/4 p-3 border-2 border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white"
            />
            <button
              onClick={handleGenerateMealPlan}
              className="w-1/4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
              disabled={loadingPlan}
            >
              {loadingPlan ? "Generating..." : "Generate Meal Plan"}
            </button>
          </div>
        </div>
        <img
          className="w-screen bg-black absolute top-0 left-0 h-full object-cover -z-10"
          src="https://img.freepik.com/free-photo/crop-plate-with-salad_23-2147753678.jpg"
        ></img>
      </div>

      {/* Day Selection */}
      <div className="bg-[rgb(25,25,25)] h-screen flex flex-col p-6">
        <p className="text-5xl pacifico-regular text-center py-20 text-white">
          Your Weekly Meal Plan
        </p>
        <div className="flex justify-center space-x-4 pb-4">
          {days.map((day) => (
            <button
              key={day}
              className={`px-5 py-2 rounded-full hover:scale-105 font-bold border-2 border-emerald-600 transition-all duration-200 focus:outline-none ${
                currentDay === day
                  ? "bg-emerald-600 text-white"
                  : "text-white hover:bg-emerald-900"
              }`}
              onClick={() => setCurrentDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="pt-6">
          {meals.map((meal) => (
            <div key={meal} className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder={`Enter ${meal} plan`}
                value={planner.days[currentDay]?.[meal] || ""}
                onChange={(e) =>
                  dispatch(
                    addMeal({ day: currentDay, meal, value: e.target.value })
                  )
                }
                className="w-full py-3 px-6 border-2 border-zinc-600 rounded-full focus:outline-none placeholder:text-gray-400 text-white"
              />

              {/* Get Recipe Button */}
              <button
                onClick={() =>
                  fetchRecipe(
                    planner.days[currentDay]?.[meal] || "",
                    `${currentDay}-${meal}`
                  )
                }
                className="p-3 w-32 bg-blue-600 text-white rounded-full hover:bg-blue-800 transition-all shadow-sm focus:outline-none"
                disabled={!planner.days[currentDay]?.[meal]}
              >
                {loadingRecipes[`${currentDay}-${meal}`]
                  ? "Loading..."
                  : "Get Recipe"}
              </button>

              {/* Delete Meal Button */}
              <button
                onClick={() => dispatch(deleteMeal({ day: currentDay, meal }))}
                className=" p-3 bg-red-600 text-white rounded-full hover:bg-red-800 transition-all shadow-sm focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[rgb(25,25,25)] flex flex-col">
        <RandomMeal />
      </div>

      {/* Meals Input Section */}

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
