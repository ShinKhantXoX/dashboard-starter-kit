import RecycleList from "./view/RecycleBinList";
import RecycleMedia from "./view/RecycleBinMedia";
import  RecycleBinMediaDetail  from "./view/RecycleBinMediaDetail";
import {RecycleQuery} from "./view/RecycleBinQuery";


export const recycleRoute = [
    {
        path: "bin",
        children: [
            {
                path: "",
                element: <RecycleList />
            },
            {
                path: ":id",
                element: <RecycleBinMediaDetail />
            },
            {
                path : "media",
                element : <RecycleMedia />,
                children : [

                ]
            },
            {
                path : "query",
                element : <RecycleQuery />
            },
        ],
    }
];