import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AddTask() {
  const [taskData, setTaskData] = useState({
    title: "",
    description: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;
  const isEdit = editData ? true : false;

  useEffect(()=>{
  if(editData){
    setTaskData({
      title: editData.title,
      description: editData.description
    })
  }
  },[editData])
  

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleAddTask = async (e) => {
    e.preventDefault();
    let url = `${API_BASE_URL}/add-task`;
    let method = 'POST';
    if(isEdit){
      url = `${API_BASE_URL}/update/${editData._id}`
      method = 'PUT'
    }
    console.log(taskData);
    let result = await fetch(url, {
      credentials:"include",
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    })
    result = await result.json();
    if (result.success) {
    console.log(isEdit ? "Task Updated" : "Task Added");
    navigate('/');
    }
    else{
      alert("cant add")
    }
    setTaskData({
      title: "",
      description: ""
    });
  }

  return (
    <div className="max-w-xl h-[65vh] mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10">Add New Task</h1>

      <form className="flex flex-col gap-4" onSubmit={handleAddTask}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-xl font-medium text-gray-600">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-md focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-xl font-medium text-gray-600">Description</label>
          <textarea
            id="description"
            placeholder="Enter task description"
            rows={4}
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-md focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 resize-none"
          />
        </div>

        <button type="submit" className="mt-2 bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-700 transition-colors">
          {isEdit ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default AddTask;