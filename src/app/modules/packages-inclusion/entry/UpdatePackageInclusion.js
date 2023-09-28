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

export const UpdatePackageInclusion = ({ dataSource, update }) => {
    useDocumentTitle("Package Inclusion Detail And Update");

    const [price, setPrice] = useState(dataSource?.price ? dataSource?.price : '');
    const [salePrice, setSalePrice] = useState(dataSource?.sale_price ? dataSource?.sale_price : '');
    const [privatePrice, setPrivatePrice] = useState(dataSource?.private_price ? dataSource?.private_price : '');
    const [salePrivatePrice, setSalePrivatePrice] = useState(dataSource?.sale_private_price ? dataSource?.sale_private_price : '');
    const [startDate, setStartDate] = useState(dataSource?.start_date ? dataSource?.start_date : '');
    const [category, setCategory] = useState(dataSource?.category ? dataSource?.category : '');
    const [endDate, setEndDate] = useState(dataSource?.end_date ? dataSource?.end_date : '');
    const [packageTour ,setPackageTour] = useState();
    const [packageTourId, setPackageTourId] = useState(dataSource?.package_tour_id ? dataSource?.package_tour_id : '');
    const [mainPayload, setMainPayload] = useState({
        package_tour_id : '',
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
        const response = await getReqeust("package-tour/list");

        
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

    const submitUpdateInclusion = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`package-inclusion/update/${dataSource?.id}`, mainPayload);

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
                title: "Update package inclusion",
                message: response.message,
                status: 'success'
            }));
            update(response.data);
            setLoading(false);
            navigate("/package-inclusion")
            return;
        }
    }
    
    useEffect(() => {
        setMainPayload({
            package_tour_id : packageTourId,
            start_date : datetime(startDate),
            end_date : datetime(endDate),
            price : price,
            sale_price : salePrice,
            private_price : privatePrice,
            sale_private_price : salePrivatePrice,
            category : category,
        })
    }, [ packageTourId,startDate,endDate,price,salePrice,privatePrice,salePrivatePrice,category])

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
                    <Text sx={{ fontSize: 20, fontWeight: 500}}> Update Package Inclusion </Text>
                </Flex>
                
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>

                {
                packageTour && (
                    <Select
                    label="Choose Package Tour"
                    // description={description}
                    dropdownPosition={"bottom"}
                    data={packageTour}
                    // defaultValue={dataSource?.country_id}
                    nothingFound="No Package Tour Found"
                    clearable
                    name="tour"
                    required={true}
                    disabled={loading}
                    maxDropdownHeight={100}
                    error={errors && errors['package_tour'] && (<FormValidationMessage message={errors['package_tour'][0]} />)}                      
                    onChange={(e) => setPackageTourId(e)}
                />
                )
            }

                <TextInput 
                    my={10}
                    placeholder="Enter price"
                    label="Name"
                    type="number"
                    disabled={loading}
                    name="price"
                    defaultValue={price ? price : ''}
                    error={errors && errors['price'] && <FormValidationMessage message={errors['price'][0]}/>}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <TextInput
                my={10}
                placeholder="Enter sale price"
                label="Sale Price"
                type="number"
                disabled={loading}
                defaultValue={salePrice ? salePrice : ''}
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
                defaultValue={privatePrice ? privatePrice : ''}
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
                defaultValue={salePrivatePrice ? salePrivatePrice : ''}
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
                defaultValue={category ? category : ''}
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
                <DatePicker defaultValue={startDate} my={20} value={startDate} onChange={setStartDate} />

                <label>End Date</label>
                <DatePicker defaultValue={endDate} my={20} value={endDate} onChange={setEndDate} />


                <SaveButton 
                    loading={loading}
                    submit={() => submitUpdateInclusion()}
                />
            </Card.Section>
        </Card>
    )
}