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

    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [privatePrice, setPrivatePrice] = useState('');
    const [salePrivatePrice, setSalePrivatePrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [category, setCategory] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tour ,setTour] = useState();
    const [tourId, setTourId] = useState();

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
            start_date : startDate,
            end_date : endDate,
            price : price,
            sale_price : salePrice,
            private_price : privatePrice,
            sale_private_price : salePrivatePrice,
            category : category,
        })
    }, [ tourId,startDate,endDate,price,salePrice,privatePrice,salePrivatePrice,category])

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
                placeholder="Enter Price"
                label="Price"
                type="number"
                disabled={loading}
                error={
                  errors &&
                  errors["price"] && (
                    <FormValidationMessage message={errors["price"][0]} />
                  )
                }
                onChange={(e) => setPrice(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter sale price"
                label="Sale Price"
                type="number"
                disabled={loading}
                error={
                  errors &&
                  errors["sale_price"] && (
                    <FormValidationMessage message={errors["sale_price"][0]} />
                  )
                }
                onChange={(e) => setSalePrice(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter private price"
                label="Private Price"
                type="number"
                disabled={loading}
                error={
                  errors &&
                  errors["private_price"] && (
                    <FormValidationMessage message={errors["private_price"][0]} />
                  )
                }
                onChange={(e) => setPrivatePrice(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter sale private price"
                label="Sale private Price"
                type="number"
                disabled={loading}
                error={
                  errors &&
                  errors["sale_private_price"] && (
                    <FormValidationMessage message={errors["sale_private_price"][0]} />
                  )
                }
                onChange={(e) => setSalePrivatePrice(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter category"
                label="Category"
                disabled={loading}
                error={
                  errors &&
                  errors["category"] && (
                    <FormValidationMessage message={errors["category"][0]} />
                  )
                }
                onChange={(e) => setCategory(e.target.value)
                }
              />

                <label>Start Date</label>
                <DatePicker miw={300} my={20} value={startDate} onChange={setStartDate} />

                <label>End Date</label>
                <DatePicker my={20} value={endDate} onChange={setEndDate} />
  
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
  