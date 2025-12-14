# Task Tracker Application

A modern **Task Tracker** web application built using **Angular 17/18** following best practices such as standalone components, signals, route guards, and unit testing.

This project was developed as part of a technical assignment and covers all the required features mentioned in the task.

---

## Features

### Authentication
- Mocked login (`admin / admin`)
- Authentication state persisted using `localStorage`
- Route guards to protect secured pages
- Logout functionality (clears all stored data)

### Task Management (CRUD)
- Create, read, update, and delete tasks
- Tasks stored in `localStorage`
- Optimistic UI updates

### Filter & Sort
- Filter tasks by:
  - Status (TODO / IN_PROGRESS / DONE)
  - Priority (Low / Medium / High)
- Sort tasks by:
  - Status
  - Priority
- Supports ascending and descending order

### Pagination
- Client-side pagination
- Configurable page size
- Pagination works with filter & sorting

### Unit Testing
- Basic unit tests for:
  - AuthService
  - TaskStore
  - LoginComponent
- Uses Angular 17 default testing setup (Vitest)

### UI / UX
- Built using Angular Material
- Responsive layout
- Empty state message when no tasks exist
- Success messages on task actions

---

## Tech Stack

- **Angular 17 / 18**
- Standalone Components
- Angular Signals
- Angular Router
- Reactive Forms
- Angular Material UI
- LocalStorage
- Route Guards
- Http Interceptor (auth-ready)
- Unit Testing with Vitest

---

## Project Structure

src/app
├── core
│ ├── auth
│ │ ├── auth.service.ts
│ │ ├── auth.guard.ts
│ ├── http
│ │ ├── auth.interceptor.ts
├── features
│ ├── tasks
│ │ ├── task.model.ts
│ │ ├── task.store.ts
│ │ ├── task-list.component.ts
│ │ ├── task-form.component.ts
├── pages
│ ├── login.component.ts
│ ├── not-found.component.ts
├── app.routes.ts
├── app.component.ts


---

## Login Credentials

Username: admin
Password: admin


---

## How to Run the Application

### Install dependencies
```bash
npm install

Start development server

ng serve

Run Unit Tests

ng test




