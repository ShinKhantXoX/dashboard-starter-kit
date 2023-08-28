import {
    Card,
    Center,
    Divider,
    Flex,
    Grid,
    Group,
    Select,
    Text,
    TextInput,
  } from "@mantine/core";
  import { useDocumentTitle } from "@mantine/hooks";
  import { useCallback, useEffect, useState } from "react";
  import { FormValidationMessage } from "../../../components/FormValidationMessage";
  import { getReqeust, postRequest } from "../../../services/apiService";
  import { useDispatch, useSelector } from "react-redux";
  import { updateNotification } from "../../../redux/notificationSlice";
  import { SaveButton } from "../../../components/SaveButton";
  import { useNavigate } from "react-router-dom";
  import { NavButton } from "../../../components/NavButton";
  import { FileButton } from "../../../components/FileButton";
  
  export const CreateNewContent = () => {
    useDocumentTitle("New News Content");
  
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState();
    const [content, setContent] = useState('');
    const [news, setNews] = useState('');
    const [newId, setNewId] = useState();
    const [mainPayload, setMainPayload] = useState({
      title : '',
      sub_title : '',
      content : '',
      news_id : '',
      content_photo: ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  
    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("news/list");
        console.log(response);

        
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
            let itemData = response?.data?.map((new_id) => {
                return {
                    value : new_id?.id,
                    label: new_id?.title
                }
            });
            setNews(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);
  
    const submitCreateCountry = async () => {
      setLoading(true);
      setErrors(null);
    //   return;
  
      const response = await postRequest("news-content/create", mainPayload);
  
      if (response && response.errors) {
        setErrors(response.errors);
        setLoading(false);
        return;
      }
  
      if (response && (response.status === 500 || response.status === 403)) {
        dispatch(
          updateNotification({
            title: "Error: New Content create",
            message: response.message,
            status: "fail",
          })
        );
        setLoading(false);
        return;
      }
  
      if (response && response.status === 200) {
        dispatch(
          updateNotification({
            title: "New content create",
            message: response.message,
            status: "success",
          })
        );
        setLoading(false);
        return;
      }
    };
  
    useEffect(() => {
        setMainPayload({
          title : title,
          sub_title : subTitle,
          content : content,
          news_id : newId,
          content_photo: selectImage?.url
        })
    }, [selectImage, title, subTitle, content, newId])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="New Content List"
                click={() => navigate("/news-content")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create News Content </Text>
              <Divider variant="dashed" my={10} />
            </Card.Section>
  
            <Card.Section px={10}>
              <Center>
                  <FileButton 
                  id="file"
                      className="photo"
  
                      title={"File upload"}
                      />
              </Center>
  
            {
                news && (
                    <Select
                    label="Choose News"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={news ? news : null}
                    nothingFound="No new content Found"
                    clearable
                    disabled={loading}
                    // value={countryId}
                    maxDropdownHeight={100}
                    error={errors && errors['news'] && (<FormValidationMessage message={errors['news'][0]} />)}                      
                    onChange={(e) => setNewId(e)}
                />
                )
            }
  
              <TextInput
                my={10}
                placeholder="Enter full title"
                label="Title"
                disabled={loading}
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
                submit={() => submitCreateCountry()}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    );
  };
  