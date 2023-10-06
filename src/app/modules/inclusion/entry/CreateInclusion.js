import {
    Card,
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
  import { useDispatch } from "react-redux";
  import { updateNotification } from "../../../redux/notificationSlice";
  import { SaveButton } from "../../../components/SaveButton";
  import { useNavigate } from "react-router-dom";
  import { NavButton } from "../../../components/NavButton";
import { DatePicker } from "@mantine/dates";
  
  export const CreateInclusion = () => {
    useDocumentTitle("New Inclusion");

    const [accommodation, setAccommodation] = useState('');
    const [meals, setMeals] = useState('');
    const [included, setIncluded] = useState('');
    const [transport, setTransport] = useState('');
    const [tour ,setTour] = useState();
    const [tourId, setTourId] = useState();

    const [mainPayload, setMainPayload] = useState({
      tour_id : '',
      accommodation : '',
      included_activities : '',
      meals : '',
      transport : ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();


      const loadingData = useCallback(async () => {
        const response = await getReqeust("tour/list");

        
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
            let itemData = response?.data?.data?.map((inclusion) => {
                return {
                    value : inclusion?.id,
                    label: inclusion?.name
                }
            });
            setTour(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);
  
  
    const submitCreateInclusion = async () => {
      setLoading(true);
      setErrors(null);
  
      const response = await postRequest("inclusion/create", mainPayload);
      console.log(response);
  
      if (response && response.errors) {
        setErrors(response.errors);
        setLoading(false);
        return;
      }
  
      if (response && (response.status === 500 || response.status === 403)) {
        dispatch(
          updateNotification({
            title: "Error: Inclusion create",
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
            title: "Inclusion create",
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
            tour_id : tourId,
            accommodation : accommodation,
            meals : meals,
            included_activities : included,
            transport : transport
            
        })
    }, [ tourId,accommodation,meals,included,transport])

    useEffect(() => {
        loadingData();
    }, [loadingData]);
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="Inclusion List"
                click={() => navigate("/inclusion")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create Inclusion </Text>
              <Divider variant="dashed" my={10} />
            </Card.Section>
  
            <Card.Section px={10}>

            {
                tour && (
                    <Select
                    label="Choose tour"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={tour ? tour : null}
                    nothingFound="No Tour Found"
                    clearable
                    disabled={loading}
                    // value={tourId}
                    maxDropdownHeight={100}
                    error={errors && errors['tour_id'] && (<FormValidationMessage message={errors['tour_id'][0]} />)}                      
                    onChange={(e) => setTourId(e)}
                />
                )
            }


                <TextInput
                my={10}
                placeholder="Enter accommodation"
                label="Accommodation"
                type="text"
                disabled={loading}
                error={
                  errors &&
                  errors["accommodation"] && (
                    <FormValidationMessage message={errors["accommodation"][0]} />
                  )
                }
                onChange={(e) => setAccommodation(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter meals"
                label="Meals"
                type="text"
                disabled={loading}
                error={
                  errors &&
                  errors["meals"] && (
                    <FormValidationMessage message={errors["meals"][0]} />
                  )
                }
                onChange={(e) => setMeals(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter included activities"
                label="Included activities"
                type="text"
                disabled={loading}
                error={
                  errors &&
                  errors["included_activities"] && (
                    <FormValidationMessage message={errors["included_activities"][0]} />
                  )
                }
                onChange={(e) => setIncluded(e.target.value)
                }
              />

              <TextInput
                my={10}
                placeholder="Enter transport"
                label="Transport"
                type="text"
                disabled={loading}
                error={
                  errors &&
                  errors["transport"] && (
                    <FormValidationMessage message={errors["transport"][0]} />
                  )
                }
                onChange={(e) => setTransport(e.target.value)
                }
              />
  
              <SaveButton
                loading={loading}
                submit={() => submitCreateInclusion()}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    );
  };
  