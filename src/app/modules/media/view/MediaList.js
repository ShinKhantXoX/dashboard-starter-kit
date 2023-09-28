import { Button, Card, Center, FileInput, Flex, Image } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { IconCloudUpload } from '@tabler/icons-react'
import { getReqeust, postRequest } from '../../../services/apiService'


export const MediaList = () => {

    const [photo, setPhoto] = useState();

    const getPhotos = async () => {
        const response = await getReqeust("/photo/list");
        setPhoto(response);
    }

    const handleSubmit = async (e) => {
        
        const photos = new FormData();
        for (let i = 0; i < e.length; i++) {
        photos.append("photos[]", e[i], e[i].name);
        }
        console.log(photos);
        
        const response = await postRequest("/photo/store",photos)
        console.log(response);
        getPhotos();

    }

    useEffect(() => {
        getPhotos()
    }, [])

    console.log(photo);

  return (
    <>
        <Card p={{ sm: 15, md: 20 , lg:30}} className=' card-border'>
            <Center my={30} py={10} className=' blockquote'>

            <form>
            <Card.Section py={20}>
                    <div className=' relative'
                    >
                        <IconCloudUpload 
                        className=' border-dash'
                        size={45}
                        onClick={() => {
                            document.querySelector('.photo').click()
                        }}
                        />
                        <div className=' border-dash-1'></div>
                    </div>

                    <input
                    multiple
                    className=' photo'
                    type='file' 
                    accept='image/jpg,image/pjeg,image/png'
                    onChange={(e) => handleSubmit([...e.target.files])}
                    hidden
                    />
            </Card.Section>

            </form>

            </Center>

            <div className=' flex-wrap' >
                {
                    photo?.data?.map((image) => {
                        return (
                            <img
                            key={image.id} 
                            m={0}
                            width={100}
                            height={100}
                            className=' media-photo'
                            mx="auto" radius="md" src={image.url} alt="Random image" />
                        )
                    })
                }
            </div>
        </Card>
    </>
  )
}