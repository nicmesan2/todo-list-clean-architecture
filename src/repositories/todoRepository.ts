import { Todo } from "../entities";
import { TodoRepository } from "../ports";
import { httpClient } from "../shared/lib/httpClient";

export const todoRepository: TodoRepository = {
  selectAll: async () => {
    const response = await httpClient.get<Todo[]>("todo");

    const todos = response.data.reduce(
      (acc, todo) => ({
        ...acc,
        [todo.id]: todo,
      }),
      {}
    );

    return todos;
  },
  addOne: async (todo: Todo) => {
    const todoDto = {
      description: todo.description,
      id: todo.id,
      state: todo.state,
      createdAt: todo.createdAt,
    };

    const response = await httpClient.post<Todo>("/todo", todoDto);

    return response.data;
  },
  updateOne: async (todo: Todo) => {
    const cleanTodo = {
      description: todo.description,
      id: todo.id,
      state: todo.state,
      createdAt: todo.createdAt,
    };

    const response = await httpClient.put<Todo>(`/todo/${todo.id}`, cleanTodo);

    return response.data;
  },
  removeOne: async (todoId: string) => {
    const response = await httpClient.delete<void>(`/todo/${todoId}`);

    return response.data;
  },
};
