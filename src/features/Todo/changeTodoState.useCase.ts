import * as TodoEntity from "domain/Todo/Todo.entity";
import { TodoStateService } from "services";

// Change todo state to next state depending on current state
export const changeToNextState = (
  todo: TodoEntity.Todo,
  todosStateService: TodoStateService
) => {
  const updatedTodo = TodoEntity.changeToNextState(todo);
  return todosStateService.updateOne(updatedTodo);
};

// Change todo state to previous state depending on current state
export const changeToPreviousState = (
  todo: TodoEntity.Todo,
  todosStateService: TodoStateService
) => {
  const updatedTodo = TodoEntity.changeToPreviousState(todo);
  return todosStateService.updateOne(updatedTodo);
};
