/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  checkReminders,
  deleteTodo,
  getTodos,
  getTodosByLabel,
  markTodoComplete,
} from "../../../Services/Api/ToDo";
import "../../../Assets/styles/TodoList.css";
import UpdateTodo from "../UpdateTodo";
import Modal from "../../common/Modal";
import { Todo } from "../../../Interfaces/todo.interface";

interface TodoListProps {
  filterLabel: string;
  searchQuery: string; // searchQuery prop
  onOpenCreateModal: () => void;
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({
  filterLabel,
  searchQuery,
  onOpenCreateModal,
  todos: initialTodos,
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchTodos();
  }, [filterLabel]);

  useEffect(() => {
    checkReminders(todos);
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (e) {
      console.error("Error deleting todo", e);
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    openModal();
  };

  const handleUpdateClose = () => {
    setSelectedTodo(null);
  };

  const handleCheckboxChange = async (id: string, checked: boolean) => {
    setCheckedItems({ ...checkedItems, [id]: checked });
    if (checked) {
      await markTodoComplete(id, true); // Mark as complete
    } else {
      await markTodoComplete(id, false); // Mark as incomplete
    }
    fetchTodos(); // Refresh todos after update
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        <div className="todo-item create-item" onClick={onOpenCreateModal}>
          <div className="create-plus">+</div>
        </div>
        {filteredTodos.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="todo-item"
              onClick={() => handleUpdateClick(todo)}
            >
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.status === "complete"}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(todo.id, e.target.checked);
                }}
              />
              <div className="todo-content">
                <div className="todo-main">
                  <h2>{todo.title}</h2>
                  <p>{todo.description}</p>
                </div>
                <div className="todo-details">
                  <p>
                    <strong>Due Date:</strong> {todo.dueDate}
                  </p>
                  <p>
                    <strong>Reminder:</strong> {todo.reminder}
                  </p>
                  <p>
                    <strong>Labels:</strong> {todo.labels.join(", ")}
                  </p>
                </div>
                <div className="todo-buttons">
                  <div className="todo-delete">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(todo.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedTodo && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <UpdateTodo todo={selectedTodo} onClose={handleUpdateClose} />
        </Modal>
      )}
    </div>
  );
};
