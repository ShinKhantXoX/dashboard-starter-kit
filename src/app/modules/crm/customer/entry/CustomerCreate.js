import { Card, Divider, Flex, Grid, Group, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useDispatch } from "react-redux";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { postRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { SaveButton } from "../../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../../../components/NavButton";
import { useCustomerPayload } from "../useCustomerPayload";
import { useState } from "react";

export const CustomerCreate = () => {
    useDocumentTitle("New Customer");

    const { customerUpdate } = useCustomerPayload;
    const [payload, setPayload] = useState(customerUpdate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitCreateCustomer = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest("crm/customer", payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Customer create",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Customer create",
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
                            label="Customer List"
                            click={() => navigate('/crm/customer')}
                        />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
                <Card p={20} className="card-border">
                    <Card.Section my={20}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Create Customer </Text>
                        <Divider variant="dashed" my={10} />
                    </Card.Section>

                    <Card.Section px={10}>
                        <TextInput 
                            my={10}
                            placeholder="Enter customer name"
                            label="Name"
                            disabled={loading}
                            withAsterisk
                            error={errors && errors['full_name'] && (<FormValidationMessage message={errors['full_name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'full_name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Phone"
                            label="Phone"
                            withAsterisk
                            disabled={loading}
                            error={errors && errors['phone'] && (<FormValidationMessage message={errors['phone'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'phone', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            type={"email"}
                            placeholder="Email"
                            label="Email"
                            disabled={loading}
                            error={errors && errors['email'] && (<FormValidationMessage message={errors['email'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'email', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Company Name"
                            label="Company"
                            disabled={loading}
                            error={errors && errors['company_name'] && (<FormValidationMessage message={errors['company_name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'company_name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Position"
                            label="Position"
                            disabled={loading}
                            error={errors && errors['position'] && (<FormValidationMessage message={errors['position'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'position', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <SaveButton 
                            loading={loading}
                            submit={() => submitCreateCustomer()}
                        />
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}