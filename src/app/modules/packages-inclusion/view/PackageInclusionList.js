import { Badge, Button, Card, Divider, Flex, Grid, Group, Image, NavLink, Text } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useNavigate } from "react-router-dom";
import {DataTable} from "mantine-datatable";
import { useCallback, useEffect, useState } from "react";
import { getReqeust } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { NavButton } from "../../../components/NavButton";
import { packageInclusionParamsInit } from "../usePackageInclusionParams";
import { minHeight, paginationSize, recordsPerPageOptions } from "../../../config/datatable";
import { PackageInclusionSearch } from "../entry/PackageInclusionSearch";

export const PackageInclusionList = () => {
    useDocumentTitle("Package Inclusion List");

    const [loading, setLoading] = useState(false);
    const [records, setRecord] = useState([]);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState(packageInclusionParamsInit);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
 
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const columns = [
        { accessor: "package_tour_name", title: 'Package Tour Name', sortable: true, render : ({package_tour_name}) => {
            return (
                <div>{package_tour_name?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "meal", title: 'Meal', sortable: true, render : ({meal}) => {
            return (
                <div>{meal?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "category", title: 'Category', sortable: true, render : ({category}) => {
            return (
                <div>{category?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "price", title: 'Price', sortable: true, render : ({price}) => {
            return (
                <div>{price?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "sale_price", title: 'Sale Price', sortable: true, render : ({sale_price}) => {
            return (
                <div>{sale_price?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "private_price", title: 'Private Price', sortable: true, render : ({private_price}) => {
            return (
                <div>{private_price?.substring(0,5)} ...</div>
            )
        } },
        { accessor: "sale_private_price", title: 'Sale Private Price', sortable: true, render : ({sale_private_price}) => {
            return (
                <div>{sale_private_price?.substring(0,5)} ...</div>
            )
        } },
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
        const response = await getReqeust("package-inclusion/list", params);
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
                    <PackageInclusionSearch 
                        loading={loading}
                        submitCountrySearch={(e) => paginateHandler(e, 'search')}
                    />

                    <Group> 
                        <NavButton label="Create" disabled={loading} click={() => navigate("/package-inclusion/new")} />
                        {/* <NavButton label="Export" disabled={loading} click={() => console.log("")} /> */}
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col my={10}>
                <Card p={20} className="card-border">
                    <Card.Section my={10}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}>Package Inclusion List </Text>
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