import TrashList from "./view/TrashList";
import TrashMediaList from "./view/TrashMediaList";



export const trashRoute = [
    {
        path: "bin",
        children: [
            {
                path: "",
                element: <TrashList />
            },
            {
                path : "media",
                element : <TrashMediaList />
            }
        ],
    }
];