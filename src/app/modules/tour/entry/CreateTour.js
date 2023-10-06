import {
    Card,
    Center,
    Divider,
    Flex,
    Grid,
    Group,
    Select,
    Slider,
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
import { DatePicker } from "@mantine/dates";
import { datetime } from "../../../helpers/dateFormat";
  
  export const CreateTour = () => {
    useDocumentTitle("New Tour");
  
    const [name, setName] = useState('');
    const [packageName, setPackageName] = useState('');
    const [city, setCity] = useState();
    const [overview, setOverview] = useState("");
    const [price ,setPrice] = useState('');
    const [salePrice , setSalePrice] = useState("");
    const [location, setLocation] = useState('');
    const [depature, setDepature] = useState("");
    const [theme, setTheme] = useState("");
    const [duration, setDuration] = useState("");
    const [rating, setRating] = useState("");
    const [type, setType] = useState("");
    const [style, setStyle] = useState("");
    const [forWhom, setForWhom] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cityId, setCityId] = useState();
    const [mainPayload, setMainPayload] = useState({
      name : '',
      package_name : '',
      city_id : '',
      overview: '',
      price : '',
      sale_price : '',
      location : '',
      depature : '',
      theme : '',
      duration : '',
      rating : '',
      type : '',
      for_whom : '',
      tour_photo: '',
      start_date : '',
      end_date: ''
    })
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  
    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("city/list");
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
            setCity(itemData);
            setLoading(false);
            return;
        }

    },[dispatch]);
  
    const submitCreateCountry = async () => {
      setLoading(true);
      setErrors(null);
    //   return;

      const response = await postRequest("tour/create", mainPayload);
  
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
            title: "Tour create",
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
        overview: overview,
        price : price,
        sale_price : salePrice,
        location : location,
        depature : depature,
        theme : theme,
        duration : duration,
        rating : rating,
        style: style,
        type : type,
        for_whom : forWhom,
        start_date : datetime(startDate),
        end_date : datetime(endDate),
        package_name : packageName,
        name : name,
        city_id : cityId,
        tour_photo : selectImage?.url
        })
    }, [selectImage, packageName,name,cityId,overview,price,salePrice,location,depature,theme,duration,rating,type,forWhom,startDate,endDate])
  
    useEffect(() => {
        loadingData();
    }, [loadingData]);
  
    return (
      <Grid>
        <Grid.Col md={12}>
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Group>
              <NavButton
                label="Tour List"
                click={() => navigate("/tour")}
              />
            </Group>
          </Flex>
        </Grid.Col>
  
        <Grid.Col sm={12} md={6}>
          <Card p={20} className="card-border">
            <Card.Section my={20}>
              <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create Tour </Text>
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
  
              {/* <input 
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={(e) => console.log(e.target.files)}
              /> */}
            {
                city && (
                    <Select
                    label="Choose city"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={city ? city : null}
                    defaultValue={city.city_id || ''}
                    nothingFound="No Status Found"
                    clearable
                    disabled={loading}
                    // value={cityId}
                    maxDropdownHeight={100}
                    error={errors && errors['status'] && (<FormValidationMessage message={errors['status'][0]} />)}                      
                    onChange={(e) => setCityId(e)}
                />
                )
            }
  
              <TextInput
                my={10}
                placeholder="Enter Tour name"
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
                placeholder="Enter Tour package name"
                label="Package Name"
                disabled={loading}
                error={
                  errors &&
                  errors["package_name"] && (
                    <FormValidationMessage message={errors["package_name"][0]} />
                  )
                }
                onChange={(e) => setPackageName(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter Overview"
                label="Overview"
                disabled={loading}
                error={
                  errors &&
                  errors["name"] && (
                    <FormValidationMessage message={errors["name"][0]} />
                  )
                }
                onChange={(e) => setOverview(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter price"
                label="Price"
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
                placeholder="Enter location"
                label="Location"
                disabled={loading}
                error={
                  errors &&
                  errors["location"] && (
                    <FormValidationMessage message={errors["location"][0]} />
                  )
                }
                onChange={(e) => setLocation(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter depature"
                label="Depature"
                disabled={loading}
                error={
                  errors &&
                  errors["depature"] && (
                    <FormValidationMessage message={errors["depature"][0]} />
                  )
                }
                onChange={(e) => setDepature(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter theme"
                label="Theme"
                disabled={loading}
                error={
                  errors &&
                  errors["theme"] && (
                    <FormValidationMessage message={errors["theme"][0]} />
                  )
                }
                onChange={(e) => setTheme(e.target.value)
                }
              />
  
                <TextInput
                my={10}
                placeholder="Enter duration"
                label="Duration"
                disabled={loading}
                error={
                  errors &&
                  errors["duration"] && (
                    <FormValidationMessage message={errors["duration"][0]} />
                  )
                }
                onChange={(e) => setDuration(e.target.value)
                }
              />

                <Slider
                my={25}
                    marks={[
                        { value: 1, label: 'Terrible' },
                        { value: 2, label: 'Poor' },
                        { value: 3, label: 'Average' },
                        { value: 4, label: 'Very Good' },
                        { value: 5, label: 'Excellent' },
                    ]}
                    min={1}
                    max={5}
                    value={rating}
                    onChange={setRating}
                    />

                <TextInput
                my={10}
                placeholder="Enter type"
                label="Type"
                disabled={loading}
                error={
                  errors &&
                  errors["type"] && (
                    <FormValidationMessage message={errors["type"][0]} />
                  )
                }
                onChange={(e) => setType(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter style"
                label="Style"
                disabled={loading}
                error={
                  errors &&
                  errors["style"] && (
                    <FormValidationMessage message={errors["style"][0]} />
                  )
                }
                onChange={(e) => setStyle(e.target.value)
                }
              />

                <TextInput
                my={10}
                placeholder="Enter for whom"
                label="For whom"
                disabled={loading}
                error={
                  errors &&
                  errors["for_whom"] && (
                    <FormValidationMessage message={errors["for_whom"][0]} />
                  )
                }
                onChange={(e) => setForWhom(e.target.value)
                }
              />

              <label>Start Date</label>
              <DatePicker value={startDate} onChange={setStartDate} />

              <label>End Date</label>
              <DatePicker value={endDate} onChange={setEndDate} />
  
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
  