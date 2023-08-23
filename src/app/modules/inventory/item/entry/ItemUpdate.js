import { Card, Divider, Text, TextInput, NumberInput, Select, Button, FileInput, Image, Center, Flex, Badge } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { useDocumentTitle } from "@mantine/hooks"
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { getReqeust, postRequest, putRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { useItemPayload } from "../useItemPayload";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { SaveButton } from "../../../../components/SaveButton";
import { useParams } from "react-router-dom";
import { IMAGE_URL } from "../../../../config/environment";

export const ItemUpdate = ({update, dataSource}) => {
    useDocumentTitle("Update and detail item");

    const dispatch = useDispatch();
    const params = useParams();

    const { itemUpdate } = useItemPayload;
    const [payload, setPayload] = useState(itemUpdate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const [itemCategories, setItemCategory] = useState([]);

    const uploadFileHandler = async (e) => {
        setLoading(true);
        setErrors(null);

        const formData = new FormData();
        formData.append('file', e);
        formData.append('method', 'PUT');

        const response = await postRequest("file/upload", formData);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Upload image process",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Upload image process",
                message: response.message,
                status: 'success'
            }));

            payloadHandler(payload, response.data.name, 'item_cover_photo', (updateValue) => {
                setPayload(updateValue);
                setLoading(false);
                setErrors(null);
            });

            return;
        }
    }

    const loadingCategories = useCallback(async () => {
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

    const submitUpdateItem = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`item/general/${params.id}`, payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Item update",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Item update",
                message: response.message,
                status: 'success'
            }));

            update(response.data);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        loadingCategories();
    }, [loadingCategories]);

    useEffect(() => {
        if(dataSource) {
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
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Item </Text>
                    <Badge color={payload.status === 'ACTIVE' ? 'green' : 'red'}> 
                        {payload.status}
                    </Badge>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center my={10}>
                    <Image 
                        width={"120px"}
                        height={"120px"}
                        src={payload.item_cover_photo ? `${IMAGE_URL}/${payload.item_cover_photo}` : null}
                        withPlaceholder
                    />
                </Center>

                <TextInput 
                    my={10}
                    placeholder="Enter item name"
                    label="Name"
                    disabled={loading}
                    value={payload.name}
                    withAsterisk
                    error={errors && errors['name'] && (<FormValidationMessage message={errors['name'][0]} />)}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'name', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <FileInput 
                    my={10}
                    placeholder="choose picture"
                    label="Item's image cover photo"
                    disabled={loading}
                    value={payload.item_cover_photo}
                    accept="image/png,image/jpeg"
                    error={errors && errors['item_cover_photo'] && (<FormValidationMessage message={errors['item_cover_photo'][0]} />)}
                    onChange={(e) => uploadFileHandler(e)}
                />

                <Select
                    dropdownPosition={'bottom'}
                    data={itemCategories}
                    value={payload.item_category_id}
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
                    value={payload.model}
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
                    value={payload.code}
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
                    value={payload.label}
                    error={errors && errors['label'] && (<FormValidationMessage message={errors['label'][0]} />)}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'label', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <TextInput 
                    my={10}
                    placeholder="Enter other name"
                    label="Other Name"
                    value={payload.other_name}
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
                    value={payload.make_in}
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
                    value={payload.packing}
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
                    value={payload.prebox}
                    error={errors && errors['prebox'] && (<FormValidationMessage message={errors['prebox'][0]} />)}
                    onChange={(e) => payloadHandler(payload, e, 'prebox', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <SaveButton
                    loading={loading}
                    submit={() => submitUpdateItem()}
                />
            </Card.Section>
        </Card>
    )
}