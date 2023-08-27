import { Button, Flex, Group, Header, Image, Text } from "@mantine/core"
import { IconUser,IconMenu2,IconLogin } from "@tabler/icons-react";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { drawerOpen, drawerToggle } from "../../redux/drawerSlice";
import defaultLogo from "../../assets/images/defaultLogo.png";
import { useNavigate } from "react-router-dom";
import { updateNotification } from "../../redux/notificationSlice";

export const DefaultHeader = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    const [token , setToken] = useState(localStorage.getItem("token"));
    
    const drawerState = useSelector(state => state.drawer);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if(drawerState) {
            setOpenMenu(drawerState);
            dispatch(drawerOpen(openMenu));
        }
    },[drawerState, dispatch, openMenu]);

    return(
        <Header height={60} p="xs">
            <Flex
                direction={"row"}
                align={"center"}
                justify={"space-between"}
            >
                <Group className="group-row">
                    <Image 
                        src={defaultLogo} 
                        withPlaceholder 
                        width={40}
                        height={40}
                    />
                    <Text> Shop Name </Text>
                </Group>
                
                <Group>
                    <IconMenu2
                    onClick={() => dispatch(drawerToggle())}
                    />
                    {
                     token ? (
                        <Button
                        leftIcon={<IconUser />}
                        variant="outline"
                        onClick={() => (
                            localStorage.removeItem("token"),
                            navigate('/auth/login'),
                            dispatch(
                                updateNotification({
                                  title: "Logout success",
                                  message: "User logout successfully",
                                  status: "success",
                                })
                              )
                        )}
                        > 
                            Logout 
                        </Button>
                     ) : (
                        <Button
                        leftIcon={<IconLogin />}
                        variant="outline"
                        onClick={() => navigate('/auth/login')}
                        > 
                            Login 
                        </Button>
                     )   
                    }
                </Group>
                
            </Flex>
        </Header>
    )
}