import { Flex, Grid, Group } from "@mantine/core"
import React, { useCallback, useState, useEffect } from 'react'
import { getReqeust } from '../../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { updateNotification } from "../../../redux/notificationSlice";
import { useDispatch } from 'react-redux';
import { DelButton } from "../../../components/DelButton";
import { NavButton } from "../../../components/NavButton";

import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const RecycleBinDetail = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust(`book-form/trash/${params.id}`);
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
            setData(response.data);
            setLoading(false);
            return;
        }
    }, [dispatch, params.id])

    useEffect(() => {
        loadingData();
    }, [loadingData])

    // ? Alert
    function PermanentDelAlert() {
        const icon = <IconInfoCircle />;
        return (
            <Alert variant="light" color="red" radius="md" title="Alert title" icon={icon}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis, quae tempore necessitatibus placeat saepe.
            </Alert>
        );
    }

    return (
        <Grid gutter={0}>
            {data && (
                <>
                    <Grid.Col md={12}>
                        <Flex
                            direction={"row"}
                            justify={"flex-end"}
                            align={"center"}
                        >
                            <Group>
                                {/* <NavButton
                                    label="Restore"
                                    click={() => navigate('/tour/new')}
                                    disabled={loading}
                                /> */}
                                

                                <DelButton
                                    title="Are you sure to delete?"
                                    message="Do you want to delete this Booking permanently?"
                                    action={`book-form/destroy/${params.id}`}
                                    callbackUrl={"/book-form"}
                                />
                            </Group>
                        </Flex>
                    </Grid.Col>

                    <Grid.Col sm={12} md={4}>
                        <UpdateTour
                            dataSource={data}
                            update={(e) => setData(e)}
                        />
                    </Grid.Col>
                </>
            )}
        </Grid>
    )
}

export default RecycleBinDetail;