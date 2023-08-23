import { Card, Divider, Flex, Grid, Group, Text, TextInput, NumberInput, Select, Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { useDocumentTitle } from "@mantine/hooks"
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { getReqeust, postRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { useItemPayload } from "../useItemPayload";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { SaveButton } from "../../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../../../components/NavButton";

export const ItemCreate = () => {
    useDocumentTitle("New Item");

    const { itemCreate } = useItemPayload;
    const [payload, setPayload] = useState(itemCreate);

    const [itemCategories, setItemCategory] = useState([]);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitCreateItemCategory = async (query) => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest('item/category', { name: query });

        if(response && response.errors) {
            if(response.errors['name']) {
                response.errors['item_categoy_id'] = response.errors['name'];
                delete response.errors['name'];
            }
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

            const itemCategory = { value: response.data.id, label: response.data.name }
            setItemCategory((current) => [...current, itemCategory]);
            setLoading(false);
            return itemCategory;
        }
    }

    const submitCreateItem = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest("item/general", payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Item create",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Item create",
                message: response.message,
                status: 'success'
            }));
            setLoading(false);
            return;
        }
    }

    const loadingData = useCallback(async () => {
        setLoading(true);
        setErrors(null);
        const response = await getReqeust('item/category', null);

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrive Item Categories",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setItemCategory(response.data.map((category) => {
                return {
                    value: category.id,
                    label: category.name
                }
            }));
            setLoading(false);
            setErrors(null);
            return;
        }
    }, [dispatch]);

    useEffect(() => {
        loadingData();
    }, [loadingData]);

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
                            click={() => navigate('/inventory/item')}
                        />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
                <Card p={20} className="card-border">
                    <Card.Section my={20}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Create Item </Text>
                        <Divider variant="dashed" my={10} />
                    </Card.Section>

                    <Card.Section px={10}>
                        <TextInput 
                            my={10}
                            placeholder="Enter item name"
                            label="Name"
                            disabled={loading}
                            withAsterisk
                            error={errors && errors['name'] && (<FormValidationMessage message={errors['name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <Select
                            dropdownPosition={'bottom'}
                            data={itemCategories}
                            label={"Item Category"}
                            placeholder={"Choose item category"}
                            withAsterisk
                            disabled={loading}
                            nothingFound="No Categories Found"
                            searchable
                            clearable
                            creatable
                            getCreateLabel={(query) => (
                                <Button 
                                    leftIcon={<IconPlus />}
                                    variant="outline"
                                    fullWidth
                                > 
                                    {query} 
                                </Button>
                            )}
                            onCreate={async (query) => {
                               // const item = { value: query, label: query };
                                await submitCreateItemCategory(query);
                            }}
                            error={errors && errors['item_category_id'] && (<FormValidationMessage message={errors['item_category_id'][0]} />)}                      
                            onChange={(e) => payloadHandler(payload, e, 'item_category_id', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter model"
                            label="Model"
                            withAsterisk
                            disabled={loading}
                            error={errors && errors['model'] && (<FormValidationMessage message={errors['model'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'model', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput
                            my={10}
                            placeholder="Enter code"
                            label="Code"
                            withAsterisk
                            disabled={loading}
                            error={errors && errors['code'] && (<FormValidationMessage message={errors['code'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'code', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter label"
                            label="Label"
                            disabled={loading}
                            error={errors && errors['label'] && (<FormValidationMessage message={errors['label'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'label', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter description"
                            label="Description"
                            disabled={loading}
                            error={errors && errors['description'] && (<FormValidationMessage message={errors['description'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'description', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter other name"
                            label="Other Name"
                            disabled={loading}
                            error={errors && errors['other_name'] && (<FormValidationMessage message={errors['other_name'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'other_name', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <TextInput 
                            my={10}
                            placeholder="Enter make in"
                            label="Make In"
                            disabled={loading}
                            error={errors && errors['make_in'] && (<FormValidationMessage message={errors['make_in'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e.target.value, 'make_in', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <NumberInput 
                            my={10}
                            placeholder="Enter packing"
                            description="support only numeric value"
                            label="Packing"
                            disabled={loading}
                            error={errors && errors['packing'] && (<FormValidationMessage message={errors['packing'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e, 'packing', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <NumberInput 
                            my={10}
                            description="support only numeric value"
                            placeholder="Enter prebox"
                            label="Prebox"
                            disabled={loading}
                            error={errors && errors['prebox'] && (<FormValidationMessage message={errors['prebox'][0]} />)}
                            onChange={(e) => payloadHandler(payload, e, 'prebox', (updateValue) => {
                                setPayload(updateValue);
                            })}
                        />

                        <SaveButton 
                            loading={loading}
                            submit={() => submitCreateItem()}
                        />
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}