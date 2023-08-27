import { AppShell, Container, MantineProvider } from '@mantine/core';
import { useDocumentTitle, useLocalStorage } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { DefaultHeader } from './components/DefaultHeader';
import { DefaultNavigation } from './components/DefaultNavigation';
import { AppNotification } from "../components/AppNotification";
import { useCallback, useEffect } from 'react';

export const DefaultLayout = () => {

    useDocumentTitle("Golden Yellow");
    const [token] = useLocalStorage({key: 'token' });
    const [schema] = useLocalStorage({defaultValue: null, key: "color-schema"});

    const navigate = useNavigate();
    
    // const checkToken = useCallback(() => {

    //     if(token === undefined)
    //     {
    //         console.log('i am default undefined');
    //         navigate("/auth/login")
    //     }else {
    //         navigate('/')
    //     }

    // }, [token])

    // useEffect(() => {
    //     checkToken();
    // }, [token])

    return(
        <>
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
                        minHeight: "100vh",
                        overflowX : "hidden"
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
        </>
    )
}