import { Badge, Card, Center, Divider, FileInput, Flex, Image, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { putRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { userPayload } from "../userPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";

export const UpdateUser = ({ dataSource, update }) => {
    useDocumentTitle("User Detail And Update");

    const { userUpdate } = userPayload;

    const [payload, setPayload] = useState(userUpdate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const submitUpdateUser = async () => {
        setLoading(true);
        setErrors(null);
        const response = await putRequest(`user/${payload.id}`, payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 401 || response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "User Update",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Update",
                message: response.message,
                status: 'success'
            }));
            update(response.data);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        if(dataSource) {
            console.log(dataSource);
            setPayload(dataSource);
        }
    },[dataSource]);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update User </Text>
                    <Badge color={payload.status === 'ACTIVE' ? 'green' : 'red'}> 
                        {payload.status}
                    </Badge>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <Image 
                        width={80}
                        height={80}
                        my={10}
                        radius={"50%"}
                        src={null}
                        withPlaceholder
                    />
                </Center>
                
                <FileInput 
                    my={10}
                    placeholder="Upload profile picture"
                    label="Profile Picture"
                    color="gray"
                    disabled={loading}
                    value={payload.profile}
                    error={errors && errors['profile'] && <FormValidationMessage message={errors['profile'][0]}/>}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'profile', (updatePayload) => {
                        setPayload(updatePayload);
                    })}
               />

                <TextInput 
                    my={10}
                    placeholder="Enter full name"
                    label="Name"
                    disabled={loading}
                    value={payload.name}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'name', (updatePayload) => {
                        setPayload(updatePayload);
                    })}
                />

                <TextInput 
                    my={10}
                    placeholder="Enter username"
                    label="Username"
                    disabled={loading}
                    value={payload.username}
                    error={errors && errors['username'] && <FormValidationMessage message={errors['username'][0]}/>}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'username', (updatePayload) => {
                        setPayload(updatePayload);
                    })}
                />

                <TextInput
                    my={10}
                    type="email"
                    placeholder="Enter email address"
                    label="Email"
                    disabled={loading}
                    value={payload.email}
                    error={errors && errors['email'] && <FormValidationMessage message={errors['email'][0]}/>}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'email', (updatePayload) => {
                        setPayload(updatePayload);
                    })}
                />

                <TextInput 
                    my={10}
                    placeholder="Enter phone number"
                    label="Phone Number"
                    disabled={loading}
                    value={payload.phone}
                    error={errors && errors['phone'] && <FormValidationMessage message={errors['phone'][0]}/>}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'phone', (updatePayload) => {
                        setPayload(updatePayload);
                    })}
                />

                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateUser()}
                />
            </Card.Section>
        </Card>
    )
}