import { useState } from "react";
import { TbX } from "react-icons/tb";

export default function GroceryList() {
  const [groceries, setGroceries] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addItem = () => {
    if (newItem.trim()) {
      setGroceries([...groceries, newItem]);
      setNewItem("");
    }
  };

  const updateItem = (index: number, value: string) => {
    const updatedGroceries = [...groceries];
    updatedGroceries[index] = value;
    setGroceries(updatedGroceries);
  };

  const deleteItem = (index: number) => {
    setGroceries(groceries.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end">
      {isOpen && (
        <div className="p-4 bg-white rounded-xl shadow-lg w-80 mb-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Grocery List</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <TbX size={20} />
            </button>
          </div>
          <ul>
            {groceries.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2"
              >
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="p-2 border rounded-lg w-full"
                />
                <button
                  onClick={() => deleteItem(index)}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="p-2 border rounded-lg w-full"
              placeholder="Add a grocery item"
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        <p className="text-white pb-12 text-2xl pacifico-regular">
          Shopping Cart
        </p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 animate-bounce border-4 border-emerald-400 bg-[rgb(25,25,25)] text-white rounded-full shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105"
        >
          <img
            className="w-24"
            src="https://png.pngtree.com/png-clipart/20250111/original/pngtree-shopping-cart-filled-with-groceries-png-image_19085924.png"
          ></img>
        </button>
      </div>
    </div>
  );
}
