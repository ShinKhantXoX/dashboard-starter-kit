import { Badge, Card, Center, Divider, FileInput, Flex, Image, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { putRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { countryPayload } from "../countryPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";
import { useNavigate } from "react-router-dom";
import { FileButton } from "../../../components/FileButton";

export const UpdateCountry = ({ dataSource, update }) => {
    useDocumentTitle("User Detail And Update");

    const { countryUpdate } = countryPayload;

    const [payload, setPayload] = useState(dataSource?.name ? dataSource.name : '');
    const [mainPayload, setMainPayload] = useState()
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);
    console.log(selectImage);

    const submitUpdateCountry = async () => {
        setLoading(true);
        setErrors(null);

        const body = {
            name : payload,
            country_photo : mainPayload?.url
        }

        const response = await putRequest(`country/update/${id?.id}`, body);

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
            navigate("/country")
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
  
    console.log(mainPayload);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Contry </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={dataSource?.country_photo}
                        title={"File upload"}
                        />
                </Center>

                <TextInput 
                    my={10}
                    placeholder="Enter full name"
                    label="Name"
                    disabled={loading}
                    defaultValue={id?.name ? id.name : ''}
                    // value={id?.name}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => setPayload(e.target.value)}
                    
                />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateCountry()}
                />
            </Card.Section>
        </Card>
    )
}