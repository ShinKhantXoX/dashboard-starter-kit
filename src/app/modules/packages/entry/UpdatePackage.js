import { Card, Center, Divider, Flex, Select, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { FileButton } from "../../../components/FileButton";

export const UpdatePackage = ({ dataSource, update }) => {
    useDocumentTitle("Package Detail And Update");

    const [payload, setPayload] = useState(dataSource?.name ? dataSource.name : '');
    const [country, setCountry] = useState();
    const [prevImage , setPrevImage] = useState(dataSource?.package_photo ? dataSource?.package_photo : null);
    const [countryId, setCountryId] = useState(dataSource?.country_id ? dataSource?.country_id : '');
    const [mainPayload, setMainPayload] = useState({
        name : '',
        country_id : '',
        package_photo: ''
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

    const submitUpdatePackage = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`package/update/${id?.id}`, mainPayload);

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
            navigate("/package")
            return;
        }
    }

    useEffect(() => {
        if(dataSource) {
            setId(dataSource);
        }
    },[dataSource]);
    
    useEffect(() => {
        setMainPayload({
            name : payload,
            country_id : countryId,
            package_photo : selectImage?.url ? selectImage?.url : prevImage
        })
    }, [selectImage, payload, countryId])
  
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
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Package </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={prevImage}
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
                    value={id?.country_id ? id.country_id : ''}
                    maxDropdownHeight={100}
                    error={errors && errors['status'] && (<FormValidationMessage message={errors['status'][0]} />)}                      
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
                    defaultValue={id?.name ? id.name : ''}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => setPayload(e.target.value)}
                    required
                />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdatePackage()}
                />
            </Card.Section>
        </Card>
    )
}