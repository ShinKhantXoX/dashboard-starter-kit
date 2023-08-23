import { Badge, Card, Divider, Flex, Select, Text, TextInput } from "@mantine/core"
import { useItemCategoryPayload } from "../useItemCategoryPayload";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { SaveButton } from "../../../../components/SaveButton";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { getReqeust, putRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";

export const ItemCategoryUpdate = ({ dataSource, update }) => {

    const { itemCategoryUpdate } = useItemCategoryPayload;
    const [payload, setPayload] = useState(itemCategoryUpdate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(null);
    const [status, setStatus] = useState([]);

    const dispatch = useDispatch();
    const params = useParams();

    const submitUpdateItemCategory = async () => {
        const response = await putRequest(`item/category/${params.id}`, payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Update item category",
                message: response.message,
                status: 'fail'
            }));  
            update(response.data);
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Update item category",
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
        const response = await getReqeust(`general/status`, { type: "general" });

        if(response.status === 200) {
            setDescription(response.data.general.toString());
            let itemData = response.data.general.map((status) => {
                return {
                    value : status,
                    label: status
                }
            });
            setStatus(itemData);
            setLoading(false);
        }
    }, []);

    const loadingDataSource = useCallback(() => {
        if(dataSource) {
            setPayload(dataSource);
        }
    },[dataSource]);

    useEffect(() => {
        loadingData();
    },[loadingData]);

    useEffect(() => {
        loadingDataSource();
    },[loadingDataSource])

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Item Category </Text>
                    <Badge color={payload.status === 'ACTIVE' ? 'green' : 'red'}> 
                        {payload.status}
                    </Badge>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <TextInput 
                    my={10}
                    placeholder="Enter item category name"
                    label="Name"
                    disabled={loading}
                    withAsterisk
                    value={payload.name || ""}
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
                    value={payload.remark || ""}
                    error={errors && errors['remark'] && (<FormValidationMessage message={errors['remark'][0]} />)}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'remark', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <Select 
                    label="Change status"
                    description={description}
                    dropdownPosition={"bottom"}
                    data={status}
                    defaultValue={payload.status || ''}
                    nothingFound="No Status Found"
                    clearable
                    disabled={loading}
                    value={payload.status}
                    maxDropdownHeight={100}
                    error={errors && errors['status'] && (<FormValidationMessage message={errors['status'][0]} />)}                      
                    onChange={(e) => payloadHandler(payload, e, 'status', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateItemCategory()}
                />
            </Card.Section>
        </Card>
    )
}