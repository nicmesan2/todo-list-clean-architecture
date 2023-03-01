import { Todo, Todos } from "../domain";

export interface TodoRepositoryPort {
  selectAll: () => Promise<Todos>;
  addOne: (todo: Todo) => Promise<Todo>;
  updateOne: (todo: Todo) => Promise<Todo>;
  removeOne: (todoId: string) => Promise<void>;
}
