import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function List() {
  const [taskData, setTaskData] = useState([]);
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState([]);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    let list = await fetch(`${API_BASE_URL}/tasks`);
    list = await list.json();
    if (list.success) {
      setTaskData(list.result);
    }
  };

  const deleteTask = async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/delete/${taskId}`, { method: "DELETE" });
    const result = await response.json();
    if (result.success) {
      setTaskData((prev) => prev.filter((task) => task._id !== taskId));
    }
  };

  const deleteSelectedTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/delete-many`, 
      { 
        method: "DELETE",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedTask)
      }
    );
    const result = await response.json();
    if (result.success) {
      getListData();
      setSelectedTask([])
    }
  };


  const updateTask = (task) => {
    navigate("/add", { state: task });
  };

  const selectAll = (event) => {
    if (event.target.checked) {
      setSelectedTask(taskData.map((item) => item._id));
    } else {
      setSelectedTask([]);
    }
  };

  const selectSingleItem = (itemId) => {
    setSelectedTask((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Task List</h1>

        <div className={`flex items-center gap-3 transition-all duration-300 ${selectedTask.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}>
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{selectedTask.length}</span> selected
          </span>
          <button
            onClick={() => setSelectedTask([])}
            className="text-xs font-medium text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={deleteSelectedTasks}
            className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Delete {selectedTask.length > 1 ? `${selectedTask.length} tasks` : "task"}
          </button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-visible shadow-sm">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            {taskData.length > 0 && <col className="w-10" />}
            <col className="w-17" />
            <col className="w-1/4" />
            <col />
            <col className="w-35" />
          </colgroup>

          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              {taskData.length > 0 && (
                <th className="px-4 py-3 group relative">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-gray-700 cursor-pointer"
                    checked={taskData.length > 0 && taskData.length === selectedTask.length}
                    onChange={selectAll}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-zinc-700 text-white text-[10px] font-medium rounded-md py-1 px-2 whitespace-nowrap shadow-lg">
                      Select all
                    </div>
                  </div>
                </th>
              )}
              <th className="px-4 py-3 text-left">S.NO</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {taskData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  No tasks yet.
                </td>
              </tr>
            ) : (
              taskData.map((item, index) => (
                <tr
                  key={item._id}
                  className={`transition-colors align-top ${selectedTask.includes(item._id) ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 accent-gray-700 cursor-pointer mt-0.5"
                      onChange={() => selectSingleItem(item._id)}
                      checked={selectedTask.includes(item._id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 wrap-break-word whitespace-normal">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 wrap-break-word whitespace-normal">{item.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => deleteTask(item._id)}
                        className="text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => updateTask(item)}
                        className="text-xs font-medium text-blue-500 border border-blue-200 bg-blue-50 hover:bg-blue-500 hover:text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;