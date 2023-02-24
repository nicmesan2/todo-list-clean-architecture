import { TodoStateService } from "../../services";

export const removeTodo = (todoId: string, todosStateService: TodoStateService) => {
    return todosStateService.removeOne(todoId);
};
