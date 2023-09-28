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
  
  export const CreateCity = () => {
    useDocumentTitle("New City");
  
    const [payload, setPayload] = useState('');
    const [country, setCountry] = useState();
    const [countryId, setCountryId] = useState();
    const [mainPayload, setMainPayload] = useState({
      name : '',
      country_id : '',
      country_photo: ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  
    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("country/list");
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
  
    const submitCreateCountry = async () => {
      setLoading(true);
      setErrors(null);
    //   return;
  
      const response = await postRequest("city/create", mainPayload);
  
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
            title: "City create",
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
          name : payload,
          country_id : countryId,
          city_photo : selectImage?.url
        })
    }, [selectImage, payload])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="City List"
                click={() => navigate("/city")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create City </Text>
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
                country && (
                    <Select
                    label="Choose Country"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={country ? country : null}
                    defaultValue={payload.country_id || ''}
                    nothingFound="No Status Found"
                    clearable
                    disabled={loading}
                    // value={countryId}
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
                error={
                  errors &&
                  errors["name"] && (
                    <FormValidationMessage message={errors["name"][0]} />
                  )
                }
                onChange={(e) => setPayload(e.target.value)
                }
              />
  
                {/* <div className={'hidden'}> */}
                {/* </div> */}
  
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
  