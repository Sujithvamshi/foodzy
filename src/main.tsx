import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FoodPlanner from "./App";
import { Provider } from "react-redux";
import store from "./store";
import MealPlanner from "./MealPlanner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="grid relative">
        <FoodPlanner />
        <MealPlanner />
      </div>
    </Provider>
  </StrictMode>
);
