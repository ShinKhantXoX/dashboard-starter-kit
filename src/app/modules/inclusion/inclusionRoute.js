import { CreateInclusion } from "./entry/CreateInclusion";
import { InclusionDetail } from "./view/InclusionDetail";
import { InclusionList } from "./view/InclusionList";


export const inclusionRoute = [
    {
        path : "inclusion",
        children : [
            {
                path : '',
                element : <InclusionList />
            },
            {
                path : 'new',
                element : <CreateInclusion />
            },
            {
                path : ':id',
                element : <InclusionDetail />
            }
        ]
    }
]