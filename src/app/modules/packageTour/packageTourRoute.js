import { CreatePackageTour } from "./entry/CreatePackageTour";
import { PackageTourDetail } from "./view/PackageTourDetail";
import { PackageTourList } from "./view/PackageTourList";

export const packageTourRoutes = [
    {
        path: "package-tour",
        children: [
            {
                path: "",
                element: <PackageTourList />
            },
            {
                path: "new",
                element: <CreatePackageTour />
            },
            {
                path: ":id",
                element: <PackageTourDetail />
            }
        ],
    }
];