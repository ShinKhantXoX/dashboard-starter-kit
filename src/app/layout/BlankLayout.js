import { Container, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppNotification } from '../components/AppNotification';
import { useCallback, useEffect } from 'react';

export const BlankLayout = () => {
    const [token] = useLocalStorage({key: 'token' });
    console.log(token);
    const [colorScheme] = useLocalStorage({key: 'color-schema', defaultValue: 'light' });

    const navigate = useNavigate();
    console.log(token);

    // const checkToken = useCallback(() => {

    //     if(token === undefined)
    //     {
    //         console.log('i am blank undefined');
    //         navigate("/auth/login")
    //     }

    // }, [token])

    // useEffect(() => {
    //     checkToken();
    // }, [token])

    return(
        <MantineProvider 
            withGlobalStyles 
            withNormalizeCSS 
            theme={{
                colorScheme: colorScheme,
            }}
        >
            { token ? (navigate('/')) : (
                <Container fluid sx={{backgroundColor: "#FAFBFC",height: "100vh"}} p={0}>
                    <AppNotification />
                    <Outlet />
                </Container>
                
            ) }
        </MantineProvider>
    )
}