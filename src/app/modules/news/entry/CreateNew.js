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
  
  export const CreateNews = () => {
    useDocumentTitle("New News");
  
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState();
    const [countryId, setCountryId] = useState();
    const [mainPayload, setMainPayload] = useState({
      title : '',
      description : '',
      title_photo: ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  
    const selectImage = useSelector((state) => state.imageSelect);
  
    const submitCreateNew = async () => {
      setLoading(true);
      setErrors(null);
    //   return;
  
      const response = await postRequest("news/create", mainPayload);
  
      if (response && response.errors) {
        setErrors(response.errors);
        setLoading(false);
        return;
      }
  
      if (response && (response.status === 500 || response.status === 403)) {
        dispatch(
          updateNotification({
            title: "Error: City create",
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
            title: "News create",
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
          description : description,
          title_photo : selectImage?.url
        })
    }, [selectImage, title, description])
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="New List"
                click={() => navigate("/news")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create News </Text>
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
                placeholder="Enter full description"
                label="Description"
                disabled={loading}
                error={
                  errors &&
                  errors["description"] && (
                    <FormValidationMessage message={errors["description"][0]} />
                  )
                }
                onChange={(e) => setDescription(e.target.value)
                }
              />
  
  
              <SaveButton
                loading={loading}
                submit={() => submitCreateNew()}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    );
  };
  