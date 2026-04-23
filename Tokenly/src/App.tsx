import { RouterProvider } from "react-router-dom";
import { router } from "./App/router";

export default function App() {
  return <RouterProvider router={router} />;
}

