import { CreateCountry } from "./entry/CreateCountry";
import { UpdateCountry } from "./entry/UpdateCountry";
import { CountryDetail } from "./view/CountryDetail";
import { CountryList } from "./view/CountryList";


export const countryRoute = [
    {
        path : "country",
        children : [
            {
                path : '',
                element : <CountryList />
            },
            {
                path : 'new',
                element : <CreateCountry />
            },
            {
                path : ':id',
                element : <CountryDetail />
            }
        ]
    }
]