import { Todo, Todos } from "domain/Todo";

export interface TodoStateService {
  selectAll: () => Promise<Todos> | Todos;
  addOne: (todo: Todo) => Promise<Todo> | Todo;
  updateOne: (todo: Todo) => Promise<Todo> | Todo;
  removeOne: (todoId: string) => Promise<void> | void;
}
