import React, { useCallback, useMemo } from "react";

type Todo<T> = T & { description: string; id: string; dirty?: boolean };

interface TodoCardProps<T> {
    todo: Todo<T>;
    onRightClick?: (todo: Todo<T>) => void;
    onLeftClick?: (todo: Todo<T>) => void;
    onRemove?: (todoId: UniqueId) => void;
}

function TodoCardComponent<T>({
    todo,
    onRightClick,
    onLeftClick,
    onRemove,
}: React.PropsWithChildren<TodoCardProps<T>>) {
    const handleLeftClick = () => {
        if (onLeftClick) {
            onLeftClick(todo);
        }
    };

    const handleRightClick = () => {
        if (onRightClick) {
            onRightClick(todo);
        }
    };

    const styles = useMemo(
        () =>
            ({
                backgroundColor: todo.dirty ? "red" : "inherit",
                position: "relative",
                alignItems: "center",
                width: "100%",
                display: "flex",
                border: "1px solid grey",
                minHeight: "150px",
                boxSizing: "border-box",
                justifyContent: "space-between",
                padding: "8px",
            } as React.CSSProperties),
        []
    );

    const RemoveButton = useCallback(() => {
        if (!onRemove) return <div>'sds'</div>;

        return (
            <div style={{ position: "absolute", right: 5, top: 5 }}>
                <button onClick={() => onRemove(todo.id)}>Close</button>
            </div>
        );
    }, [onRemove]);

    return (
        <div style={styles} data-testid={`todoCard-${todo.description}`}>
            <RemoveButton />
            {/*If not function is passed, left button should be disabled*/}
            <button disabled={!Boolean(onLeftClick)} onClick={handleLeftClick}>
                Left
            </button>
            <p>{todo.description}</p>
            {/*If not function is passed, right button should be disabled*/}
            <button disabled={!Boolean(onRightClick)} onClick={handleRightClick}>
                Right
            </button>
        </div>
    );
}

export default TodoCardComponent;
