import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/Authentication/register";
import Login from "./components/Authentication/login";
import AddPackage from "./components/Admin/AddPackage";
import ListTourPackages from "./components/Admin/Dashboard";
import ViewPackage from "./components/User/ViewPackage";
import EditPackage from "./components/Admin/EditPackage";
import TourPackageListUser from"./components/User/Dashboard";
import SearchPackage from"./components/User/Dashboard";
import YourBooking from "./components/Booking/YourBooking";
import UpdateProfile from "./components/Authentication/updateprofile";
import GetProfile from "./components/Authentication/getprofile";
const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/admin/dashboard", element: <ListTourPackages /> },
    { path: "/dashboard", element: <TourPackageListUser /> },
    { path: "/admin/create", element: <AddPackage /> },
    { path: "/view/:postId", element: <ViewPackage /> },
    { path: "/admin/edit/:postId", element: <EditPackage /> },
    { path: "/booking", element: <YourBooking /> },
    { path: "/update-profile", element: <UpdateProfile /> },
    { path:"/getprofile",element:<GetProfile/>},
    { path: "/search", element: <SearchPackage /> },
]);
export default router;