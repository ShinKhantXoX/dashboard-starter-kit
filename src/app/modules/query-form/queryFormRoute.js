import QueryFormDetail from "./views/QueryFormDetail";
import { QueryFormList } from "./views/QueryFormList";


export const queryFormRoutes = [
    {
        path: "query-form",
        children: [
            {
                path: "",
                element: <QueryFormList />
            },
            // {
            //     path: "new",
            //     element: <CreateTour />
            // },
            {
                path: ":id",
                element: <QueryFormDetail />
            }
        ],
    }
];