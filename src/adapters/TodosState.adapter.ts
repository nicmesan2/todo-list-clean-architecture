import {
  createEntityAdapter,
  createSlice,
  configureStore,
} from "@reduxjs/toolkit";

import { Todo, Todos, updateTodos, addTodo } from "entities/Todo/Todo.entity";
import { TodoStateService } from "services";
import { todoRepository } from "../repositories";

// This file should contain the implementation of the TodoStateService.To illustrate how easy is to change
// the implementation of the TodoStateService, we are going to implement 4 different adapters:

// Implementation of the in-memory app storage. This is the simplest implementation.
export const useTodoStateMemoryAdapter: () => TodoStateService = () => {
  let todos = {} as Todos;

  const addOne = (newTodo: Todo) => {
    const updatedTodos = addTodo(todos, newTodo);

    todos = updatedTodos;

    return newTodo;
  };

  const selectAll = () => todos;

  const updateOne = (todoToUpdate: Todo) => {
    const updatedTodos = updateTodos(todos, todoToUpdate);

    todos = updatedTodos;

    return todoToUpdate;
  };

  const removeOne = (todoId: string) => {
    const { [todoId]: todoToRemove, ...otherTodos } = todos;
    todos = otherTodos;
  };

  return {
    selectAll,
    addOne,
    updateOne,
    removeOne,
  };
};

export const LOCAL_STORAGE_KEY = "todos";

// Implementation of the app storage using the local storage. Easiest implementation if we want to persist the data.
// We could use a repository here too but we are going to keep it simple.
export const useTodoStateLocalStorageAdapter: () => TodoStateService = () => {
  const getTodos = (): Todos => {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedTodos) {
      return JSON.parse(storedTodos);
    }

    return {};
  };

  const removeTodosUnnecessaryFields = (todos: Todos) => {
    const cleanTodos: Todos = {};

    for (const todoId in todos) {
      const todo = todos[todoId];

      const cleanTodo = {
        description: todo.description,
        id: todo.id,
        state: todo.state,
        createdAt: todo.createdAt,
      };

      cleanTodos[todoId] = cleanTodo;
    }

    return cleanTodos;
  };

  const setTodos = (todos: Todos) => {
    const cleanedTodos = removeTodosUnnecessaryFields(todos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanedTodos));
  };

  const selectAll = () => {
    return getTodos();
  };

  const addOne = async (newTodo: Todo) => {
    const todos = await selectAll();

    const updatedTodos = addTodo(todos, newTodo);

    setTodos(updatedTodos);

    return newTodo;
  };

  const updateOne = async (todoToUpdate: Todo) => {
    const todos = await selectAll();

    const updatedTodos = updateTodos(todos, todoToUpdate);

    setTodos(updatedTodos);

    return todoToUpdate;
  };

  const removeOne = async (todoId: string) => {
    const todos = await selectAll();

    const { [todoId]: todoToRemove, ...otherTodos } = todos;

    setTodos(otherTodos);
  };

  return {
    selectAll,
    addOne,
    updateOne,
    removeOne,
  };
};

// Implementation of the app storage using Redux Toolkit. This is a more real one implementation.
export const useTodoStateReduxAdapter: () => TodoStateService = () => {
  type RootState = ReturnType<typeof store.getState>;

  const todosAdapter = createEntityAdapter<Todo>();

  const todosSlice = createSlice({
    name: "todos",
    initialState: todosAdapter.getInitialState(),
    reducers: {
      addTodo: todosAdapter.addOne,
      updateTodo(state, { payload }) {
        todosAdapter.updateOne(state, { id: payload.id, changes: payload });
      },
      removeTodo(state, { payload }) {
        todosAdapter.removeOne(state, payload);
      },
    },
  });

  const { addTodo, updateTodo, removeTodo } = todosSlice.actions;

  const store = configureStore({
    reducer: {
      todos: todosSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: false,
      }),
    ],
  });

  const todosSelector = todosAdapter.getSelectors<RootState>(
    (state) => state.todos
  );

  const selectAll = () =>
    todosSelector.selectEntities(store.getState()) as Todos;

  const addOne = (todo: Todo) => {
    store.dispatch(addTodo(todo));
    return todo;
  };

  const updateOne = (todoToUpdate: Todo) => {
    store.dispatch(updateTodo(todoToUpdate));
    return todoToUpdate;
  };

  const removeOne = (todoId: string) => {
    store.dispatch(removeTodo(todoId));
  };

  return {
    selectAll,
    addOne,
    updateOne,
    removeOne,
  };
};

// Implementation of the app storage using the HTTP API. We are using the repository pattern to abstract the HTTP calls.
export const useTodoStateHttpAdapter: () => TodoStateService = () => {
  const selectAll = () => {
    return todoRepository.selectAll();
  };

  const addOne = async (newTodo: Todo) => {
    return todoRepository.addOne(newTodo);
  };

  const updateOne = async (todoToUpdate: Todo) => {
    return todoRepository.updateOne(todoToUpdate);
  };

  const removeOne = async (todoId: string) => {
    return todoRepository.removeOne(todoId);
  };

  return {
    selectAll,
    addOne,
    updateOne,
    removeOne,
  };
};
