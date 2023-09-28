import { CreatePackageItinerary } from "./entry/CreatePackageItinerary";
import { PackageItineraryDetail } from "./view/PackageItineraryDetail";
import { PackageItineraryList } from "./view/PackageItineraryList";


export const packageItineraryRoute = [
    {
        path : "package-itinerary",
        children : [
            {
                path : '',
                element : <PackageItineraryList />
            },
            {
                path : 'new',
                element : <CreatePackageItinerary />
            },
            {
                path : ':id',
                element : <PackageItineraryDetail />
            }
        ]
    }
]