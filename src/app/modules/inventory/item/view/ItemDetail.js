import { Flex, Grid, Group } from "@mantine/core"
import { ItemUpdate } from "../entry/ItemUpdate";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../../redux/notificationSlice";
import { getReqeust } from "../../../../services/apiService";
import { NavButton } from "../../../../components/NavButton";
import { DelButton } from "../../../../components/DelButton";
import { ItemStatusChange } from "../entry/ItemStatusChange";
import { ItemDescriptonChange } from "../entry/ItemDescriptionChange";

export const ItemDetail = () => {

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(null);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust(`item/general/${params.id}`);

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
            setDataSource(response.data);
            setLoading(false);
            return;
        }
    },[dispatch, params.id]);

    useEffect(() => {
        loadingData();
    },[loadingData]);

    return(
        <Grid gutter={0}>
            <Grid.Col md={12}>
                <Flex
                    direction={"row"}
                    justify={"flex-end"}
                    align={"center"}
                >
                    <Group>
                        <NavButton 
                            label="Create"
                            click={() => navigate('/inventory/item/new')}
                            disabled={loading}
                        />

                        <DelButton 
                            title="Are you sure to delete?"
                            message="Do you want to delete this item?"
                            action={`item/general/${params.id}`}
                            callbackUrl={"/inventory/item"}
                        />
                    </Group>
                </Flex>
            </Grid.Col>

            {dataSource && (
                <Grid.Col sm={12} md={4} my={10} px={5}>
                    <ItemUpdate
                        dataSource={dataSource}
                        update={(itemValue) => setDataSource(itemValue)}
                    />
                </Grid.Col>
            )}

            {dataSource && (
                <Grid.Col sm={12} md={8} my={10} px={5}>
                    <Grid.Col md={12}>
                        <ItemStatusChange 
                            dataSource={dataSource}
                            update = {(itemValue) => setDataSource(itemValue)}
                        />
                    </Grid.Col>

                    <Grid.Col md={12} my={10}>
                        <ItemDescriptonChange 
                            dataSource={dataSource}
                            update = {(itemValue) => setDataSource(itemValue)}
                        />
                    </Grid.Col>
                    
                </Grid.Col>
            )}
        </Grid>
    )
}