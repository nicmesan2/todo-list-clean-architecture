import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AddTodoInput from "./AddTodoInput.component";

describe("AddTodoInput", () => {
    test("Renders input and disabled button", () => {
        const handleSubmit = jest.fn(() => {});

        const { getByText, getByPlaceholderText } = render(<AddTodoInput onSubmit={handleSubmit} />);

        const addTodoButton = getByText("Add Todo");
        const addTodoInput = getByPlaceholderText("Enter description");

        expect(addTodoButton).toBeDefined();
        expect(addTodoInput).toBeDefined();

        expect(addTodoButton).toBeDisabled();
    });

    test("Enters some value and clicks on add button", () => {
        const handleSubmit = jest.fn(() => {});

        const { getByText, getByPlaceholderText } = render(<AddTodoInput onSubmit={handleSubmit} />);

        const addTodoButton = getByText("Add Todo");
        const addTodoInput = getByPlaceholderText("Enter description") as HTMLInputElement;

        const description = "Example todo";

        fireEvent.change(addTodoInput, { target: { value: description } });

        expect(addTodoButton).toBeDefined();
        expect(addTodoInput).toBeDefined();

        expect(addTodoInput.value).toEqual(description);

        expect(addTodoButton).toBeEnabled();

        fireEvent.click(addTodoButton);

        expect(handleSubmit).toHaveBeenCalledTimes(1);

        expect(addTodoInput.value).toEqual("");

        expect(addTodoButton).toBeDisabled();
    });

    test("Should not submit on empty string value", () => {
        const handleSubmit = jest.fn(() => {});

        const { getByPlaceholderText } = render(<AddTodoInput onSubmit={handleSubmit} />);

        const addTodoInput = getByPlaceholderText("Enter description") as HTMLInputElement;

        fireEvent.submit(addTodoInput);

        expect(handleSubmit).toHaveBeenCalledTimes(0);
    });
});
