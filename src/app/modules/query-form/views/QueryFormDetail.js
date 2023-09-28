import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getReqeust } from '../../../services/apiService';
import { Card, Grid } from '@mantine/core';
import { updateNotification } from '../../../redux/notificationSlice';
import { IconCircleArrowLeft } from '@tabler/icons-react';

const QueryFormDetail = () => {


    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust(`form/show/${params.id}`);
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
            setData(response.data);
            setLoading(false);
            return;
        }
    },[dispatch, params.id])

    useEffect(() => {
        loadingData();
    },[loadingData])


  return (
    <>

        <Card className=' card-border'>

                <IconCircleArrowLeft
                onClick={() => navigate("/query-form")}
                />
  

            <h1 style={{ textAlign: 'center' }}>TOUR INFORMATION</h1>

            <Grid>

                <Grid.Col span={6}>
                    <h3>Travel Month</h3>
                    <p>{data?.travel_month}</p>
                </Grid.Col>
                <Grid.Col span={6}>
                    <h3>Travel Year</h3>
                    <p>{data?.travel_year}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>Duration of Stay</h3>
                    <p>{data?.stay_days}</p>
                </Grid.Col>
                <Grid.Col span={6}>
                    <h3>Estimate Budget</h3>
                    <p>{data?.budget}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>No. of Adults</h3>
                    <p>{data?.adult_count}</p>
                </Grid.Col>
                <Grid.Col span={6}>
                    <h3>No of Children</h3>
                    <p>{data?.child_count}</p>
                </Grid.Col>

                <Grid.Col span={12}>
                    <h3>Travel Interest</h3>
                    <p>{data?.interest}</p>
                </Grid.Col>

            </Grid>

            <h1 style={{ textAlign: 'center' }}>PERSONAL INFORMATION</h1>

            <Grid>

                <Grid.Col span={6}>
                    <h3>First Name</h3>
                    <p>{data?.f_name}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>Last Name</h3>
                    <p>{data?.l_name}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>Email</h3>
                    <p>{data?.email}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>Phone</h3>
                    <p>{data?.phone}</p>
                </Grid.Col>

            </Grid>

            <h1 style={{ textAlign: 'center' }}>OTHER INFORMATION</h1>

            <Grid>

                <Grid.Col span={6}>
                    <h3>Accommodation</h3>
                    <p>{data?.accommodation}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>How you know</h3>
                    <p>{data?.how_u_know}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>If you choose</h3>
                    <p>{data?.other_information}</p>
                </Grid.Col>

                <Grid.Col span={6}>
                    <h3>Special Note</h3>
                    <p>{data?.special_note}</p>
                </Grid.Col>

            </Grid>

        </Card>

    </>
  )
}

export default QueryFormDetail