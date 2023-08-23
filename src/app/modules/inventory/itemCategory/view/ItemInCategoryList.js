import { Card, Divider, Text } from "@mantine/core"
import { DataTable } from "mantine-datatable"
import { minHeight, paginationSize, recordsPerPageOptions } from "../../../../config/datatable"
import { itemParamsInit } from "../../item/useItemParams";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export const ItemInCategoryList = ({dataSource, update }) => {

    const [params, setParams] = useState(itemParamsInit);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
    const [total, setTotal] = useState(0);
    const [items, setItem] = useState([]);

    const columns = [
        {
            accessor: "name", title: "Name", width: "200px", render: (row) => {
                return (
                    <NavLink 
                        sx={{ color: "blue", textDecoration: 'underline'}}
                        to={`/inventory/item/${row.id}`}
                    >
                        { row.name }
                    </NavLink>
                )
            }
        },
        { accessor: 'model', title: "Model" },
        { accessor: 'code', title: "Code" },
        { accessor: 'label', title: "Label" },
        { accessor: 'packing', title: "Packing" },
        { accessor: 'prebox', title: "Prebox" },
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

    const loadingDataSoruce = useCallback(() => {
        if(dataSource) {
            setItem(dataSource.items);
            setTotal(dataSource.items.length);
        }
    }, [dataSource]);

    useEffect(() => {
        loadingDataSoruce();
    },[loadingDataSoruce])
    return(
        <Card p={20} className="card-border">
            <Card.Section my={10}>
                <Text sx={{ fontSize: 20, fontWeight: 500}}> Item List </Text>
                <Divider my={10} variant="dashed" />
            </Card.Section>

            {items && (
                <Card.Section my={20}>
                    <DataTable 
                        minHeight={minHeight}
                        striped
                        highlightOnHover
                        records={items}
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
            )}
        </Card>
    )
}