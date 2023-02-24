import React from "react";
import { TodoCard } from "../TodoCard";

type Todo<T> = T & { description: string; id: string };

interface TodoListColumnProps<T> {
    onRightClick?: (todo: Todo<T>) => void;
    onLeftClick?: (todo: Todo<T>) => void;
    onRemove?: (todoId: UniqueId) => void;
    title: string;
    todos: Todo<T>[];
}

function TodoListColumn<T>({
    onRightClick,
    onLeftClick,
    onRemove,
    todos,
    title,
}: React.PropsWithChildren<TodoListColumnProps<T>>) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
                overflow: "hidden",
                height: "100%",
            }}
        >
            <h3 style={{ textAlign: "center", flex: "0 0 auto" }}>{title}</h3>
            <div
                style={{
                    overflow: "auto",
                    flex: "1",
                    width: "100%",
                    gap: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {todos.map((todo) => (
                    <TodoCard
                        onRightClick={onRightClick}
                        onLeftClick={onLeftClick}
                        onRemove={onRemove}
                        key={todo.id}
                        todo={todo}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(TodoListColumn);
