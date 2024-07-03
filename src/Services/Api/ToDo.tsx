import axios from "axios";
import { Todo } from "../../Interfaces/todo.interface";
import Swal from "sweetalert2";

const API_URL = "https://51.21.131.62:3333/api/todos";
const LABELS_API_URL = "https://51.21.131.62:3333/api/labels";
const REMINDERS_API_URL = "https://51.21.131.62:3333/api/todos/reminders";
const TODAY_TODOS_API_URL = "https://51.21.131.62:3333/api/todos/today";

export const getTodos = async () => {
  return await axios.get(API_URL);
};

export const getTodosByLabel = async (label: string) => {
  return await axios.get(`${API_URL}/label/${label}`);
};

export const createTodo = async (todo: any) => {
  return await axios.post(API_URL, todo);
};

export const deleteTodo = async (id: any) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateTodo = async (id: string, todo: any) => {
  return await axios.put(`${API_URL}/${id}`, todo);
};

export const getLabels = async () => {
  return await axios.get(LABELS_API_URL);
};

export const createLabel = async (label: any) => {
  return await axios.post(LABELS_API_URL, label);
};

export const deleteLabel = async (id: string) => {
  return await axios.delete(`${LABELS_API_URL}/${id}`);
};

export const sortByReminder = async () => {
  return await axios.get(REMINDERS_API_URL);
};

export const getTodayTodos = async () => {
  return await axios.get(TODAY_TODOS_API_URL);
};

export const markTodoComplete = async (id: string, complete: boolean) => {
  try {
    await axios.put(`${API_URL}/${id}`, {
      status: complete ? "complete" : "incomplete",
    });
  } catch (error) {
    console.error("Error updating todo status", error);
    throw error; // Optionally, rethrow the error for further handling
  }
};

export const getRemindersWithin24Hours = (todos: Todo[]) => {
  const now = new Date().getTime();
  const twentyFourHoursLater = now + 24 * 60 * 60 * 1000;
  const twentyFourHoursBefore = now - 24 * 60 * 60 * 1000;

  return todos.filter((todo) => {
    const reminderTime = new Date(todo.reminder).getTime();
    return (
      reminderTime >= twentyFourHoursBefore &&
      reminderTime <= twentyFourHoursLater
    );
  });
};

export const showReminderAlerts = async (reminderTodos: Todo[]) => {
  const todayEndTime = new Date();
  todayEndTime.setHours(23, 59, 59, 999);

  for (const todo of reminderTodos) {
    let reminderTime = new Date(todo.reminder).getTime();
    reminderTime -= 72000002;

    // Calculate the end of today
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Determine if reminder is due today or within 24 hours
    if (reminderTime < endOfToday.getTime()) {
      await Swal.fire({
        title: `Reminder: ${todo.title}`,
        text: `Due today!`,
        icon: "info",
        confirmButtonText: "OK",
      });
    } else if (reminderTime <= tomorrow.getTime()) {
      await Swal.fire({
        title: `Reminder: ${todo.title}`,
        text: `Due within 24 hours!`,
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }
};

export const checkReminders = (todos: Todo[]) => {
  const reminderTodos = getRemindersWithin24Hours(todos);
  showReminderAlerts(reminderTodos);
};