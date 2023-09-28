import { CreateTour } from "./entry/CreateTour";
import { TourDetail } from "./view/TourDetail";
import { TourList } from "./view/TourList";

export const tourRoutes = [
    {
        path: "tour",
        children: [
            {
                path: "",
                element: <TourList />
            },
            {
                path: "new",
                element: <CreateTour />
            },
            {
                path: ":id",
                element: <TourDetail />
            }
        ],
    }
];