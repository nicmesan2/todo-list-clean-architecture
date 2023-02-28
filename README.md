## TODO List - CleanArchitecture | Hexagonal Architecture | DDD

Although the following code is definitely an overkill for a simple todo list, it's aimed to show how a scalable and extensible
architecture can be implemented in the front-end using Clean Architecture, Hexagonal Architecture and Domain Driven Design patterns.
It also implements React as UI library since it's the most popular one nowadays and other programmers will find the example more useful.

To highlight how decoupled the code is, the following adapters have been implemented as the state manager service:
- LocalMemoryAdapter (just an in-memory implementation)
- LocalStorageAdapter (a browser's local storage implementation, adding persistence trough browser refreshes)
- ReduxAdapter (a Redux implementation)
- HTTPAdapter (a REST API implementation, this isn't a state manager implementation per-se but it serves as example)

On top of that, a SWR store implementation has also been added in order to demonstrate how the code can be easily adapted to use a different state manager library.

To try any of the above implementations:
 - Change the desired provider `TodoStateProvider/TodoSWRProvider` in the `App.tsx` file.
 - Change the `todoStateService` to the one you want in the `App.tsx` file. You can use either `useTodoStateLocalStorageAdapter,
   useTodoStateMemoryAdapter,
   useTodoStateHttpAdapter,
   useTodoStateReduxAdapter`
 - Change the `useTodo/useTodoSWRImplementation` hook in the `TodoLit.page.tsx` file to use the desired implementation.

**NOTES:**

- Only some tests have been written (unit and integration). More tests should be added though, specially for testing all adapters. (NOTE: Remember when testing to use the `useTodo` hook instead of the `useTodoSWRImplementation` hook in the `TodoLit.page.tsx` file.)
- No attention has been paid to styles. Neither visual styles, nor style system architecture. (just JS styles).
- Some product decisions have been arbitrarily made, such as the todo cards being ordered by date. This should be discussed with the project PM/PO/team in a real life situation.
- Error handling, both for domain expected errors and for unexpected errors (network, etc), has not been implemented.

## Requirements

Basic todo list, with the following functionality.

1. The list has 3 states. Each represented by a column. Similar to Trello.
   1. `Todo`
   2. `In Progress`
   3. `Done`
2. Each list item has a right and left arrow button.
   1. The right arrow moves the list item from:
      1. `Todo` to `In Progress`
      2. `In Progress` to `Done`
   2. The Left arrow moves the list item from
      1. `Done` to `In Progress`
      2. `In Progress` to `Todo`
3. If the list is in the `Todo` column, the left button should be disabled
4. If the list is in the `Done` column, the right button should be disabled.
5. There should be form with a text input below the buttons. When the user submits the form, the text from the text input should be added to a new todo item in the `Todo` column.
6. Every time a card is moved withing a session, the card should be marked as `dirty` (red background). When the user refreshes the page, no card should be marked as dirty.

## Quick Start

1. yarn install
2. yarn run start
3. open your browser to http://localhost:3000

---
