import { CreateUser } from "./entry/CreateUser";
import { UserDetail } from "./view/UserDetail";
import { UserList } from "./view/UserList";

export const userRoutes = [
    {
        path: "user",
        children: [
            {
                path: "",
                element: <UserList />
            },
            {
                path: "new",
                element: <CreateUser />
            },
            {
                path: ":id",
                element: <UserDetail />
            }
        ],
    }
];