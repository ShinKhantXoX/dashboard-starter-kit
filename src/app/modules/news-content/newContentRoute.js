import { CreateNewContent } from "./entry/CreateNewContent";
import { NewContentDetail } from "./view/NewContentDetail";
import { NewContentList } from "./view/NewContentList";



export const newContentRoute = [
    {
        path : "news-content",
        children : [
            {
                path : '',
                element : <NewContentList />
            },
            {
                path : 'new',
                element : <CreateNewContent />
            },
            {
                path : ':id',
                element : <NewContentDetail />
            }
        ]
    }
]