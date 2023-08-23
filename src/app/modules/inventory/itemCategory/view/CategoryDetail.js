import { Flex, Grid, Group } from "@mantine/core"
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getReqeust } from "../../../../services/apiService";
import { updateNotification } from "../../../../redux/notificationSlice";
import { NavButton } from "../../../../components/NavButton";
import { DelButton } from "../../../../components/DelButton";
import { ItemCategoryUpdate } from "../entry/ItemCategoryUpdate";
import { ItemInCategoryList } from "./ItemInCategoryList";

export const CategoryDetail = () => {

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(null);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingData = useCallback(async () => {
        setLoading(true);
        const response = await getReqeust(`item/category/${params.id}`);

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
                            label="List"
                            click={() => navigate('/inventory/category')}
                            disabled={loading}
                        />

                        <NavButton 
                            label="Create"
                            click={() => navigate('/inventory/category/new')}
                            disabled={loading}
                        />

                        {dataSource && dataSource.length > 0 && (
                            <DelButton 
                                title="Are you sure to delete?"
                                message="Do you want to delete this item?"
                                action={`item/category/${params.id}`}
                                callbackUrl={"/inventory/category"}
                            />
                        )}
                    </Group>
                </Flex>
            </Grid.Col>

            {dataSource && (
                <Grid.Col sm={12} md={4} my={10} px={5}>
                    <ItemCategoryUpdate
                        dataSource={dataSource}
                        update={(itemValue) => setDataSource(itemValue)}
                    />
                </Grid.Col>
            )}

            {dataSource && (
                <Grid.Col sm={12} md={8} my={10} px={5}>
                    <ItemInCategoryList 
                        dataSource={dataSource}
                        update={(itemValue) => setDataSource(itemValue)}
                    />
                </Grid.Col>
            )}
        </Grid>
    )
}