import { Button, Card, Center, FileInput, Flex, Image } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { IconCloudUpload } from '@tabler/icons-react'
import { delRequest, getReqeust, postRequest } from '../../../services/apiService'
import {
    IconCircleMinus
} from "@tabler/icons-react"
import { useDispatch } from 'react-redux'
import { updateNotification } from '../../../redux/notificationSlice'


export const MediaList = () => {

    const [photo, setPhoto] = useState();
    const [activeImage, setActiveImage] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const getPhotos = async () => {
        const response = await getReqeust("/photo/list");
        setPhoto(response?.data);
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        const photos = new FormData();
        for (let i = 0; i < e.length; i++) {
        photos.append("photos[]", e[i], e[i].name);
        }
        console.log(photos);
        
        const response = await postRequest("/photo/store",photos)
        console.log(response);
        getPhotos();
        setLoading(false)

    }

    const handleDeletePhoto = async (id) => {

        setLoading(true);
        console.log(id);

        const response = await delRequest(`photo/delete/${id}`);
  
      if (response && response.errors) {
        // setErrors(response.errors);
        setLoading(false);
        return;
      }
  
      if (response && (response.status === 500 || response.status === 403)) {
        dispatch(
          updateNotification({
            title: "Error: Photo Delete",
            message: response.message,
            status: "fail",
          })
        );
        setLoading(false);
        return;
      }
  
      if (response && response.status === 200) {
        dispatch(
          updateNotification({
            title: "Photo Delete",
            message: response.message,
            status: "success",
          })
        );
        getPhotos();
        setLoading(false);
        return;
      }

    }

    const handleActiveImage = (e) => {
        setActiveImage(e);
    }

    useEffect(() => {
        getPhotos()
    }, [])

    console.log(activeImage);

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

            {
                loading ? <img src={'/loading.svg'} /> : (
                    <div className=' flex-wrap' >
                    {
                        photo?.data?.map((image) => {

                            const isActive = activeImage === image?.id

                            return (
                                <>
                                    <div className={isActive ? 'media-photo active' : 'media-photo'}
                                    style={{
                                        width : '300px',
                                        height : '200px',
                                        backgroundImage : `url('${image.url}')`,
                                        backgroundPosition : 'center',
                                        backgroundSize : 'cover',
                                        backgroundRepeat : 'no-repeat'
                                    }}
                                    onClick={() => {
                                        handleActiveImage(image?.id)
                                    }}
                                    >
                                        <div className={isActive && 'bg-dim'}>
                                            {
                                                isActive && (
                                                    <Flex
                                                    justify={'end'}
                                                    m={5}
                                                    >
                                                        <IconCircleMinus 
                                                        color='red'
                                                        onClick={() => handleDeletePhoto(image?.id)}
                                                        />
                                                    </Flex>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                )
            }
        </Card>
    </>
  )
}