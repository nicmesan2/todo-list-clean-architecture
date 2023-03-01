import React, { useCallback, useContext, useMemo, useState } from "react";

import { TodoStateService } from "services";
import {
  Todo,
  isChangeToNextStatePossible,
  isChangeToPreviousStatePossible,
  Todos,
} from "../domain";
import {
  addNewTodo,
  changeToNextState,
  changeToPreviousState,
  getTodosByState,
  removeTodo as removeTodoUseCase,
} from "features/Todo";
import { UseTodo } from "./useTodo.type";

// The store will be responsible for hooking up the use-cases with the services (a.k.a. dependency injection).
// Since we are using React as our UI library, the store will also be responsible for triggering the re-rendering
// when the state changes. Finally, it exports a hook to access the store from our components.

interface TodoStateStoreProviderProps {
  todoStateService: TodoStateService;
}

export const TodoStateProvider: React.FC<TodoStateStoreProviderProps> = ({
  children,
  todoStateService,
}) => {
  // This will keep track of the current state of our todos and trigger a re-render on any component using this hook
  // in case the state changes.
  const [todos, setTodos] = useState<Todos>();

  // This will be called by the component to initialize the state of the store.
  const getTodos = async () => {
    const initTodos = await getTodosByState(todoStateService);
    setTodos(initTodos);
  };

  const addTodo = useCallback(async (todoDescription: string) => {
    await addNewTodo(todoDescription, todoStateService);
    const updatedTodos = await getTodosByState(todoStateService);
    setTodos(updatedTodos);
  }, []);

  const removeTodo = useCallback(async (todoId: string) => {
    await removeTodoUseCase(todoId, todoStateService);
    const updatedTodos = await getTodosByState(todoStateService);
    setTodos(updatedTodos);
  }, []);

  const moveToPreviousState = useCallback(async (todo: Todo) => {
    await changeToPreviousState(todo, todoStateService);
    const updatedTodos = await getTodosByState(todoStateService);
    setTodos(updatedTodos);
  }, []);

  const moveToNextState = useCallback(async (todo: Todo) => {
    await changeToNextState(todo, todoStateService);
    const updatedTodos = await getTodosByState(todoStateService);
    setTodos(updatedTodos);
  }, []);

  const values = useMemo(
    () => ({
      getTodos,
      todos,
      addTodo,
      moveToPreviousState,
      moveToNextState,
      removeTodo,
      // This could be directly imported from the domain, but I find it more convenient to just pass it down through the hook.
      isChangeToNextStatePossible,
      // This could be directly imported from the domain, but I find it more convenient to just pass it down through the hook.
      isChangeToPreviousStatePossible,
    }),
    [getTodos, todos, addTodo, moveToPreviousState, moveToNextState, removeTodo]
  );

  return (
    <TodoStateContext.Provider value={values}>
      {children}
    </TodoStateContext.Provider>
  );
};

const TodoStateContext = React.createContext<UseTodo | null>(null);

export const useTodo = (): UseTodo => {
  const context = useContext(TodoStateContext);

  if (!context) {
    throw new Error(
      "Could not find TodoSWRProvider. Did you forget to wrap your component in it?"
    );
  }

  return context;
};
