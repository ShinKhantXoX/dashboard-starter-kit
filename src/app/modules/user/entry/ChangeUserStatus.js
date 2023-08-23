import { Card, Divider, Select, Text } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import { getReqeust, putRequest } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { useParams } from "react-router-dom";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { SaveButton } from "../../../components/SaveButton";
import { userPayload } from "../userPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";

export const ChangeUserStatus = ({dataSource, update}) => {

    const { userChangeSatus } = userPayload;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [userStatus, setUserStatus] = useState([]);
    const [user, setUser] = useState(null);
    const [payload, setPayload] = useState(userChangeSatus(user));
    
    const dispatch = useDispatch();
    const id = useParams().id;

    const loadingData = useCallback(async () => {
        const response = await getReqeust('general/status', {
            type: 'user'
        });

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
            setLoading(false);
            let status = [];
            response.data.user.map((statusValue) => {
                status.push({
                    value: statusValue,
                    label: statusValue,
                    disabled: user && user.status === statusValue ? true : false 
                });
                return statusValue;
            });
            setUserStatus(status);
            return;
        }
    }, [dispatch, user]);

    const submitUseStatusChange = async () => {
        setLoading(true);
        setErrors(null);

        const response = await putRequest(`user/${id}`, payload);
        
        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 401 || response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Error: Status Change",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            dispatch(updateNotification({
                title: "Status Change",
                message: response.message,
                status: 'success'
            }));  
            setLoading(false);
            update(response.data);
            return;
        }
    }

    useEffect(() => {
        loadingData()
    },[loadingData]);
    
    useEffect(() => {
        if(dataSource) {
            setUser(dataSource);
            setPayload({
                status: dataSource.status
            });
        }
    },[dataSource]);

    return(
        <Card p={20} className="card-border">
            <Card.Section  my={20}>
                <Text sx={{ fontSize: 20, fontWeight: 500}}> Change User Status </Text>
                <Divider variant="dashed" my={10} />
            </Card.Section>

            <Card.Section px={10}>
                <Select 
                    my={10}
                    label="User Status"
                    placeholder="Choose user status"
                    searchable
                    nothingFound="No status"
                    data={userStatus}
                    value={payload.status}
                    disabled={loading}
                    error={errors && errors['status'] && <FormValidationMessage message={errors['status'][0]} />}
                    onChange={(e) => payloadHandler(payload, e, 'status', (updateValue) => {
                        setPayload(updateValue);
                    })}
                    
                />

                <SaveButton 
                    loading={loading}
                    submit={() => submitUseStatusChange()}
                />
            </Card.Section>
        </Card>
    )
}