import { TodoStateService } from "services";
import { createTodo } from "domain/Todo/Todo.entity";

export const addNewTodo = async (
  newTodoDescription: string,
  todosStateService: TodoStateService
) => {
  const newTodo = createTodo(newTodoDescription);

  await todosStateService.addOne(newTodo);

  return newTodo;
};
