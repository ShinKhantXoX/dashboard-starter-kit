import { AppShell, Container, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { DefaultHeader } from './components/DefaultHeader';
import { DefaultNavigation } from './components/DefaultNavigation';
import { AppNotification } from "../components/AppNotification";
import { useEffect } from 'react';

export const DefaultLayout = () => {

    const [token, removeValue] = useLocalStorage({key: 'token' });
    const [schema] = useLocalStorage({defaultValue: null, key: "color-schema"});

    const navigate = useNavigate();
    console.log(token);

    // useEffect(() => {
    //     console.log(token);
    //     if(token) {
            
    //     }else {
    //         removeValue()
    //         navigate('/auth/login')
    //     }
    // }, [])

    return(
        <>
            {token && (
                <MantineProvider 
                withGlobalStyles 
                withNormalizeCSS 
                theme={{
                    colorScheme: schema ? schema : "light"
                }}
            >
                <Container 
                    fluid sx={{
                        backgroundColor: "#FAFBFC",
                        minHeight: "100vh"
                    }} 
                    p={0}
                >
                    <AppShell
                        padding="md"
                        navbar={ <DefaultNavigation />}
                        header={<DefaultHeader />}
                    >
                        <AppNotification />
                        <Outlet />
                    </AppShell>
                </Container>
                
            </MantineProvider>
            ) }
        </>
    )
}