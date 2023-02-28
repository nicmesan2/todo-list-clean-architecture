import { Todo, Todos } from "entities";

// This service manages the in-memory app storage.
// Currently using React context, but could be any other: Redux, Recoil, Jotai, Browser's local storage, etc.
export interface TodoStateService {
  selectAll: () => Promise<Todos> | Todos;
  addOne: (todo: Todo) => Promise<Todo> | Todo;
  updateOne: (todo: Todo) => Promise<Todo> | Todo;
  removeOne: (todoId: string) => Promise<void> | void;
}
