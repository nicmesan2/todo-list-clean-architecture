import { Todo, Todos } from "../entities";

export interface TodoRepository {
  selectAll: () => Promise<Todos>;
  addOne: (todo: Todo) => Promise<Todo>;
  updateOne: (todo: Todo) => Promise<Todo>;
  removeOne: (todoId: string) => Promise<void>;
}
