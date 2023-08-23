import { Badge, Button, Card, Center, Divider, Flex, Modal, Table, Text, TextInput } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useCustomerPayload } from "../useCustomerPayload";
import { payloadHandler } from "../../../../helpers/payloadHandler";
import { FormValidationMessage } from "../../../../components/FormValidationMessage";
import { SaveButton } from "../../../../components/SaveButton";
import { delRequest, postRequest, putRequest } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { useParams } from "react-router-dom";

export const AddressInCustomer = ({ dataSource, update }) => {

    const { customerUpdate } = useCustomerPayload;
    const [addresses, setAddresses] = useState([]);
    const [openModal, setOpenModal] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [payload, setPayload] = useState(customerUpdate);

    const dispatch = useDispatch();
    const params = useParams();

    const submitCreateAddress = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest('crm/customer/address', {
            address: payload.address,
            customer_id: params.id
        });

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Create customer address",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Create customer address",
                message: response.message,
                status: 'success'
            }));  
            
            let updateDataSource = dataSource;
            updateDataSource.addresses.push(response.data);

            update(updateDataSource);
            setLoading(false);
            setOpenModal(false);
            return;
        }
    }

    const clickDeleteAddress = async (value) => {
        setLoading(true);
        setErrors(null);
        
        const response = await delRequest(`crm/customer/address/${value.id}`);

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: delete customer address",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Delete customer address",
                message: response.message,
                status: 'success'
            }));  
            
            let updateDataSource = {...dataSource};
            updateDataSource.addresses = addresses.filter(addressValue => addressValue.id !== response.data.id);

            update(updateDataSource);
            setLoading(false);
            setOpenModal(false);
            return;
        }
    }

    const clickSetDefault = async (value) => {
        setLoading(true);
        setErrors(null);
        
        const response = await putRequest(`crm/customer/address/${value.id}`, { is_default : !value.is_default });

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: update customer address",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "update customer address",
                message: response.message,
                status: 'success'
            }));  
            
            let updateDataSource = {...dataSource};

            updateDataSource.addresses = addresses.map((addressValue) => {
                if(addressValue.id === response.data.id) {
                    addressValue.is_default = response.data.is_default;
                } else {
                    addressValue.is_default = false
                }

                return addressValue;
            });

            update(updateDataSource);
            setLoading(false);
            setOpenModal(false);
            return;
        }
    }

    const loadingDataSource = useCallback(() => {
        if(dataSource) {
            setAddresses(dataSource.addresses);
            setPayload(dataSource);
        }
    },[dataSource]);

    useEffect(() => {
        loadingDataSource();
    }, [loadingDataSource]);

    return(
        <>
            <Card p={20} className="card-border">
                <Card.Section my={20}>
                    <Flex 
                        direction={"row"}
                        align={"center"}
                        justify={"space-between"}
                    >   
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Customer Addresses </Text>
                        <Button
                            variant="outline"
                            compact
                            onClick={() => setOpenModal(true)}
                        >
                            Add Address
                        </Button>
                    </Flex>
                    
                    <Divider variant="dashed" my={10} />
                </Card.Section>

                <Card.Section>
                    { addresses.length === 0 && (
                        <Center> 
                            <Text color="#e5e5e5"> No Address Found </Text>
                        </Center>
                    )}

                    {addresses.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th> Address </th>
                                    <th> Status </th>
                                    <th> Action </th>
                                </tr>
                            </thead>

                            <tbody>
                                {addresses.map((address, index) => {
                                    return (
                                        <tr key={`customer_address_index_${index}`}>
                                            <td> { address.address } </td>
                                            <td> 
                                                <Badge
                                                    color={address.is_default ? "green" : "cyan"}
                                                > 
                                                    { address.is_default ? "Default" : "Not Set"} 
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline"
                                                    compact
                                                    disabled={address.is_default}
                                                    onClick={() => clickSetDefault(address)}
                                                >
                                                    Set Default
                                                </Button>

                                                <Button
                                                    mx={10}
                                                    variant="outline"
                                                    color="red"
                                                    compact
                                                    onClick={() => clickDeleteAddress(address)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </Table>
                    )}
                </Card.Section>
            </Card>

            <Modal opened={openModal} onClose={() => setOpenModal(false)} title="Create Customer Address">
                <Modal.Body>
                    <TextInput 
                        my={10}
                        placeholder="Address"
                        label="Address"
                        disabled={loading}
                        withAsterisk
                        error={errors && errors['address'] && (<FormValidationMessage message={errors['address'][0]} />)}
                        onChange={(e) => payloadHandler(payload, e.target.value, 'address', (updateValue) => {
                            setPayload(updateValue)
                        })}
                    />

                    <SaveButton 
                        loading={loading}
                        submit={() => submitCreateAddress()}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}