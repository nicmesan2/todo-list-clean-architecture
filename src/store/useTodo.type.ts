import { Todo, Todos, TodoStates } from "../entities";

export interface UseTodo {
  getTodos: () => void;
  todos?: Todos;
  addTodo: (description: string) => void;
  moveToPreviousState: (todo: Todo) => void;
  moveToNextState: (todo: Todo) => void;
  removeTodo: (todoId: string) => void;
  isChangeToNextStatePossible: (todoState: TodoStates) => boolean;
  isChangeToPreviousStatePossible: (todoState: TodoStates) => boolean;
}
