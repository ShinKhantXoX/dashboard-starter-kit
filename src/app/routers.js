import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "./layout/DefaultLayout";
import { BlankLayout } from "./layout/BlankLayout";
import { Login } from "./modules/auth/entry/Login";
import { userRoutes } from "./modules/user/userRoutes";
import { countryRoute } from "./modules/country/countryRoute";
import { mediaRoute } from "./modules/media/mediaRoute";
import { cityRoute } from "./modules/city/cityRoute";
import { packageRoutes } from "./modules/packages/packageRoute";
import { tourRoutes } from "./modules/tour/tourRoute";
import { packageTourRoutes } from "./modules/packageTour/packageTourRoute";
import { inclusionRoute } from "./modules/inclusion/inclusionRoute";
import { itineraryRoute } from "./modules/itinerary/itineraryRoute";
import { packageItineraryRoute } from "./modules/packages-itinerary/packageItineraryRoute";
import { packageInclusionRoute } from "./modules/packages-inclusion/packageInclusionRoute";
import { newRoute } from "./modules/news/newRoute";
import { newContentRoute } from "./modules/news-content/newContentRoute";

export const routers = createBrowserRouter([
  {
    path: "",
    element: <DefaultLayout />,
    children: [
      ...userRoutes, 
      ...countryRoute,
      ...mediaRoute,
      ...cityRoute,
      ...packageRoutes,
      ...tourRoutes,
      ...packageTourRoutes,
      ...inclusionRoute,
      ...itineraryRoute,
      ...packageItineraryRoute,
      ...packageInclusionRoute,
      ...newRoute,
      ...newContentRoute
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
