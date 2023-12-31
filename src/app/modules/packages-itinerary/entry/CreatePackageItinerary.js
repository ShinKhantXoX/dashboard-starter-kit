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
  
  export const CreatePackageItinerary = () => {
    useDocumentTitle("New Package Itinerary");
  
    const [name, setName] = useState('');
    const [packageTour, setPackageTour] = useState();
    const [packageTourId, setPackageTourId] = useState();
    const [description, setDescription] = useState('');
    const [meal ,setMeal] = useState('');
    const [accommodation ,setAccommodation] = useState('');
    const [note , setNote] = useState('');
    const [mainPayload, setMainPayload] = useState({
      name : '',
      package_tour_id : '',
      description : '',
      meal: '',
      accommodation: '',
      note : '',
      package_itinerary_photo: ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  
    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("package-tour/list");
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
            let itemData = response?.data?.map((package_tour) => {
                return {
                    value : package_tour?.id,
                    label: package_tour?.name
                }
            });
            setPackageTour(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);
  
    const submitCreateItinerary = async () => {
      setLoading(true);
      setErrors(null);
    //   return;
  
      const response = await postRequest("package-itinerary/create", mainPayload);
  
      if (response && response.errors) {
        setErrors(response.errors);
        setLoading(false);
        return;
      }
  
      if (response && (response.status === 500 || response.status === 403)) {
        dispatch(
          updateNotification({
            title: "Error: Itinerary create",
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
            title: "Itinerary create",
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
          name : name,
          description : description,
          meal : meal,
          accommodation : accommodation,
          package_tour_id : packageTourId,
          note : note,
          itinerary_photo : selectImage?.url
        })
    }, [selectImage, name, description, meal,accommodation,note, packageTourId])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="Itinerary List"
                click={() => navigate("/itinerary")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create Package Itinerary </Text>
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
                packageTour && (
                    <Select
                    label="Choose Package Tour"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={packageTour ? packageTour : null}
                    nothingFound="No Status Found"
                    clearable
                    disabled={loading}
                    // value={tourId}
                    maxDropdownHeight={100}
                    error={errors && errors['package_tour'] && (<FormValidationMessage message={errors['package_tour'][0]} />)}                      
                    onChange={(e) => setPackageTourId(e)}
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
                onChange={(e) => setName(e.target.value)
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

                <TextInput
                my={10}
                placeholder="Enter full meal"
                label="Meal"
                disabled={loading}
                error={
                  errors &&
                  errors["meal"] && (
                    <FormValidationMessage message={errors["meal"][0]} />
                  )
                }
                onChange={(e) => setMeal(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter full accommodation"
                label="Accommodation"
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
                placeholder="Enter full note"
                label="Note"
                disabled={loading}
                error={
                  errors &&
                  errors["note"] && (
                    <FormValidationMessage message={errors["note"][0]} />
                  )
                }
                onChange={(e) => setNote(e.target.value)
                }
              />
  
              <SaveButton
                loading={loading}
                submit={() => submitCreateItinerary()}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    );
  };
  