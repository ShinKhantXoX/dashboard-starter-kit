import { AppShell, Container, MantineProvider } from '@mantine/core';
import { useDocumentTitle, useLocalStorage } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { DefaultHeader } from './components/DefaultHeader';
import { DefaultNavigation } from './components/DefaultNavigation';
import { AppNotification } from "../components/AppNotification";
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const DefaultLayout = () => {

    useDocumentTitle("Golden Yellow");
    // const [token] = useLocalStorage({key: 'token' });
    const [schema] = useLocalStorage({defaultValue: null, key: "color-schema"});

    const navigate = useNavigate();

    const token = useSelector((state) => state.notificaiton);

    useEffect(() => {   

        if(token?.token === undefined | token?.token === null | token?.token === '') {
            console.log('token not found');
            navigate('/auth/login')
        }else {
            navigate('/country')
        }

    }, [])

    return(
        <>
            {
                token && (
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
                )
            }
        </>
    )
}