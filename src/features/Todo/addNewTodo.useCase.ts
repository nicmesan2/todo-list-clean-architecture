import { TodoStateService } from "services";
import { createTodo } from "entities/Todo/Todo.entity";

export const addNewTodo = async (newTodoDescription: string, todosStateService: TodoStateService) => {
    // cannot add an empty TODO
    if (!newTodoDescription) throw Error("Cannot add an empty TODO");

    const newTodo = createTodo(newTodoDescription);

    await todosStateService.addOne(newTodo);

    return newTodo;
};
