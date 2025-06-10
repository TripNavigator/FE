import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import SearchPage from "../pages/SearchPage";
import RoadViewPage from "../pages/RoadViewPage";
import FavPage from "../pages/favPage";
import MyPage from "../pages/myPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/searchPage",
    element: <SearchPage />,
  },
  {
    path: "/roadview",
    element: <RoadViewPage />
  },
  {
    path: "/favPage",
    element: <FavPage />
  },
  {
    path: "/myPage",
    element: <MyPage />
  },
]);

export default router;
