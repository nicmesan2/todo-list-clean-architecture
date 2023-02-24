import React, { useState } from "react";

interface AddTodoInputProps {
    onSubmit: (newValue: string) => void;
}

const AddTodoInput: React.FC<AddTodoInputProps> = ({ onSubmit }) => {
    const [newTodoDescription, setNewTodoDescription] = useState("");

    const handleNewTodoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoDescription(e.target.value);
    };

    const handleOnSubmit = (e: any) => {
        // avoid page refresh
        e.preventDefault();

        // only allow to submit non-empty strings
        if (!newTodoDescription) return;

        // clear input
        setNewTodoDescription("");

        onSubmit(newTodoDescription);
    };

    return (
        <form onSubmit={handleOnSubmit}>
            <input
                placeholder="Enter description"
                value={newTodoDescription}
                onChange={handleNewTodoInputChange}
                style={{ marginRight: 8, height: 30 }}
            />
            <button style={{ height: 36 }} disabled={!newTodoDescription} type="submit">
                Add Todo
            </button>
        </form>
    );
};

export default React.memo(AddTodoInput);
