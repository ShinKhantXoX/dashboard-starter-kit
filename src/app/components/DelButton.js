import { Button, Divider, Flex, Modal, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { delRequest } from "../services/apiService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateNotification } from "../redux/notificationSlice";

export const DelButton = ({title, message, action, callbackUrl}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clickDeleteHandler = async () => {
        const response = await delRequest(action);

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Delete Process",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setLoading(false);
            close();
            navigate(callbackUrl);
        }
    }

    return(
        <>        
            <Button
                variant="outline"
                color="red"
                onClick={open}
                compact
            > 
                Delete 
            </Button>

            <Modal 
                opened={opened} 
                onClose={close} 
                title={title}
            > 
                <Divider variant="dashed" />
                <Text weight={700} my={20}> {message} </Text>

                <Flex
                    direction={"row"}
                    align={"center"}
                    justify={"flex-end"}
                >
                    <Button variant="outline" mx={10} disabled={loading} onClick={close}> Cancel </Button>
                    <Button variant="outline" color="red" disabled={loading} onClick={() => clickDeleteHandler()}> Delete </Button>
                </Flex>
            </Modal>
        </>

    )
} 