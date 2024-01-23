import React, { useReducer, useState, useEffect } from 'react';
 import '../usereducer/TodoList.css'; 

// Reducer function to manage tasks
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'REMOVE_TASK':
      return state.filter((task) => task.id !== action.payload);
    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload.updatedTask } : task
      );
    default:
      return state;
  }
};

// Reducer function to manage categories
const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CATEGORIES':
      return action.payload;
    case 'ADD_CATEGORY':
      return [...state, action.payload];
    case 'REMOVE_CATEGORY':
      return state.filter((category) => category.id !== action.payload);
    case 'UPDATE_CATEGORY':
      return state.map((category) =>
        category.id === action.payload.id
          ? { ...category, ...action.payload.updatedCategory }
          : category
      );
    default:
      return state;
  }
};

const TodoList = () => {
  // State for tasks and categories
  const [tasks, dispatchTasks] = useReducer(taskReducer, []);
  const [categories, dispatchCategories] = useReducer(categoryReducer, []);
  const [newTask, setNewTask] = useState({ name: '', description: '', category: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Load tasks and categories from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    dispatchTasks({ type: 'LOAD_TASKS', payload: storedTasks });
    dispatchCategories({ type: 'LOAD_CATEGORIES', payload: storedCategories });
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save categories to local storage whenever categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Function to handle adding a new task
  const handleAddTask = () => {
    if (newTask.name && newTask.category) {
      if (editingTask !== null) {
        // Update existing task
        dispatchTasks({
          type: 'UPDATE_TASK',
          payload: { id: editingTask, updatedTask: newTask },
        });
        setEditingTask(null);
      } else {
        // Add new task
        dispatchTasks({
          type: 'ADD_TASK',
          payload: { ...newTask, id: Date.now() },
        });
      }
      // Clear form
      setNewTask({ name: '', description: '', category: '' });
    } else {
      alert('Please provide a task name and select a category.');
    }
  };

  // Function to handle removing a task
  const handleRemoveTask = (taskId) => {
    dispatchTasks({ type: 'REMOVE_TASK', payload: taskId });
  };

  // Function to handle adding a new category
  const handleAddCategory = () => {
    if (newCategory) {
      if (editingCategory !== null) {
        // Update existing category
        dispatchCategories({
          type: 'UPDATE_CATEGORY',
          payload: { id: editingCategory, updatedCategory: { name: newCategory } },
        });
        setEditingCategory(null);
      } else {
        // Add new category
        dispatchCategories({
          type: 'ADD_CATEGORY',
          payload: { name: newCategory, id: Date.now() },
        });
      }
      // Clear form
      setNewCategory('');
    } else {
      alert('Please provide a category name.');
    }
  };

  // Function to handle removing a category
  const handleRemoveCategory = (categoryId) => {
    // Check if the category is associated with any task before removing
    const tasksWithCategory = tasks.some((task) => task.category === categories.find((c) => c.id === categoryId).name);
    if (tasksWithCategory) {
      alert('Cannot remove category associated with tasks.');
    } else {
      dispatchCategories({ type: 'REMOVE_CATEGORY', payload: categoryId });
    }
  };

  return (
    <div className="todo-list-container">
      {/* Add Task Form */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTask}>
          {editingTask !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Task Listing Section */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            {/* Display task details here */}
            <div>
              <strong>{task.name}</strong>
              <p>{task.description}</p>
              <p>Category: {task.category}</p>
            </div>
            {/* Add buttons for editing and removing tasks */}
            <div>
              <button onClick={() => setEditingTask(task.id)}>Edit</button>
              <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Category Management Section */}
      <div className="category-management">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>
          {editingCategory !== null ? 'Update Category' : 'Add Category'}
        </button>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name}
              <button onClick={() => setEditingCategory(category.id)}>Edit</button>
              <button onClick={() => handleRemoveCategory(category.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
