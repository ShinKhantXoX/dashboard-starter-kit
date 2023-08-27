import { Badge, Card, Center, Divider, FileInput, Flex, Image, Select, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { cityPayload } from "../cityPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";
import { useNavigate } from "react-router-dom";
import { FileButton } from "../../../components/FileButton";

export const UpdateCity = ({ dataSource, update }) => {
    useDocumentTitle("City Detail And Update");

    const { cityUpdate } = cityPayload;

    const [payload, setPayload] = useState(dataSource?.name ? dataSource.name : '');
    const [country, setCountry] = useState();
    const [countryId, setCountryId] = useState(dataSource?.country_id ? dataSource?.country_id : '');
    const [mainPayload, setMainPayload] = useState({
        name : '',
        country_id : '',
        country_photo: ''
      })
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("country/list");

        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived country status",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            // setDescription(response.data.toString());
            let itemData = response?.data?.map((country) => {
                return {
                    value : country?.id,
                    label: country?.name
                }
            });
            setCountry(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);

    const submitUpdateCountry = async () => {
        setLoading(true);
        setErrors(null);

        const body = {
            name : payload,
            country_id : countryId,
            city_photo : mainPayload?.url
        }

        const response = await putRequest(`city/update/${id?.id}`, body);

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
            navigate("/city")
            return;
        }
    }

    useEffect(() => {
        if(dataSource) {
            setId(dataSource);
        }
    },[dataSource]);
    
    useEffect(() => {
        setMainPayload(selectImage)
    }, [selectImage, payload])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);

    console.log(id);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update City </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={dataSource?.city_photo}
                        title={"File upload"}
                        />
                </Center>

                {
                country && (
                    <Select
                    label="Choose Country"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={country}
                    // defaultValue={dataSource?.country_id}
                    nothingFound="No City Found"
                    clearable
                    name="country_id"
                    required={true}
                    disabled={loading}
                    maxDropdownHeight={100}
                    error={errors && errors['city'] && (<FormValidationMessage message={errors['city'][0]} />)}                      
                    onChange={(e) => setCountryId(e)}
                />
                )
            }

                <TextInput 
                    my={10}
                    placeholder="Enter full name"
                    label="Name"
                    disabled={loading}
                    name="name"
                    defaultValue={id?.name}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => setPayload(e.target.value)}
                    required
                />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateCountry()}
                />
            </Card.Section>
        </Card>
    )
}