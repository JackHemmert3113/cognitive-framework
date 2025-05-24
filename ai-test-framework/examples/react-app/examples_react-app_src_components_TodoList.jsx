import React, { useState } from 'react';
import { useCounter } from '../hooks/useCounter';

/**
 * TodoList Component
 * Example React component with tests
 */
const TodoList = ({ initialTodos = [] }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [inputValue, setInputValue] = useState('');
  const { count: completedCount, increment, decrement } = useCounter(0);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        if (newCompleted) {
          increment();
        } else {
          decrement();
        }
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => {
    const todoToDelete = todos.find(t => t.id === id);
    if (todoToDelete?.completed) {
      decrement();
    }
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-list">
      <h2>{'Todo List'}</h2>
      <p className="stats">
        Completed: {completedCount} / {todos.length}
      </p>
      
      <form onSubmit={addTodo} className="add-todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new todo..."
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todos">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
            />
            <span>{todo.text}</span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;