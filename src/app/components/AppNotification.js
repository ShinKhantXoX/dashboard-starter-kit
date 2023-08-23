import { Notification, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const AppNotification = () => {
    const state = useSelector(state => state.notificaiton);
    const [payload, setPayload] = useState(null);

    useEffect(() => {
        if(state) {
            setPayload(state);
            setTimeout(() => {
                setPayload(null);
            }, 2000);
        }
    }, [state, setPayload]);
    return(
        <>
            {payload && (
                <Notification 
                    w={{ sm: "100%", md: '300px'}}
                    icon={<IconCircleCheck size={30} />}
                    color={payload.status === 'success' ? 'teal' : 'red'} 
                    title={payload.title} 
                    onClose={() => setPayload(null)}
                    sx={{ 
                        position: "fixed", 
                        right: "10px", 
                        top: '20px',
                        zIndex: 999
                    }}
                >
                <Text> {payload.message}</Text>
            </Notification>
            )}
        </>

    )
}