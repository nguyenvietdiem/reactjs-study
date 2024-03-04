import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CategoryPage from "./category/page";

const routes = [{ path: "/", element: <CategoryPage /> }];

function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
