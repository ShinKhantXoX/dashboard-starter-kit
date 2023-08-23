import { Container, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppNotification } from '../components/AppNotification';

export const BlankLayout = () => {
    const [token] = useLocalStorage({key: 'token', defaultValue: null });
    console.log(token);
    const [colorScheme] = useLocalStorage({key: 'color-schema', defaultValue: 'light' });

    const navigate = useNavigate();

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