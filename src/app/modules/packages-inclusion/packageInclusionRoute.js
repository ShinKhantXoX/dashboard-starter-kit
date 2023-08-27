import { CreatePackageInclusion } from "./entry/CreatePackageInclusion";
import { PackageInclusionDetail } from "./view/PackageInclusionDetail";
import { PackageInclusionList } from "./view/PackageInclusionList";


export const packageInclusionRoute = [
    {
        path : "package-inclusion",
        children : [
            {
                path : '',
                element : <PackageInclusionList />
            },
            {
                path : 'new',
                element : <CreatePackageInclusion />
            },
            {
                path : ':id',
                element : <PackageInclusionDetail />
            }
        ]
    }
]