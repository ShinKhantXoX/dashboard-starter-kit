import { Badge, Card, Divider, Flex, Grid, Group, Text } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useNavigate, NavLink } from "react-router-dom";
import {DataTable} from "mantine-datatable";
import { useCallback, useEffect, useState } from "react";
import { getReqeust } from "../../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../../redux/notificationSlice";
import { CustomerSearch } from "../entry/CustomerSearch";
import { NavButton } from "../../../../components/NavButton";
import { minHeight, paginationSize, recordsPerPageOptions } from "../../../../config/datatable";
import { useCustomerParamsInit } from "../useCustomerParams";

export const CustomerList = () => {
    useDocumentTitle("Customer List");

    const [loading, setLoading] = useState(false);
    const [records, setRecord] = useState([]);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState(useCustomerParamsInit);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const columns = [
        { accessor: "full_name", title: 'Full Name', sortable: true, render: (row) => {
            return (
                <NavLink 
                    sx={{ color: "blue", textDecoration: 'underline'}}
                    to={`${row.id}`}
                >
                    {row.full_name}
                </NavLink>
            )
        }},
        { accessor: "email", title: 'Email', sortable: true },
        { accessor: 'phone', title: "Phone", sortable: true },
        { accessor: 'company_name', title: "Company Name", sortable: true },
        { accessor: 'position', title: "Position", sortable: true },
        { accessor: 'status', title: 'Status', sortable: true, render: ({status}) => {
            return (
                <Badge
                    color={status === 'ACTIVE' ? 'green' : 'red'}
                > 
                    {status === 'ACTIVE' ? 'ACTIVE' : status } 
                </Badge>
            )
        } }
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
        const response = await getReqeust("crm/customer", params);

        if(response && (response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setRecord(response.data.data);
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
                    direction={"row"}
                    align={"center"}
                    justify={"space-between"}
                >
                    <CustomerSearch 
                        loading={loading}
                        submitSearch={(e) => paginateHandler(e, 'search')}
                    />

                    <Group> 
                        <NavButton label="Create" disabled={loading} click={() => navigate("/crm/customer/new")} />
                        <NavButton label="Export" disabled={loading} click={() => console.log("")} />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col my={10}>
                <Card p={20} className="card-border">
                    <Card.Section my={10}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Customer List </Text>
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