import { useEffect, useState } from "react";

function List() {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    let list = await fetch("http://localhost:3000/tasks");
    list = await list.json();
    if (list.success) {
      setTaskData(list.result);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Task List</h1>

      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left w-12">S.NO</th>
              <th className="px-5 py-3 text-left">Title</th>
              <th className="px-5 py-3 text-left">Description</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {taskData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-gray-400">
                  No tasks yet.
                </td>
              </tr>
            ) : (
              taskData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{item.title}</td>
                  <td className="px-5 py-3 text-gray-500">{item.description}</td>
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