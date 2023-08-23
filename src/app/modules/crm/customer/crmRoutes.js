import { CustomerCreate } from "./entry/CustomerCreate";
import { CustomerDetail } from "./view/CustomerDetail";
import { CustomerList } from "./view/CustomerList";

export const crmRoutes = [
    {
        path: "crm",
        children: [
            {
                path: "customer",
                element: <CustomerList />
            },
            {
                path: "customer/new",
                element: <CustomerCreate />
            },
            {
                path: "customer/:id",
                element: <CustomerDetail />
            }
        ]
    }
]