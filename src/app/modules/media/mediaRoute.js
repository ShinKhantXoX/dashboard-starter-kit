import { MediaList } from "./view/MediaList";


export const mediaRoute = [
    {
        path: "media",
        children: [
            {
                path: "",
                element: <MediaList />
            },
        ],
    }
];