import React from 'react'
import { Button, badges, Card, Divider, Flex, Grid, Group, Image, NavLink, Text, Modal, Center } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useNavigate } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { useCallback, useEffect, useState } from "react";
import { getReqeust, patchRequest, postRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
// import { NavButton } from "../../../components/NavButton";
import { minHeight, paginationSize, recordsPerPageOptions } from "../../../config/datatable";
import { recycleQueryParamsInit } from '../useRecycleQueryParams';
import { useDisclosure, useCounter } from '@mantine/hooks';


export const RecycleQuery = () => {
  useDocumentTitle("Book-Now Recycle List");

  const [loading, setLoading] = useState(false);
  const [records, setRecord] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState(recycleQueryParamsInit);
  const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [opened, { close, open }] = useDisclosure(false); //for alert
  // Restoring
  const RestoreBtnClick = async (id) => {
    setLoading(true);
    setErrors(null);
    //   return;

    const response = await patchRequest(`book-form/restore/${id}`);
    // console.log("response >> ", response)
    if (response && response.errors) {
      setErrors(response.errors);
      setLoading(false);
      return;
    }

    if (response && (response.status === 500 || response.status === 403)) {
      dispatch(
        updateNotification({
          title: "Error: Booking Restoring!",
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
          title: "Booking Restored",
          message: response.message,
          status: "success",
        })
      );
      loadingData()
      setLoading(false);
      return;
    }
    
  };
  // Restoring

  
  // Permanent Deleting
  const ForceDeleteBtnClick = async (id) => {
    setLoading(true);
    setErrors(null);
    //   return;

    const response = await postRequest (`book-form/force-delete/${id}`);
    console.log("response >> ", response)
    if (response && response.errors) {
      setErrors(response.errors);
      setLoading(false);
      return;
    }

    if (response && (response.status === 500 || response.status === 403)) {
      dispatch(
        updateNotification({
          title: "Error: Booking Deleting Permanently!",
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
          title: "Booking Deleted Permanently!",
          message: response.message,
          status: "success",
        })
      );
      loadingData()
      setLoading(false);
      return;
    }
  };
  // Permanent Deleting
  

  const columns = [
   
    {
      accessor: "email", title: 'Email', sortable: true, render: ({ email }) => {
        return (
          <div>{email?.substring(0, 5)} ...</div>
        )
      }
    },

    // { accessor: "accommodation", title: 'Accommodation', sortable: true },
    {
      accessor: "address", title: 'Address', sortable: true, render: ({ address }) => {
        return (
          <div>{address?.substring(0, 5)} ...</div>
        )
      }
    },
    // { accessor: "adult", title: 'Adult', sortable: true },
    // { accessor: "arrival_date", title: 'Arrival_date', sortable: true },
    // { accessor: "child", title: 'Child', sortable: true },
    // { accessor: "departure_date", title: 'Departure_date', sortable: true },
    
    { accessor: "flight", title: 'Flight', sortable: true },
    {
      accessor: "full_name", title: 'Full Name', sortable: true, render: ({ full_name }) => {
        return (
          <div>{full_name?.substring(0, 5)} ...</div>
        )
      }
    },
    // {
    //   accessor: "guide_type", title: 'Guide Type', sortable: true, render: ({ guide_type }) => {
    //     return (
    //       <div>{guide_type?.substring(0, 5)} ...</div>
    //     )
    //   }
    // },
    // { accessor: "hotel_budget", title: 'hotel_budget', sortable: true },
    // { accessor: "hotel_star", title: 'Hotel_star', sortable: true },
    // { accessor: "infants", title: 'Infants', sortable: true },
    // {
    //   accessor: "language", title: 'Language', sortable: true, render: ({ language }) => {
    //     return (
    //       <div>{language?.substring(0, 5)} ...</div>
    //     )
    //   }
    // },
    // { accessor: "language_requirement", title: 'Language_requirement', sortable: true },
    // {
    //   accessor: "nationality", title: 'Nationality', sortable: true, render: ({ nationality }) => {
    //     return (
    //       <div>{nationality?.substring(0, 5)} ...</div>
    //     )
    //   }
    // },
    // { accessor: "passport_number", title: 'Passport_number', sortable: true },
    { accessor: "phone", title: 'Phone', sortable: true },
    // {
    //   accessor: "special_req", title: 'Special Request', sortable: true, render: ({ special_req }) => {
    //     return (
    //       <div>{special_req?.substring(0, 5)} ...</div>
    //     )
    //   }
    // },
    // {
    //   accessor: "title", title: 'Title', sortable: true, render: ({ title }) => {
    //     return (
    //       <div>{title?.substring(0, 5)} ...</div>
    //     )
    //   }
    // },
    // { accessor: "tour_budget", title: 'Tour Budget', sortable: true },
    // { accessor: "tour_guide", title: 'Tour Guide', sortable: true },

    // control
    {
      accessor: "id", title: 'Options', sortable: false, render: ({ id }) => {
        

        return (
          <>
            <Button
              variant="filled"
              color="blue"
              onClick={()=>RestoreBtnClick(id)}
            >
              Restore
            </Button>

          {/* alert */}
            <Modal opened={opened} onClose={close} size="auto" title="Confirm Delete">
              <Text order={2} mb={20} fz={'sm'}>Selected booking will be deleted permanently. Are you sure to delete? </Text>
              <Center>
                <Button color='red' variant='filled' onClick={() => ForceDeleteBtnClick(id)}>Confirm</Button>
              </Center>
              
            </Modal>

            <Button onClick={open} variant="filled" color="red" ml={5}>Delete</Button>
          </>
          // alert
        )
      }
    },
  ];

  const sortStatusHandler = (e) => {
    let updateSortStatus = { ...sortStatus };
    updateSortStatus.columnAccessor = e.columnAccessor;
    updateSortStatus.direction = e.direction;
    setSortStatus(updateSortStatus);

    let updateParams = { ...params };
    updateParams.order = sortStatus.columnAccessor;
    updateParams.sort = sortStatus.direction;
    setParams(updateParams);
  }

  const paginateHandler = (e, field) => {
    let updateParams = { ...params };
    updateParams[field] = e;
    setParams(updateParams);
  }

  const loadingData = useCallback(async () => {
    setLoading(true);
    const response = await getReqeust("book-form/trash", params);
    console.log(response);

    if (response && (response.status === 401 || response.status === 500 || response.status === 403)) {
      dispatch(updateNotification({
        title: "Error",
        message: response.message,
        status: 'fail'
      }));
      setLoading(false);
      return;
    }

    if (response && response.status === 200) {
      setRecord(response?.data?.data);
      setTotal(response?.data.total);
      setLoading(false);
      return;
    }
  }, [dispatch, params]);

  useEffect(() => {
    if (params) {
      loadingData();
    }
  }, [params, loadingData]);
  
  return (
    
    <Grid gutter={0}>
      <Grid.Col span={12} my={10}>
        <Flex
          direction={"row"}
          align={"center"}
          justify={"space-between"}
        >
          {/* <ItinerarySearch 
                        loading={loading}
                        submitUserSearch={(e) => paginateHandler(e, 'search')}
                    /> */}

          {/* <Group>
            <NavButton color={'red.8'} label="Create" disabled={loading} click={() => navigate("/itinerary/new")} />
          </Group> */}
        </Flex>
      </Grid.Col>

      <Grid.Col my={10}>
        <Card p={20} className="card-border">
          <Card.Section my={10}>
            <Text sx={{ fontSize: 20, fontWeight: 500 }}> Book Now Recycle Bin </Text>
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