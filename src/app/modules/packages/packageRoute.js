import { CreatePackage } from "./entry/CreatePackage";
import { PackageDetail } from "./view/PackageDetail";
import { PackageList } from "./view/PackageList";

export const packageRoutes = [
    {
        path: "package",
        children: [
            {
                path: "",
                element: <PackageList />
            },
            {
                path: "new",
                element: <CreatePackage />
            },
            {
                path: ":id",
                element: <PackageDetail />
            }
        ],
    }
];