import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CategoryPage from "./category/page";
import ProductPage from "./product/page";

const routes = [
  { path: "/", element: <CategoryPage /> },
  { path: "/product", element: <ProductPage /> },
];

function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
