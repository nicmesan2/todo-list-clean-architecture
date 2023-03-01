import React, { useCallback, useContext, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { TodoStateService } from "services";
import {
  createTodo,
  Todo,
  Todos,
  isChangeToNextStatePossible,
  isChangeToPreviousStatePossible,
  changeToNextState,
  changeToPreviousState,
} from "../domain";
import * as useCases from "features/Todo";
import { UseTodo } from "./useTodo.type";

// This is an example of how easy would be to leverage some library like SWR to handle the caching and revalidation of the data.
// We can even add optimistic updates without changing anything in the rest of the code!
// This is a very simple example to demonstrate how our app's layers are completely decoupled from the implementation details
// on how we could easily use SWR together with Redux instead of http calls, or even with a local storage adapter.

interface TodoSWRStoreProviderProps {
  todoStateService: TodoStateService;
}

export const TodoSWRProvider: React.FC<TodoSWRStoreProviderProps> = ({
  children,
  todoStateService,
}) => {
  const CACHE_KEY = "SWR_TODO_KEY";

  const [initialized, setInitialized] = useState(false);
  // Executes the use-case only if the store is initialized.
  const { data: todos } = useSWR<Todos>(initialized ? CACHE_KEY : null, () =>
    useCases.getTodosByState(todoStateService)
  );
  const { mutate } = useSWRConfig();

  const getTodos = () => {
    setInitialized(true);
  };

  // Executes the use-case and updates the cache with the new data (optimistic update).
  const addTodo = useCallback(
    async (todoDescription: string) => {
      mutate(
        CACHE_KEY,
        () => useCases.addNewTodo(todoDescription, todoStateService),
        {
          optimisticData: (currentData: Todos) => {
            const newTodo = createTodo(todoDescription);
            return { ...currentData, [newTodo.id]: newTodo };
          },
          revalidate: true,
          populateCache: false,
        }
      );
    },
    [todos, createTodo]
  );

  // Executes the use-case and updates the cache with the new data (optimistic update).
  const removeTodo = useCallback(
    async (todoId: string) => {
      mutate(CACHE_KEY, () => useCases.removeTodo(todoId, todoStateService), {
        revalidate: true,
        populateCache: false,
        optimisticData: (currentData: Todos) => {
          const { [todoId]: _, ...updatedTodos } = currentData as Todos;
          return updatedTodos;
        },
      });
    },
    [todos]
  );

  // Executes the use-case and updates the cache with the new data (optimistic update).
  const moveToPreviousState = useCallback(
    async (todo: Todo) => {
      mutate(
        CACHE_KEY,
        () => useCases.changeToPreviousState(todo, todoStateService),
        {
          revalidate: true,
          populateCache: false,
          optimisticData: (currentData: Todos) => {
            const updatedTodo = changeToPreviousState(todo);
            return { ...currentData, [updatedTodo.id]: updatedTodo };
          },
        }
      );
    },
    [todos]
  );

  // Executes the use-case and updates the cache with the new data (optimistic update).
  const moveToNextState = useCallback(
    async (todo: Todo) => {
      mutate(
        CACHE_KEY,
        () => useCases.changeToNextState(todo, todoStateService),
        {
          revalidate: true,
          populateCache: false,
          optimisticData: (currentData: Todos) => {
            const updatedTodo = changeToNextState(todo);
            return { ...currentData, [updatedTodo.id]: updatedTodo };
          },
        }
      );
    },
    [todos]
  );

  const values = useMemo(
    () => ({
      getTodos,
      todos,
      addTodo,
      removeTodo,
      moveToPreviousState,
      moveToNextState,
      // This could be directly imported from the domain, but I find it more convenient to just pass it down through the hook.
      isChangeToNextStatePossible,
      // This could be directly imported from the domain, but I find it more convenient to just pass it down through the hook.
      isChangeToPreviousStatePossible,
    }),
    [getTodos, todos, addTodo, moveToPreviousState, moveToNextState, removeTodo]
  );

  return (
    <TodoSWRContext.Provider value={values}>{children}</TodoSWRContext.Provider>
  );
};

const TodoSWRContext = React.createContext<UseTodo | null>(null);

export const useTodoSWRImplementation = (): UseTodo => {
  const context = useContext(TodoSWRContext);

  if (!context) {
    throw new Error(
      "Could not find TodoStateProvider. Did you forget to wrap your component in it?"
    );
  }

  return context;
};
