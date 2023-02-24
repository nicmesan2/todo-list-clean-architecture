import React, { useCallback, useEffect, useMemo } from "react";

import { Todo, TodoStates } from "entities/Todo/Todo.entity";
import { AddTodoInput, TodoListColumn } from "shared/components";
// Use either of the following providers hooks. Remember to use the corresponding provider in App.tsx
import { useTodo, useTodoSWRImplementation } from "../store";

function TodoListPage() {
    const {
        moveToPreviousState,
        moveToNextState,
        isChangeToNextStatePossible,
        isChangeToPreviousStatePossible,
        addTodo,
        todos,
        removeTodo,
        initTodoState,
    } = useTodoSWRImplementation();

    useEffect(() => {
        initTodoState();
    }, []);

    const handleCreateNewTodo = useCallback(
        (newTodoDescription: string) => {
            addTodo(newTodoDescription);
        },
        [addTodo]
    );

    const orderedTodosByState = useMemo(() => {
        if (!todos) return null;

        const todosListByState: Record<TodoStates, Todo[]> = {
            [TodoStates.TODO]: [],
            [TodoStates.IN_PROGRESS]: [],
            [TodoStates.DONE]: [],
        };

        for (const todoId in todos) {
            const todo: Todo = todos[todoId];
            todosListByState[todo.state].push(todo);
        }

        return todosListByState;
    }, [todos]);

    const todosColumns = useMemo(() => {
        if (!orderedTodosByState) return <div>Loading...</div>;

        return Object.keys(TodoStates).map((todoState) => {
            const handleLeftClick = isChangeToPreviousStatePossible(todoState) ? moveToPreviousState : null;
            const handleRightClick = isChangeToNextStatePossible(todoState) ? moveToNextState : null;

            const titleLabels = {
                [TodoStates.TODO]: "To do",
                [TodoStates.IN_PROGRESS]: "In progress",
                [TodoStates.DONE]: "Done",
            };

            return (
                <div
                    data-testid={`${todoState}-column`}
                    key={todoState}
                    style={{
                        flex: "1 1 0%",
                        height: "100%",
                        overflow: "hidden",
                        padding: "0 16px",
                    }}
                >
                    <TodoListColumn
                        title={titleLabels[todoState as TodoStates]}
                        onLeftClick={handleLeftClick}
                        onRightClick={handleRightClick}
                        onRemove={removeTodo}
                        todos={orderedTodosByState[TodoStates[todoState as TodoStates]]}
                    />
                </div>
            );
        });
    }, [orderedTodosByState]);

    return (
        <>
            <h2 style={{ textAlign: "center" }}>Todo List!</h2>
            <div style={{ display: "flex", gap: 16, padding: 12, flex: 1, overflow: "hidden" }}>{todosColumns}</div>
            <div style={{ padding: "12px 24px", flex: "0 0 auto" }}>
                <AddTodoInput onSubmit={handleCreateNewTodo} />
            </div>
        </>
    );
}

export default TodoListPage;
