import { Card, CardSection, Divider, Select, Text } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import { getReqeust, putRequest } from "../../../../services/apiService";
import { useItemPayload } from "../useItemPayload";
import { SaveButton } from "../../../../components/SaveButton";
import { useParams } from "react-router-dom";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { updateNotification } from "../../../../redux/notificationSlice";
import { useDispatch } from "react-redux";

export const ItemStatusChange = ({ dataSource, update }) => {

    const { itemUpdate} = useItemPayload;

    const params = useParams();
    const dispatch = useDispatch();

    const [payload, setPayload] = useState(itemUpdate);
    const [errors, setErrors] = useState(null);
    const [itemStatus, setItemStatus] = useState([]);
    const [description, setDescription] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setItemStatus(itemData);
            setLoading(false);
        }
    }, []);

    const loadingDataSource = useCallback(() => {
        if(dataSource) {
            setPayload(dataSource);
        }
    },[dataSource]);

    const submitItemStatusChange = async () => {
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
                title: "Error: Item status update",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Item status update",
                message: response.message,
                status: 'success'
            }));

            update(response.data);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        loadingData();
    }, [loadingData]);

    useEffect(() => {
        loadingDataSource();
    }, [loadingDataSource]);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Text sx={{ fontSize: 20, fontWeight: 500}}> Change Item Status </Text>
                <Divider variant="dashed" my={10} />
            </Card.Section>
            
            <CardSection>
                { itemStatus && itemStatus.length > 0 && (
                    <Select 
                        id="item_change_status"
                        label="Change item status"
                        description={description}
                        dropdownPosition={"bottom"}
                        data={itemStatus}
                        defaultValue={payload.status}
                        nothingFound="No Status Found"
                        clearable
                        disabled={loading}
                        maxDropdownHeight={100}
                        error={errors && errors['status'] && (<FormValidationMessage message={errors['status'][0]} />)}                      
                        onChange={(e) => payloadHandler(payload, e, 'status', (updateValue) => {
                            setPayload(updateValue);
                        })}
                    />
                )}

                <SaveButton 
                    loading={loading}
                    submit={() => submitItemStatusChange()}
                />
            </CardSection>
        </Card>
    )
}