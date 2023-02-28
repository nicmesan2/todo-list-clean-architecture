import { createTodo, TodoStates } from "./Todo.entity";

jest.mock("shared/lib/uuid", () => ({
  __esModule: true, // this property makes it work
  default: "mockedDefaultExport",
  getUniqueId: () => "1",
}));

describe("Todo entity", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  test("Create a todo", () => {
    const description = "This is a todo description";

    const expectedTodo = {
      id: "1",
      state: TodoStates.TODO,
      createdAt: new Date(),
      description,
    };

    const newTodo = createTodo(description);

    expect(expectedTodo).toMatchObject(newTodo);
  });

  // Continue testing...
});
