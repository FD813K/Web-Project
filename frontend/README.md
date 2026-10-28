# React + Vite

## Run the frontend

From the project root, install the frontend dependencies and start the Vite server:

```sh
npm run install:frontend
npm run dev
```

The development server prints its local URL when it starts. Frontend scripts can also be run directly from `frontend/` with `npm install`, `npm run dev`, `npm run build`, or `npm run lint`.

On Windows PowerShell, if `npm` is blocked by the local execution policy, use `npm.cmd` instead (for example, `npm.cmd run dev`) or use a Command Prompt terminal. This avoids changing the machine-wide policy.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
