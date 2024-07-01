import React, { ChangeEvent } from "react";
import "../../Assets/styles/Sidebar.css";
import { Label } from "../../Interfaces/label.interface";

interface SidebarProps {
  upcomingClicked: boolean;
  todayClicked: boolean;
  onUpcomingClick: () => void;
  onTodayClick: () => void;
  onStickyWallClick: () => void;
  labels: Label[];
  onCreateLabelClick: () => void;
  onLabelClick: (label: string) => void;
  onDeleteLabel: (
    id: string,
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => void;
  onSearch: (query: string) => void;
  activeLabel: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  upcomingClicked,
  todayClicked,
  onUpcomingClick,
  onTodayClick,
  onStickyWallClick,
  labels,
  onCreateLabelClick,
  onLabelClick,
  onDeleteLabel,
  onSearch,
  activeLabel,
}) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name..."
            onChange={handleSearchChange}
          />
        </div>
        <div className="sidebar-section">
          <h3>Tasks</h3>
          <ul>
            <li
              style={{
                cursor: "pointer",
                color: !upcomingClicked && !todayClicked ? "#4CAF50" : "black",
              }}
              onClick={onStickyWallClick}
            >
              Sticky Wall
            </li>
            <li
              style={{
                color: upcomingClicked ? "#4CAF50" : "black",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!upcomingClicked) {
                  onUpcomingClick();
                }
              }}
            >
              Upcoming
            </li>
            <li
              style={{
                color: todayClicked ? "#4CAF50" : "black",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!todayClicked) {
                  onTodayClick();
                }
              }}
            >
              Due Date Today
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Labels</h3>
          <ul className="tags">
            <li
              className={`tag ${"" === activeLabel ? "active" : ""}`}
              onClick={() => {
                onLabelClick("");
              }}
              style={{ cursor: "pointer" }}
            >
              All Labels
            </li>
            {labels.map((label) => (
              <li
                key={label.id}
                className={`tag ${label.name === activeLabel ? "active" : ""}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  onLabelClick(label.name);
                }}
              >
                <div
                  style={{
                    backgroundColor: label.color,
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingBottom: "4px",
                    paddingTop: "4px",
                    borderRadius: "10px",
                  }}
                >
                  <span>{label.name}</span>
                </div>
                <svg
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteLabel(label.id, event);
                  }}
                  width="30px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  fill="#ff0000"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ff0000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z"
                      fill=""
                    />

                    <path
                      d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z"
                      fill=""
                    />

                    <path d="M328 340.8l32-31.2 348 348-32 32z" fill="" />
                  </g>
                </svg>
              </li>
            ))}
            <li
              className="tag"
              onClick={onCreateLabelClick}
              style={{ cursor: "pointer" }}
            >
              + Add Label
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
