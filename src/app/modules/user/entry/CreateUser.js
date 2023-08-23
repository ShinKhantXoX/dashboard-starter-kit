import { Card, Divider, Flex, Grid, Group, PasswordInput, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { postRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { userPayload } from "../userPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../../components/NavButton";

export const CreateUser = () => {
    useDocumentTitle("New User");

    const { userCreate } = userPayload;
    const [payload, setPayload] = useState(userCreate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitCreateUser = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest("user", payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: User create",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "User create",
                message: response.message,
                status: 'success'
            }));
            setLoading(false);
            return;
        }
    }

    return(
        <Grid>
            <Grid.Col md={12}>
                <Flex
                    direction={"row"}
                    justify={"flex-end"}
                    align={"center"}
                >
                    <Group>
                        <NavButton
                            label="User List"
                            click={() => navigate('/user')}
                        />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
                <Card p={20} className="card-border">
                    <Card.Section my={20}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Create User </Text>
                        <Divider variant="dashed" my={10} />
                    </Card.Section>

                    <Card.Section px={10}>
                        <TextInput 
                            my={10}
                            placeholder="Enter full name"
                            label="Name"
                            disabled={loading}
                            error={errors && errors['name'] && (<FormValidationMessage message={errors['name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter username"
                            label="Username"
                            disabled={loading}
                            error={errors && errors['username'] && (<FormValidationMessage message={errors['username'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'username', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput
                            my={10}
                            type="email"
                            placeholder="Enter email address"
                            label="Email"
                            disabled={loading}
                            error={errors && errors['email'] && (<FormValidationMessage message={errors['email'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'email', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter phone number"
                            label="Phone Number"
                            disabled={loading}
                            error={errors && errors['phone'] && (<FormValidationMessage message={errors['phone'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'phone', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <PasswordInput 
                            my={10}
                            placeholder="Enter password"
                            label="Password"
                            disabled={loading}
                            error={errors && errors['password'] && (<FormValidationMessage message={errors['password'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'password', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <PasswordInput 
                            my={10}
                            placeholder="Enter confirm password"
                            label="Password"
                            disabled={loading}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'password_confirmation', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <SaveButton 
                            loading={loading}
                            submit={() => submitCreateUser()}
                        />
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}