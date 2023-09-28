import { Badge, Card, Center, Divider, FileInput, Flex, Image, Select, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { FileButton } from "../../../components/FileButton";

export const UpdateNews = ({ dataSource, update }) => {
    useDocumentTitle("News Detail And Update");

    const [title, setTitle] = useState(dataSource?.title ? dataSource.title : '');
    const [description, setDescription] = useState(dataSource?.description ? dataSource?.description : '')
    const [mainPayload, setMainPayload] = useState({
        title : '',
        description : '',
        title_photo: ''
      })
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);

    const submitUpdateNews = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`news/update/${dataSource?.id}`, mainPayload);

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
            navigate("/news")
            return;
        }
    }
    
    useEffect(() => {
        setMainPayload({
            title : title,
            description : description,
            title_photo : selectImage?.url ? selectImage?.url : dataSource?.title_photo
        })
    }, [selectImage, title,description])

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update News </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={dataSource?.title_photo}
                        title={"File upload"}
                        />
                </Center>

                <TextInput 
                    my={10}
                    placeholder="Enter full title"
                    label="Title"
                    disabled={loading}
                    name="title"
                    defaultValue={title}
                    error={errors && errors['title'] && <FormValidationMessage message={errors['title'][0]}/>}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <TextInput 
                    my={10}
                    placeholder="Enter full description"
                    label="Description"
                    disabled={loading}
                    name="description"
                    defaultValue={description}
                    error={errors && errors['description'] && <FormValidationMessage message={errors['description'][0]}/>}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateNews()}
                />
            </Card.Section>
        </Card>
    )
}