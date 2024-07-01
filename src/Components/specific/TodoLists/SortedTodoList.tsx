/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  sortByReminder,
  deleteTodo,
  getTodosByLabel,
  markTodoComplete,
} from "../../../Services/Api/ToDo";
import "../../../Assets/styles/TodoList.css";
import UpdateTodo from "../UpdateTodo";
import Modal from "../../common/Modal";
import { Todo } from "../../../Interfaces/todo.interface";

interface SortedTodoListProps {
  filterLabel: string;
  onClose: () => void;
  onOpenCreateModal: () => void;
  searchQuery: string;
}

const SortedTodoList: React.FC<SortedTodoListProps> = ({
  onClose,
  onOpenCreateModal,
  searchQuery,
  filterLabel,
}) => {
  const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  useEffect(() => {
    fetchSortedTodos();
  }, [filterLabel]);

  const fetchSortedTodos = async () => {
    try {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await sortByReminder();
      setSortedTodos(response.data);
    } catch (error) {
      console.error("Error fetching sorted todos", error);
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    openModal();
  };

  const handleUpdateClose = () => {
    setSelectedTodo(null);
    fetchSortedTodos();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      fetchSortedTodos();
    } catch (e) {
      console.error("Error deleting todo", e);
    }
  };

  const filteredTodos = sortedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = async (id: string, checked: boolean) => {
    setCheckedItems({ ...checkedItems, [id]: checked });
    if (checked) {
      // complete
      await markTodoComplete(id, true);
    } else {
      // mark as incomplete
      await markTodoComplete(id, false);
    }
    fetchSortedTodos();
  };

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

export default SortedTodoList;
