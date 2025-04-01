import { useState, useEffect } from "react";
import { TbRefresh } from "react-icons/tb";

export default function RandomMeal() {
  interface Meal {
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strYoutube: string;
    [key: string]: string | null; // To handle dynamic ingredient and measure keys
  }

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMeal = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      setMeal(data.meals[0]);
    } catch (error) {
      console.error("Error fetching meal:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  return (
    <div className="flex flex-col pb-20 items-center justify-center">
      <div className="flex items-center justify-center pb-10">
        <p className="text-5xl pacifico-regular text-center text-white">
          Surprise Me with a Recipe!
        </p>
        <button
          onClick={fetchMeal}
          className={`p-2 bg-blue-500 ml-10 text-white rounded-full ${
            loading ? "animate-spin" : ""
          }`}
          disabled={loading}
        >
          <TbRefresh size={40} />
        </button>
      </div>
      {meal && (
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-60 object-cover"
          />
          <div className="p-4">
            <h2 className="text-2xl font-semibold">{meal.strMeal}</h2>
            <p className="text-gray-500">
              {meal.strCategory} - {meal.strArea}
            </p>
            <h3 className="mt-4 font-semibold">Ingredients:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {Array.from({ length: 20 }, (_, i) => i + 1)
                .map((i) => ({
                  ingredient: meal[`strIngredient${i}`],
                  measure: meal[`strMeasure${i}`],
                }))
                .filter((item) => item.ingredient)
                .map((item, index) => (
                  <li key={index}>
                    {item.measure} {item.ingredient}
                  </li>
                ))}
            </ul>
            <p className="mt-4 text-sm text-gray-700">{meal.strInstructions}</p>
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
