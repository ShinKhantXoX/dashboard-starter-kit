import { Button, Card, Divider, Flex, Grid, Group, Image, Text } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useNavigate } from "react-router-dom";
import {DataTable} from "mantine-datatable";
import { useCallback, useEffect, useState } from "react";
import { getReqeust } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { NavButton } from "../../../components/NavButton";
import { queryFormParamsInit } from "../useQueryFormParams";
import { minHeight, paginationSize, recordsPerPageOptions } from "../../../config/datatable";
import { QueryFormSearch } from "../entry/QueryFormSearch";

export const QueryFormList = () => {
    useDocumentTitle("Query Form List");

    const [loading, setLoading] = useState(false);
    const [records, setRecord] = useState([]);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState(queryFormParamsInit);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
 
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const columns = [
        { accessor: "travel_month", title: 'Travel Month', sortable: true, render : ({travel_month}) => {
            return (
                <div>
                    {travel_month?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "travel_year", title: 'Travel Year', sortable: true, render : ({travel_year}) => {
            return (
                <div>
                    {travel_year?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "stay_days", title: 'Stay Days', sortable: true},
        { accessor: "budget", title: 'Budget', sortable: true},
        { accessor: "adult_count", title: 'Adult Count', sortable: true},
        { accessor: "child_count", title: 'Child Count', sortable: true},
        { accessor: "interest", title: 'Interest', sortable: true, render : ({interest}) => {
            return (
                <div>
                    {interest?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "destinations", title: 'Destinations', sortable: true, render : ({destinations}) => {
            return (
                <div>
                    {destinations?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "f_name", title: 'First Name', sortable: true, render : ({f_name}) => {
            return (
                <div>
                    {f_name?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "l_name", title: 'Last Name', sortable: true, render : ({l_name}) => {
            return (
                <div>
                    {l_name?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "email", title: 'Email', sortable: true, render : ({email}) => {
            return (
                <div>
                    {email?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "phone", title: 'Phone', sortable: true, render : ({phone}) => {
            return (
                <div>
                    {phone?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "own_country", title: 'Own Country', sortable: true, render : ({own_country}) => {
            return (
                <div>
                    {own_country?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "accommodation", title: 'Accommodation', sortable: true, render : ({accommodation}) => {
            return (
                <div>
                    {accommodation?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "how_u_know", title: 'How U Know', sortable: true, render : ({how_u_know}) => {
            return (
                <div>
                    {how_u_know?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "other_information", title: 'Other Information', sortable: true, render : ({other_information}) => {
            return (
                <div>
                    {other_information?.substring(0,5)} ...
                </div>
            )
        } },
        { accessor: "special_note", title: 'Special Note', sortable: true, render : ({special_note}) => {
            return (
                <div>
                    {special_note?.substring(0,5)} ...
                </div>
            )
        } },
        // { accessor: "tour_photo", title: 'Package Photo', sortable: true, render: ({tour_photo}) => {
        //     return (
        //         <>
        //             {
        //                 tour_photo ? (
        //                     <Image
        //                     src={tour_photo ? tour_photo : null} 
        //                     width={50}
        //                     height={50}
        //                     mx={'auto'}
        //                     withPlaceholder
        //                     />
        //                 ) : (
        //                     <Image w={20} h={20} radius="md" src={null} alt="Random image" withPlaceholder />
        //                 )
        //             }
        //         </>
        //     )
        // } },
        { accessor: "id", title: 'Control', sortable: true, render: ({id}) => {
            return (
                <Button 
                variant="outline"
                color="blue"
                onClick={() => navigate(`${id}`)}
                >
                Edit
                </Button>
            )
        } },
    ];

    const sortStatusHandler = (e) => {
        let updateSortStatus = {...sortStatus};
        updateSortStatus.columnAccessor = e.columnAccessor;
        updateSortStatus.direction = e.direction;
        setSortStatus(updateSortStatus);

        let updateParams = {...params};
        updateParams.order = sortStatus.columnAccessor;
        updateParams.sort = sortStatus.direction;
        setParams(updateParams);
    }

    const paginateHandler = (e, field) => {
        let updateParams = {...params};
        updateParams[field] = e;
        setParams(updateParams);
    }

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust("form/list", params);
        console.log(response);

        if(response && (response.status === 401 || response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setRecord(response?.data?.data);
            setTotal(response.data.total);
            setLoading(false);
            return;
        }
    }, [dispatch, params]);

    useEffect(() => {
        if(params) {
            loadingData();
        }
    }, [params, loadingData]);

    return(
        <Grid gutter={0}>
            <Grid.Col span={12} my={10}>
                <Flex
                    gap={10}
                    direction={{ sm: 'column', md: 'row', lg: 'row' }}
                    align={"center"}
                    justify={"space-between"}
                >
                    <QueryFormSearch 
                        loading={loading}
                        submitCountrySearch={(e) => paginateHandler(e, 'search')}
                    />

                    <Group> 
                        {/* <NavButton label="Create" disabled={loading} click={() => navigate("/tour/new")} /> */}
                        {/* <NavButton label="Export" disabled={loading} click={() => console.log("")} /> */}
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col my={10}>
                <Card p={20} className="card-border">
                    <Card.Section my={10}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Tour List </Text>
                        <Divider my={10} variant="dashed" />
                    </Card.Section>

                    <Card.Section my={20}>
                        <DataTable 
                            minHeight={minHeight}
                            striped
                            highlightOnHover
                            records={records}
                            columns={columns}
                            sortStatus={sortStatus}
                            totalRecords={total}
                            recordsPerPage={params.per_page}
                            page={params.page}
                            paginationSize={paginationSize}
                            recordsPerPageOptions={recordsPerPageOptions}
                            onSortStatusChange={(e) => sortStatusHandler(e)}
                            onRecordsPerPageChange={(e) => paginateHandler(e, 'per_page')}
                            onPageChange={(e) => paginateHandler(e, 'page')}
                        />
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}