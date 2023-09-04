import { Flex, Grid, PasswordInput, TextInput, Text, Button, Box, Card, Image } from "@mantine/core"
import { useDocumentTitle, useLocalStorage } from "@mantine/hooks"
import { IconLock, IconPassword, IconUser } from "@tabler/icons-react"
import { useEffect, useState } from "react";
import { postRequest } from '../../../services/apiService';
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { useDispatch } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { setToken } from "../../../redux/tokenSlice";
import coverImage from "../../../assets/images/photo.jpg";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    useDocumentTitle("Login");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [token, setToken, removeValue] = useLocalStorage({key: 'token'});

    const [payload, setPayload] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const payloadHandler = (value, field) => {
        let updatePayload = {...payload};
        updatePayload[field] = value;
        setPayload(updatePayload);
    }

    const submitLogin = async () => {
        setLoading(true);
        setErrors(null);

        const response = await postRequest('/login', payload);

        if(response && response.errors) {
            setErrors(response.errors);
            setLoading(false);
            return;
        }

        if(response && (response.status === 401 || response.status === 500 || response.status === 403)) {
            dispatch(updateNotification({
                title: "Login Fail",
                message: response.message,
                status: 'fail'
            }));  
            setLoading(false);
            return;
        }

        if(response && response.status === 200) {
            setToken(response.data.access_token);
            dispatch(updateNotification({
                title: "Login Success",
                message: response.message,
                status: 'success',
                token : response.data.access_token
            }));
            setLoading(false);
            if(token !== undefined | token !== null) {
                navigate("/country")
            }
            return;
        }
    }

    useEffect(() => {
        removeValue();
    }, [])

    return(
        <Grid gutter={0}>
            <Grid.Col sm={12} md={8} className=" login-res">
                <Flex
                    h={"100vh"}
                    direction={{ sm: "row" }}
                    justify={"center"}
                    align={"center"}
                    sx={{ backgroundColor: "#8B57F9"}}
                >
                    <Card m="50px" p="50px">
                        <Card.Section> Golden Yellow Feature </Card.Section>
                        <Card.Section sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: '20px'
                        }}> 
                            <Image 
                                radius="md"
                                withPlaceholder
                                width={"300px"}
                                src={coverImage} 
                            />
                            <ul>
                                <li> Country Management </li>
                                <li> City Management </li>
                                <li> Tour Management </li>
                                <li> Package Management </li>
                                <li> Photo Management </li>
                                <li> News Management </li>
                                <li> Itinerary Management </li>
                                <li> Inclusion Management </li>
                            </ul>
                        </Card.Section>
                    </Card>
                </Flex>
            </Grid.Col>

            <Grid.Col sm={12} md={4}>
                <Flex
                    mih={"100vh"}
                    w={"100%"}
                    direction={"column"}
                    justify={"center"}
                    align={"center"}
                >
                    <Box>
                        <Text size={30}> Golden Yellow </Text>

                        <TextInput 
                            w={{md: "300px"}}
                            icon={<IconUser size={20}/>}
                            placeholder="Enter your email"
                            label="Email"
                            description="email must be .com"
                            error={errors && errors['email'] && (<FormValidationMessage message={errors['email'][0]} />)}
                            my={10}
                            value={payload.email}
                            onChange={(e) => payloadHandler(e.target.value, 'email')}
                            disabled={loading}
                        />

                        <PasswordInput 
                            w={{md: "300px"}}
                            my={10}
                            icon={<IconPassword size={20}/>}
                            placeholder="Enter your password"
                            label="Password"
                            description="password must be min 6 and max 18"
                            value={payload.password}
                            error={errors && errors['password'] && (<FormValidationMessage message={errors['password'][0]} />)}
                            onChange={(e) => payloadHandler(e.target.value, 'password')}
                            disabled={loading}
                        />

                        <Button
                            fullWidth
                            variant="outline"
                            mt={20}
                            leftIcon={<IconLock />}
                            onClick={() => submitLogin()}
                            disabled={loading}
                            loading={loading}
                        > 
                            LOGIN 
                        </Button>
                    </Box>
                </Flex>
            </Grid.Col>
        </Grid>

    )
}