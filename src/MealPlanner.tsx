import { useState } from "react";

export default function GroceryList() {
  const [groceries, setGroceries] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

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
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Grocery List</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="p-2 border rounded-lg w-full"
          placeholder="Add a grocery item"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add
        </button>
      </div>
      <ul className="mt-4">
        {groceries.map((item, index) => (
          <li key={index} className="flex justify-between items-center py-2">
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
    </div>
  );
}
