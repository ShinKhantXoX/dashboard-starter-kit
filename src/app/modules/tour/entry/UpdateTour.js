import { Card, Center, Divider, Flex, Select, Slider, Text, TextInput } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useCallback, useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { FileButton } from "../../../components/FileButton";
import { DatePicker } from "@mantine/dates";
import { datetime } from "../../../helpers/dateFormat";

export const UpdateTour = ({ dataSource, update }) => {
    useDocumentTitle("Tour Detail And Update");

    const [name, setName] = useState(dataSource?.name ? dataSource.name : '');
    const [packageName, setPackageName] = useState(dataSource?.package_name ? dataSource?.package_name : '');
    const [city, setCity] = useState();
    const [cityId, setCityId] = useState(dataSource?.city_name ? dataSource?.city_name : '');
    const [overview, setOverview] = useState(dataSource?.overview ? dataSource?.overview : '');
    const [price ,setPrice] = useState(dataSource?.price ? dataSource?.price : '');
    const [salePrice , setSalePrice] = useState(dataSource?.sale_price ? dataSource?.sale_price : '');
    const [location, setLocation] = useState(dataSource?.location ? dataSource?.location : '');
    const [depature, setDepature] = useState(dataSource?.depature ? dataSource?.depature : '');
    const [theme, setTheme] = useState(dataSource?.theme ? dataSource?.theme : '');
    const [duration, setDuration] = useState(dataSource?.duration ? dataSource?.duration : '');
    const [rating, setRating] = useState(dataSource?.rating ? dataSource?.rating : '');
    const [type, setType] = useState(dataSource?.type ? dataSource?.type : '');
    const [style, setStyle] = useState(dataSource?.style ? dataSource?.style : '');
    const [forWhom, setForWhom] = useState(dataSource?.for_whom ? dataSource?.for_whom : '');
    const [date, setDate] = useState(dataSource?.start_date ? dataSource?.start_date : '');
    const [endDate, setEndDate] = useState(dataSource?.end_date ? dataSource?.end_date : '');
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
      end_date : ''
    })
    const [errors, setErrors] = useState(null);
    const [id ,setId] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectImage = useSelector((state) => state.imageSelect);

    const loadingData = useCallback(async () => {
        const response = await getReqeust("city");

        
        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Retrived city status",
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

    const submitUpdateTour = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`tour/update/${id?.id}`, mainPayload);

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
            navigate("/tour")
            return;
        }
    }

    useEffect(() => {
        if(dataSource) {
            setId(dataSource);
        }
    },[dataSource]);
    
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
        start_date : datetime(date),
        end_date : datetime(endDate),
        package_name : packageName,
        name : name,
        city_id : cityId,
        tour_photo : selectImage?.url ? selectImage?.url : dataSource?.tour_photo
        })
    }, [selectImage, packageName,name,cityId,overview,price,salePrice,location,depature,theme,duration,rating,type,forWhom,date,endDate])
  
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
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Tour </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Center>
                    <FileButton
                        id="file"
                        className="photo"
                        url={dataSource?.tour_photo}
                        title={"File upload"}
                        />
                </Center>

                {
                city && (
                    <Select
                    label="Choose city"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={city}
                    defaultValue={dataSource?.city_id}
                    nothingFound="No City Found"
                    clearable
                    name="city_id"
                    required={true}
                    disabled={loading}
                    value={id?.city_id ? id?.city_id : ''}
                    maxDropdownHeight={100}
                    error={errors && errors['city_id'] && (<FormValidationMessage message={errors['city_id'][0]} />)}                      
                    onChange={(e) => setCityId(e)}
                />
                )
            }

                <TextInput 
                    my={10}
                    placeholder="Enter full name"
                    label="Name"
                    disabled={loading}
                    name="name"
                    defaultValue={id?.name ? id.name : ''}
                    error={errors && errors['name'] && <FormValidationMessage message={errors['name'][0]}/>}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <TextInput
                my={10}
                placeholder="Enter Tour package name"
                label="Package Name"
                disabled={loading}
                defaultValue={packageName}
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
                defaultValue={id?.overview ? id?.overview : ''}
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
                defaultValue={id?.price ? id?.price : ''}
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
                defaultValue={id?.sale_price ? id?.sale_price : ''}
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
                defaultValue={id?.location ? id?.location : ''}
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
                defaultValue={id?.dapature ? id?.dapature : ''}
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
                defaultValue={id?.theme ? id?.theme : ''}
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
                defaultValue={id?.duration ? id?.duration : ''}
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
                    defaultValue={id?.rating ? id?.rating : ''}
                    value={rating}
                    onChange={setRating}
                    />

                <TextInput
                my={10}
                placeholder="Enter type"
                label="Type"
                defaultValue={id?.type ? id?.type : ''}
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
                defaultValue={id?.style ? id?.style : ''}
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
                defaultValue={id?.for_whom ? id?.for_whom : ''}
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
              <DatePicker 
              // defaultDate={id?.start_date ? new Date(id?.start_date) : ''}
              value={date}
              onChange={setDate} />

              <label>End Date</label>
              <DatePicker 
              // defaultDate={id?.start_date ? new Date(id?.start_date) : ''}
              value={endDate}
              onChange={setEndDate} />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateTour()}
                />
            </Card.Section>
        </Card>
    )
}