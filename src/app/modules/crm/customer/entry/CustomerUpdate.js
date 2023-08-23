import { Card, Divider, Text, TextInput, Select, Flex, Badge } from "@mantine/core"
import { useDispatch } from "react-redux";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { SaveButton } from "../../../../components/SaveButton";
import { useCustomerPayload } from "../useCustomerPayload";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const CustomerUpdate = ({ dataSource, update }) => {

    const { customerUpdate } = useCustomerPayload;
    const [payload, setPayload] = useState(customerUpdate);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState([]);
    const [description, setDescription] = useState([]);

    const dispatch = useDispatch();
    const params = useParams();

    const submitUpdateCustomer = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`crm/customer/${params.id}`, payload);

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
            update(response.data);
            setLoading(false);
            return;
        }
    }

    const loadingData = useCallback(async () => {
        const response = await getReqeust("general/status", { type: 'general'});
        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived general status",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setDescription(response.data.general.toString());
            let itemData = response.data.general.map((status) => {
                return {
                    value : status,
                    label: status
                }
            });
            setStatus(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);

    const loadingDataSource = useCallback(() => {
        if(dataSource) {
            setPayload(dataSource);
        }
    }, [dataSource]);


    useEffect(() => {
        loadingDataSource();
    }, [loadingDataSource]);

    useEffect(() => {
        loadingData();
    }, [loadingData]);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Customer </Text>
                    <Badge color={payload.status === 'ACTIVE' ? 'green' : 'red'}> 
                        {payload.status}
                    </Badge>
                </Flex>

                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <TextInput 
                    my={10}
                    placeholder="Enter customer name"
                    label="Name"
                    disabled={loading}
                    withAsterisk
                    value={payload.full_name || ""}
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
                    value={payload.phone || ""}
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
                    value={payload.email || ""}
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
                    value={payload.company_name || ""}
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
                    value={payload.position || ""}
                    error={errors && errors['position'] && (<FormValidationMessage message={errors['position'][0]} />)}
                    onChange={(e) => payloadHandler(payload, e.target.value, 'position', (updateValue) => {
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
                    submit={() => submitUpdateCustomer()}
                />
            </Card.Section>
        </Card>
    )
}