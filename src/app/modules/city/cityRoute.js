import { CreateCity } from "./entry/CreateCity";
import { CityDetail } from "./view/CityDetail";
import { CityList } from "./view/CityList";


export const cityRoute = [
    {
        path : "city",
        children : [
            {
                path : '',
                element : <CityList />
            },
            {
                path : 'new',
                element : <CreateCity />
            },
            {
                path : ':id',
                element : <CityDetail />
            }
        ]
    }
]