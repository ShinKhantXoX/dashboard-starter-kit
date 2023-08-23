import { Card, Center, Divider, FileInput, Flex, Group, Image, Text } from "@mantine/core"
import { TextEditor } from "../../../../components/TextEditor"
import { useEffect, useState } from "react"
import { useItemPayload } from "../useItemPayload"
import { payloadHandler } from "../../../../helpers/payloadHandler"
import { FormValidationMessage } from "../../../../components/FormValidationMessage"
import { useDispatch } from "react-redux"
import { updateNotification } from "../../../../redux/notificationSlice"
import { postRequest, putRequest } from "../../../../services/apiService"
import { IMAGE_URL } from "../../../../config/environment"
import { SaveButton } from "../../../../components/SaveButton"
import { useParams } from "react-router-dom"
import { IconTrash } from "@tabler/icons-react"

export const ItemDescriptonChange = ({dataSource, update}) => {

    const { itemUpdate } = useItemPayload;

    const dispatch = useDispatch();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [payload, setPayload] = useState(itemUpdate);

    const removePhotoHandler = (e) => {
        let updatePayload = {...payload};
        let getItemPhoto = updatePayload.item_photos.filter(value => value !== e);
        updatePayload.item_photos = getItemPhoto;
        setPayload(updatePayload);
    }

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

            let updateFeatureItems = payload.item_photos ? payload.item_photos : [];

            updateFeatureItems.push(response.data.name);
            
            payloadHandler(payload, updateFeatureItems, 'item_photos', (updateValue) => {
                setPayload(updateValue);
                setLoading(false);
                setErrors(null);
            });
            return;
        }
    }

    const submitItemDescriptionChange = async () => {
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
                title: "Error: Item feature updated",
                message: response.message,
                status: 'fail'
            }));
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Update Item Feature",
                message: response.message,
                status: 'success'
            }));

            update(response.data);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        if(dataSource) {
            setPayload(dataSource);
        }
    },[dataSource]);

    return (
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Item Description </Text>
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section>
                <FileInput 
                    my={10}
                    placeholder="choose picture"
                    label="Feature item images"
                    disabled={loading}
                    accept="image/png,image/jpeg"
                    error={errors && errors['item_photos'] && (<FormValidationMessage message={errors['item_photos'][0]} />)}
                    onChange={(e) => uploadFileHandler(e)}
                />

                <Flex
                    direction={"row"}
                    align={payload.item_photos ? "flex-start" : "center"}
                    justify={payload.item_photos ? "flex-start" : "center"}
                    wrap={"wrap"}
                    h={250}
                    my={10}
                    sx={{
                        border: "1px solid #ededed",
                        overflow: "hidden",
                        overflowY: "scroll"
                    }}
                >
                    {!payload.item_photos && (
                        <Center> 
                            <Text color="#E5E5E5"> No Feature Photo Found </Text>
                        </Center>
                    )}
                    { payload.item_photos && payload.item_photos.length > 0 && payload.item_photos.map((value, index) => {
                        return (
                            <Group className="image-list-wrapper" key={`item_feature_image_id_${index}`}>
                                <Image 
                                    className="image-item"
                                    width={"100px"}
                                    height={"100px"}
                                    src={value ? `${IMAGE_URL}/${value}` : null}
                                />
                                <IconTrash 
                                    className="trash-icon"
                                    onClick={() => removePhotoHandler(value)}
                                />
                            </Group>
                        )
                    })}
                </Flex>

                <TextEditor 
                    my={10}
                    dataSource={dataSource}
                    loading={loading}
                    error={errors}
                    onEdit={(e) => payloadHandler(payload, e, 'description', (updateValue) => {
                        setPayload(updateValue);
                    })}
                />

                <SaveButton 
                    loading={loading}
                    submit={() => submitItemDescriptionChange()}
                />
            </Card.Section>
        </Card>
    )
}