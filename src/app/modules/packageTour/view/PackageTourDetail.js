import { Flex, Grid, Group } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import { getReqeust } from "../../../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { updateNotification } from "../../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { DelButton } from "../../../components/DelButton";
import { NavButton } from "../../../components/NavButton";
import { UpdatePackageTour } from "../entry/UpdatePackageTour";

export const PackageTourDetail = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust(`package-tour/show/${params.id}`);
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

    return(
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
                                <NavButton 
                                    label="Create"
                                    click={() => navigate('/package-tour/new')}
                                    disabled={loading}
                                />

                                <DelButton 
                                    title="Are you sure to delete?"
                                    message="Do you want to delete this package tour?"
                                    action={`package-tour/${params.id}`}
                                    callbackUrl={"/package-tour"}
                                />
                            </Group>
                        </Flex>
                    </Grid.Col>

                    <Grid.Col sm={12} md={4}>
                        <UpdatePackageTour
                            dataSource={data} 
                            update={(e) => setData(e)} 
                        />
                    </Grid.Col>
                </>
            )}
        </Grid>
    )
}