import { Button, Flex, Group, Header, Image, Text } from "@mantine/core"
import { IconUser,IconMenu2 } from "@tabler/icons-react";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { drawerOpen, drawerToggle } from "../../redux/drawerSlice";
import defaultLogo from "../../assets/images/defaultLogo.png";

export const DefaultHeader = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    
    const drawerState = useSelector(state => state.drawer);
    const dispatch = useDispatch();

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
                    <Button
                        leftIcon={<IconUser />}
                        variant="outline"
                    > 
                        Logout 
                    </Button>
                </Group>
                
            </Flex>
        </Header>
    )
}