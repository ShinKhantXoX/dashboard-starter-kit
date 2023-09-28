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

export const UpdateItinerary = ({ dataSource, update }) => {
    useDocumentTitle("Itinerary Detail And Update");

    const [name, setName] = useState(dataSource?.name ? dataSource.name : '');
    const [description, setDescription] = useState(dataSource?.description ? dataSource.description : '');
    const [meal ,setMeal] = useState(dataSource?.meal ? dataSource.meal : '');
    const [accommodation ,setAccommodation] = useState(dataSource?.accommodation ? dataSource.accommodation : '');
    const [note , setNote] = useState(dataSource?.note ? dataSource.note : '');
    const [tour, setTour] = useState();
    const [tourId, setTourId] = useState(dataSource?.tour_id ? dataSource?.tour_id : '');
    const [itineraryPhoto, setItineraryPhoto] = useState(dataSource?.itinerary_photo ? dataSource?.itinerary_photo : '')
    const [mainPayload, setMainPayload] = useState({
        name : name ? name : '',
        tour_id : tourId ? tourId : '',
        description : description ? description : '',
        meal: meal ? meal : '',
        accommodation: accommodation ? accommodation : '',
        note : note ? note : '',
        itinerary_photo: itineraryPhoto ? itineraryPhoto : ''
      })
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("tour/list");

        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived tour status",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            // setDescription(response.data.toString());
            let itemData = response?.data?.map((tour) => {
                return {
                    value : tour?.id,
                    label: tour?.name
                }
            });
            setTour(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);

    const submitUpdateCountry = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`itinerary/update/${dataSource?.id}`, mainPayload);

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
            navigate("/itinerary")
            return;
        }
    }
    
    useEffect(() => {
        setMainPayload({
            name : name ? name : '',
            tour_id : tourId ? tourId : '',
            description : description ? description : '',
            meal: meal ? meal : '',
            accommodation: accommodation ? accommodation : '',
            note : note ? note : '',
            itinerary_photo: selectImage?.url
        })
    }, [selectImage, name, tourId,description,meal,accommodation,note])
  
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
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Itinerary </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={itineraryPhoto}
                        title={"File upload"}
                        />
                </Center>

                {
                tour && (
                    <Select
                    label="Choose tour"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={tour}
                    // defaultValue={dataSource?.country_id}
                    nothingFound="No tour Found"
                    clearable
                    name="tour_id"
                    required={true}
                    disabled={loading}
                    maxDropdownHeight={100}
                    error={errors && errors['tour_id'] && (<FormValidationMessage message={errors['tour_id'][0]} />)}                      
                    onChange={(e) => setTourId(e)}
                />
                )
            }

                <TextInput 
                    my={10}
                    placeholder="Enter full name"
                    label="Name"
                    disabled={loading}
                    name="name"
                    defaultValue={name}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <TextInput
                my={10}
                placeholder="Enter full description"
                label="Description"
                disabled={loading}
                defaultValue={description}
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
                defaultValue={meal}
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
                defaultValue={accommodation}
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
                defaultValue={note}
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
                    submit={() => submitUpdateCountry()}
                />
            </Card.Section>
        </Card>
    )
}