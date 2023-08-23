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
import { useItemCategoryPayload } from "../useItemCategoryPayload";
import { useState } from "react";

export const ItemCategoryCreate = () => {
    useDocumentTitle("New Item Category");

    const { itemCategoryCreate } = useItemCategoryPayload;
    const [payload, setPayload] = useState(itemCategoryCreate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitCreateItemCategory = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest("item/category", payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Item category create",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Item category create",
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
                            label="Item List"
                            click={() => navigate('/inventory/category')}
                        />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
                <Card p={20} className="card-border">
                    <Card.Section my={20}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Create Item Category </Text>
                        <Divider variant="dashed" my={10} />
                    </Card.Section>

                    <Card.Section px={10}>
                        <TextInput 
                            my={10}
                            placeholder="Enter item category name"
                            label="Name"
                            disabled={loading}
                            withAsterisk
                            error={errors && errors['name'] && (<FormValidationMessage message={errors['name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Remark"
                            label="Remark"
                            disabled={loading}
                            error={errors && errors['remark'] && (<FormValidationMessage message={errors['remark'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'remark', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <SaveButton 
                            loading={loading}
                            submit={() => submitCreateItemCategory()}
                        />
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}