import React from "react";
import TodoListPage from "./pages/TodoList.page";
import "./App.css";
// Use any of the following adapters
import {
  useTodoStateLocalStorageAdapter,
  useTodoStateMemoryAdapter,
  useTodoStateHttpAdapter,
  useTodoStateReduxAdapter,
} from "adapters";
// Use either of the following providers
import { TodoStateProvider, TodoSWRProvider } from "store";

function App() {
  const yourPreferredService = useTodoStateHttpAdapter();

  return (
    <TodoSWRProvider todoStateService={yourPreferredService}>
      <div
        className="App"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <header className="App-header">
          <div
            style={{
              marginLeft: 25,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h1>Welcome to the most over-engineered and ugly Todo List!</h1>
          </div>
        </header>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            margin: 16,
            overflow: "hidden",
            width: "calc(100vw - 50px)",
            maxHeight: "100%",
            background: "#fcfcfc",
            border: "1px solid #000000",
            boxSizing: "border-box",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: 40,
            padding: "16px 0",
          }}
        >
          <TodoListPage />
        </main>
      </div>
    </TodoSWRProvider>
  );
}

export default App;
