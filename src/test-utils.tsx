import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { TodoStateProvider } from "./store";
import { useTodoStateMemoryAdapter, useTodoStateHttpAdapter } from "adapters/TodoState";

const AllTheProviders: React.FC = ({ children }) => {
  const aService = useTodoStateMemoryAdapter();
  return (
    <TodoStateProvider todoStateService={aService}>
      {children}
    </TodoStateProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
