import React, { useState } from "react";
import { TodoList } from "./Components/specific/TodoLists/TodoList";
import Modal from "./Components/common/Modal";
import CreateTodo from "./Components/specific/CreateToDo";
import CreateLabelForm from "./Components/specific/CreateLabelForm";
import SortedTodoList from "./Components/specific/TodoLists/SortedTodoList";
import Sidebar from "./Components/specific/Sidebar";
import "./Assets/styles/App.css";
import { useLabels } from "./Hooks/useLabels";
import { useTodos } from "./Hooks/useTodos";
import TodayTodoList from "./Components/specific/TodoLists/TodayTodoList";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterLabel, setFilterLabel] = useState<string>("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);
  const [showSortedTodos, setShowSortedTodos] = useState<boolean>(false);
  const [upcomingClicked, setUpcomingClicked] = useState<boolean>(false);
  const [todayClicked, setTodayClicked] = useState<boolean>(false);
  const [activeLabel, setActiveLabel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { labels, addLabel, removeLabel } = useLabels();
  const { todos } = useTodos(filterLabel);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createNewLabel = async (name: string, color: string) => {
    await addLabel(name, color);
    setIsLabelModalOpen(false);
  };

  const handleDeleteLabel = async (
    id: string,
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.stopPropagation();
    await removeLabel(id);
  };

  const handleUpcomingClick = () => {
    if (!upcomingClicked) {
      setUpcomingClicked(true);
      setTodayClicked(false);
      setShowSortedTodos(true);
    }
  };

  const handleTodayClick = () => {
    if (!todayClicked) {
      setTodayClicked(true);
      setUpcomingClicked(false);
      setShowSortedTodos(false);
    }
  };

  const handleStickyWallClick = () => {
    setUpcomingClicked(false);
    setTodayClicked(false);
    setShowSortedTodos(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortedTodoClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <Sidebar
        upcomingClicked={upcomingClicked}
        todayClicked={todayClicked}
        onUpcomingClick={handleUpcomingClick}
        onTodayClick={handleTodayClick}
        onStickyWallClick={handleStickyWallClick}
        labels={labels}
        onCreateLabelClick={() => setIsLabelModalOpen(true)}
        onLabelClick={(label) => {
          setFilterLabel(label);
          setActiveLabel(label);
        }}
        onDeleteLabel={handleDeleteLabel}
        onSearch={handleSearch}
        activeLabel={activeLabel}
      />
      <div className="main-content">
        <header className="App-header">
          <h1>TODO List</h1>
        </header>
        {showSortedTodos ? (
          <SortedTodoList
            filterLabel={filterLabel}
            onOpenCreateModal={openModal}
            searchQuery={searchQuery}
            onClose={handleSortedTodoClose}
          />
        ) : todayClicked ? (
          <TodayTodoList
            filterLabel={filterLabel}
            onClose={handleSortedTodoClose}
            onOpenCreateModal={openModal}
            searchQuery={searchQuery}
          />
        ) : (
          <TodoList
            todos={todos}
            filterLabel={filterLabel}
            searchQuery={searchQuery}
            onOpenCreateModal={openModal}
          />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTodo onClose={closeModal} labels={labels} />
      </Modal>
      <Modal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      >
        <CreateLabelForm onSubmit={createNewLabel} />
      </Modal>
    </div>
  );
};

export default App;
