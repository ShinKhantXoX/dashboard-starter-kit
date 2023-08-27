import { CreateItinerary } from "./entry/CreateItinerary";
import { UpdateItinerary } from "./entry/UpdateItinerary";
import { ItineraryDetail } from "./view/ItineraryDetail";
import { ItineraryList } from "./view/ItineraryList";


export const itineraryRoute = [
    {
        path : "itinerary",
        children : [
            {
                path : '',
                element : <ItineraryList />
            },
            {
                path : 'new',
                element : <CreateItinerary />
            },
            {
                path : ':id',
                element : <ItineraryDetail />
            }
        ]
    }
]