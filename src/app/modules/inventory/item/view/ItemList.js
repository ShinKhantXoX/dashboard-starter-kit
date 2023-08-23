import { Badge, Card, Divider, Flex, Grid, Group, Text } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks"
import { NavLink, useNavigate } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getReqeust } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { NavButton } from "../../../../components/NavButton";
import { itemParamsInit } from "../useItemParams";
import { paginationSize, recordsPerPageOptions, minHeight } from "../../../../config/datatable";
import { ItemSearch } from "../entry/ItemSearch";

export const ItemList = () => {
    useDocumentTitle("Item List");
    
    const [loading, setLoading] = useState(false);
    const [records, setRecord] = useState([]);
    const [total, setTotal] = useState(0);
    const [params, setParams] = useState(itemParamsInit);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const columns = [
        {
            accessor: "name", title: "Name", sortable: true, width: "200px", render: (row) => {
                return (
                    <NavLink 
                        sx={{ color: "blue", textDecoration: 'underline'}}
                        to={`${row.id}`}
                    >
                        { row.name }
                    </NavLink>
                )
            }
        },
        { accessor: "item_category_id", title: 'Category', sortable: true,  width: "200px", render: (row) => {
            return(
                <NavLink 
                    sx={{ color: "blue", textDecoration: 'underline'}}
                    to={`/inventory/category/${row.category.id}`}
                >
                    { row.category.name }
                </NavLink>
            )
        }},
        { accessor: 'model', title: "Model", sortable: true },
        { accessor: 'code', title: "Code", sortable: true },
        { accessor: 'label', title: "Label", sortable: true },
        { accessor: 'packing', title: "Packing", sortable: true },
        { accessor: 'prebox', title: "Prebox", sortable: true },
        { accessor: 'status', title: 'Status', sortable: true, render: ({status}) => {
            return (
                <Badge color={status === 'ACTIVE' ? 'green' : 'red'}> 
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
        const response = await getReqeust("item/general", params);

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
                    <ItemSearch 
                        loading={loading}
                        submitItemSearch={(e) => paginateHandler(e, 'search')}
                    />

                    <Group> 
                        <NavButton label="Create" disabled={loading} click={() => navigate("/inventory/item/new")} />
                        <NavButton label="Export" disabled={loading} click={() => console.log("")} />
                    </Group>
                </Flex>
            </Grid.Col>

            <Grid.Col my={10}>
                <Card p={20} className="card-border">
                    <Card.Section my={10}>
                        <Text sx={{ fontSize: 20, fontWeight: 500}}> Item List </Text>
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