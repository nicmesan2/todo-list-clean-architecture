import { getUniqueId } from "shared/lib/uuid";

export enum TodoStates {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export type Todo = {
  id: string;
  createdAt: Date;
  description: string;
  state: TodoStates;
  dirty?: boolean;
};

export type Todos = Record<string, Todo>;

// Create a new todo with initial state "TODO"
export const createTodo = (description: string): Todo => {
  // cannot add an empty TODO
  if (!description) throw Error("Cannot add an empty TODO");

  return {
    id: getUniqueId(),
    state: TodoStates.TODO,
    createdAt: new Date(),
    description,
  };
};

// Change todo state to previous state depending on current state
export const changeToPreviousState = (todo: Todo) => {
  switch (todo.state) {
    case TodoStates.DONE:
      return updateTodoState(todo, TodoStates.IN_PROGRESS);
    case TodoStates.IN_PROGRESS:
      return updateTodoState(todo, TodoStates.TODO);
    default:
      throw Error(`Status ${todo.state} is not supported`);
  }
};

// Change todo state to next state depending on current state
export const changeToNextState = (todo: Todo) => {
  switch (todo.state) {
    case TodoStates.TODO:
      return updateTodoState(todo, TodoStates.IN_PROGRESS);
    case TodoStates.IN_PROGRESS:
      return updateTodoState(todo, TodoStates.DONE);
    default:
      throw Error(`Status ${todo.state} is not supported`);
  }
};

// Add business logic regarding workflow.
// For example in the future we could want to prevent users to move todos in
// "TODO" state into "DONE" directly
export const isNewStateAllowed = (todo: Todo, newState: TodoStates) => {
  if (todo.state === newState) return false;

  return true;
};

// "DONE" is the last state, so we cannot change to next state
export const isChangeToNextStatePossible = (todoState: TodoStates) =>
  todoState !== TodoStates.DONE;
// "TODO" is the first state, so we cannot change to previous state
export const isChangeToPreviousStatePossible = (todoState: TodoStates) =>
  todoState !== TodoStates.TODO;

export const updateTodoState = (todo: Todo, newState: TodoStates): Todo => {
  if (!isNewStateAllowed(todo, newState)) {
    throw Error("Cannot change todo state");
  }

  const updatedTodo = {
    ...todo,
    dirty: true,
    state: newState,
  };

  return updatedTodo;
};

export const updateTodos = (
  todos: Todos,
  todoToUpdate: Partial<Todo> & { id: UniqueId }
): Todos => {
  const todoId = todoToUpdate.id;
  const updatedTodo = {
    ...todos[todoId],
    ...todoToUpdate,
  };

  return {
    ...todos,
    [todoId]: {
      ...updatedTodo,
    },
  };
};

export const addTodo = (todos: Todos, newTodo: Todo): Todos => {
  return {
    ...todos,
    [newTodo.id]: newTodo,
  };
};
