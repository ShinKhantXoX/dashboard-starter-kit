import { Card, Divider, Flex, Select, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { datetime } from "../../../helpers/dateFormat";

export const UpdateInclusion = ({ dataSource, update }) => {
    useDocumentTitle("Inclusion Detail And Update");

    const [accommodation, setAccommodation] = useState(dataSource?.accommodation ? dataSource?.accommodation : '');
    const [meals, setMeals] = useState(dataSource?.meals ? dataSource?.meals : '');
    const [included, setIncluded] = useState(dataSource?.included_activities ? dataSource?.included_activities : '');
    const [transport, setTransport] = useState(dataSource?.transport ? dataSource?.transport : '');
    const [tour ,setTour] = useState();
    const [tourId, setTourId] = useState(dataSource?.tour_id ? dataSource?.tour_id : '');
    const [mainPayload, setMainPayload] = useState({
        tour_id : '',
        start_date : '',
        end_date : '',
        price : '',
        sale_price : '',
        private_price : '',
        sale_private_price : '',
        category : '',
      })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        const response = await getReqeust("tour/list");

        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived tour list",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            // setDescription(response.data.toString());
            let itemData = response?.data?.data?.map((tour) => {
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

    const submitUpdateInclusion = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`inclusion/update/${dataSource?.id}`, mainPayload);

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
                title: "Update inclusion",
                message: response.message,
                status: 'success'
            }));
            update(response.data);
            setLoading(false);
            navigate("/city")
            return;
        }
    }
    
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


    return(
        <Card p={20} className="card-border">
            <Card.Section my={20}>
                <Flex
                    direction={"row"}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Inclusion </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>

                {
                tour && (
                    <Select
                    label="Choose Tour"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={tour}
                    // defaultValue={dataSource?.country_id}
                    nothingFound="No Tour Found"
                    clearable
                    name="tour"
                    required={true}
                    disabled={loading}
                    maxDropdownHeight={100}
                    error={errors && errors['tour'] && (<FormValidationMessage message={errors['tour'][0]} />)}                      
                    onChange={(e) => setTourId(e)}
                />
                )
            }

            <TextInput
                my={10}
                placeholder="Enter accommodation"
                label="Accommodation"
                type="text"
                defaultValue={dataSource?.accommodation}
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
                defaultValue={dataSource?.meals}
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
                defaultValue={dataSource?.included_activities}
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
                defaultValue={dataSource?.transport}
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
                    submit={() => submitUpdateInclusion()}
                />
            </Card.Section>
        </Card>
    )
}