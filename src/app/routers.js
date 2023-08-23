import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "./layout/DefaultLayout";
import { BlankLayout } from "./layout/BlankLayout";
import { Login } from "./modules/auth/entry/Login";
import { userRoutes } from "./modules/user/userRoutes";
import { inventoryRoutes } from "./modules/inventory/inventoryRoutes";
import { crmRoutes } from "./modules/crm/customer/crmRoutes";

export const routers = createBrowserRouter([
  {
    path: "",
    element: <DefaultLayout />,
    children: [
      ...userRoutes, 
      ...inventoryRoutes,
      ...crmRoutes
    ],
  },
  {
    path: "auth",
    element: <BlankLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
