import { TodoStateService } from "services";

export const getTodosByState = (todosStateService: TodoStateService) => {
  return todosStateService.selectAll();
};
