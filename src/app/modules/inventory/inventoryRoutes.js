import { ItemCreate } from "./item/entry/ItemCreate";
import { ItemDetail } from "./item/view/ItemDetail";
import { ItemList } from "./item/view/ItemList";
import { ItemCategoryCreate } from "./itemCategory/entry/ItemCategoryCreate";
import { CategoryDetail } from "./itemCategory/view/CategoryDetail";
import { CategoryList } from "./itemCategory/view/CategoryList";

export const inventoryRoutes = [
    {
        path: "inventory",
        children: [
            {
                path: "item",
                element: <ItemList />,
            },
            {
                path: "item/new",
                element: <ItemCreate />
            },
            {
                path: "item/:id",
                element: <ItemDetail />
            },
            {
                path: "category",
                element: <CategoryList />
            },
            {
                path: "category/new",
                element: <ItemCategoryCreate />
            },
            {
                path: "category/:id",
                element: <CategoryDetail />
            }
        ]
    }
];