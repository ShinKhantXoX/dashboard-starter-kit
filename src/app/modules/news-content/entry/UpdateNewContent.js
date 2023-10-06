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

export const UpdateNewContent = ({ dataSource, update }) => {
    useDocumentTitle("New Content Detail And Update");

    const [title, setTitle] = useState(dataSource?.title ? dataSource.title : '');
    const [subTitle, setSubTitle] = useState(dataSource?.subtitle ? dataSource.subtitle : '');
    const [content, setContent] = useState(dataSource?.content ? dataSource.content : '');
    const [news, setNews] = useState();
    const [newId, setNewId] = useState(dataSource?.news_id ? dataSource?.news_id : '');
    const [mainPayload, setMainPayload] = useState({
        title : '',
        subtitle : '',
        content : '',
        news_id : '',
        content_photo: ''
      })
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("news/list");

        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived news status",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            // setDescription(response.data.toString());
            let itemData = response?.data?.data?.map((country) => {
                return {
                    value : country?.id,
                    label: country?.title
                }
            });
            setNews(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);

    const submitUpdateNewContent = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`news-content/update/${dataSource?.id}`, mainPayload);

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
            navigate("/news-content")
            return;
        }
    }

    
    useEffect(() => {
        setMainPayload({
          title : title,
          subtitle : subTitle,
          content : content,
          news_id : newId,
          content_photo: selectImage?.url ? selectImage?.url : dataSource?.content_photo
        })
    }, [selectImage, title, subTitle, content, newId])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);

    console.log(dataSource);

    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update News Content </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={dataSource?.content_photo}
                        title={"File upload"}
                        />
                </Center>

                {
                news && (
                    <Select
                    label="Choose News"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={news}
                    // defaultValue={dataSource?.country_id}
                    nothingFound="No News Found"
                    clearable
                    name="news_id"
                    defaultValue={newId}
                    required={true}
                    disabled={loading}
                    maxDropdownHeight={100}
                    error={errors && errors['news_id'] && (<FormValidationMessage message={errors['news_id'][0]} />)}                      
                    onChange={(e) => setNewId(e)}
                />
                )
            }

                <TextInput
                my={10}
                placeholder="Enter full title"
                label="Title"
                disabled={loading}
                defaultValue={title}
                error={
                  errors &&
                  errors["title"] && (
                    <FormValidationMessage message={errors["title"][0]} />
                  )
                }
                onChange={(e) => setTitle(e.target.value)
                }
              />

              <TextInput
                my={10}
                placeholder="Enter full sub title"
                label="Sub Title"
                disabled={loading}
                defaultValue={subTitle}
                error={
                  errors &&
                  errors["sub_title"] && (
                    <FormValidationMessage message={errors["sub_title"][0]} />
                  )
                }
                onChange={(e) => setSubTitle(e.target.value)
                }
              />

              <TextInput
                my={10}
                placeholder="Enter full content"
                label="Content"
                disabled={loading}
                defaultValue={content}
                error={
                  errors &&
                  errors["content"] && (
                    <FormValidationMessage message={errors["content"][0]} />
                  )
                }
                onChange={(e) => setContent(e.target.value)
                }
              />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateNewContent()}
                />
            </Card.Section>
        </Card>
    )
}