import React from "react";
import { render, fireEvent, within, screen } from "../test-utils";
import TodoListPage from "./TodoList.page";
import { LOCAL_STORAGE_KEY } from "../adapters";

const addNewTodo = (description: string) => {
    const addTodoButton = screen.getByText("Add Todo");
    const addTodoInput = screen.getByPlaceholderText("Enter description");

    fireEvent.change(addTodoInput, { target: { value: description } });
    fireEvent.click(addTodoButton);
};

describe("TodoList page", () => {
    beforeEach(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    });

    test("Initial screen", async () => {
        const { getByText, getByPlaceholderText, findByTestId } = render(<TodoListPage />);

        const title = getByText("Todo List!");
        expect(title).toBeDefined();

        const loading = getByText("Loading...");
        expect(loading).toBeDefined();

        const todoColumn = await findByTestId("TODO-column");
        const inProgressColumn = await findByTestId("IN_PROGRESS-column");
        const doneColumn = await findByTestId("DONE-column");

        expect(todoColumn).toBeDefined();
        expect(inProgressColumn).toBeDefined();
        expect(doneColumn).toBeDefined();

        expect(todoColumn).toHaveTextContent("To do");
        expect(inProgressColumn).toHaveTextContent("In progress");
        expect(doneColumn).toHaveTextContent("Done");

        const addTodoButton = getByText("Add Todo");
        const addTodoInput = getByPlaceholderText("Enter description");

        expect(addTodoButton).toBeDefined();
        expect(addTodoInput).toBeDefined();

        expect(addTodoButton).toBeDisabled();
    });

    test("Add new Todo", async () => {
        const { findByTestId } = render(<TodoListPage />);

        const todoColumn = await findByTestId("TODO-column");

        const description = "1";

        addNewTodo(description);

        const todoCard = await within(todoColumn).findByText(description);

        expect(todoCard).toBeDefined();

        const leftButton = within(todoColumn).getByText("Left");
        const rightButton = within(todoColumn).getByText("Right");

        expect(leftButton).toBeDisabled();
        expect(rightButton).toBeEnabled();
    });

    test("Move todo from 'todo' to 'done' and from 'done' to 'todo'", async () => {
        const { findByTestId } = render(<TodoListPage />);

        const todoColumn = await findByTestId("TODO-column");
        const inProgressColumn = await findByTestId("IN_PROGRESS-column");
        const doneColumn = await findByTestId("DONE-column");

        const description = "2";

        addNewTodo(description);

        let todoCard = await within(todoColumn).findByTestId(`todoCard-${description}`);
        let rightButton = within(todoCard).getByText("Right");

        expect(todoCard).toBeDefined();
        const todoCardDescription = within(todoCard).getByText(description);
        expect(todoCardDescription).toBeDefined();

        // Move card from 'todo' to 'in progress'
        fireEvent.click(rightButton);

        todoCard = await within(inProgressColumn).findByTestId(`todoCard-${description}`);
        rightButton = within(todoCard).getByText("Right");

        expect(todoCard).toBeDefined();

        // Move card from 'in progress' to 'done'
        fireEvent.click(rightButton);

        todoCard = await within(doneColumn).findByTestId(`todoCard-${description}`);
        rightButton = within(todoCard).getByText("Right");

        expect(todoCard).toBeDefined();
        expect(rightButton).toBeDisabled();

        todoCard = within(doneColumn).getByTestId(`todoCard-${description}`);
        let leftButton = within(todoCard).getByText("Left");

        // Move card from 'done' to 'in progress'
        fireEvent.click(leftButton);

        todoCard = await within(inProgressColumn).findByTestId(`todoCard-${description}`);
        leftButton = within(todoCard).getByText("Left");

        expect(todoCard).toBeDefined();

        // Move card from 'in progress' to 'todo'
        fireEvent.click(leftButton);

        todoCard = await within(todoColumn).findByTestId(`todoCard-${description}`);
        leftButton = within(todoCard).getByText("Left");

        expect(todoCard).toBeDefined();
        expect(leftButton).toBeDisabled();
    });
});
