import { CreateNews } from "./entry/CreateNew";
import { NewDetail } from "./views/NewDetail";
import { NewList } from "./views/NewList";



export const newRoute = [
    {
        path : "news",
        children : [
            {
                path : '',
                element : <NewList />
            },
            {
                path : 'new',
                element : <CreateNews />
            },
            {
                path : ':id',
                element : <NewDetail />
            }
        ]
    }
]