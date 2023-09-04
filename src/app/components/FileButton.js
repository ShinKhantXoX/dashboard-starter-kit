import { Button, Card, Center, Divider, Flex, Image, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getReqeust, postRequest } from "../services/apiService";
import { IconCloudUpload } from "@tabler/icons-react";
import { setImage } from "../redux/selectImage";

export const FileButton = ({ title, message, action, callbackUrl, url = null }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);

  const [activeImage, setActiveImage] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState();
  const [selectPhoto, setSelectPhoto] = useState();

  const getPhotos = async () => {
    const response = await getReqeust("/photo/list");
    setPhoto(response);
  };

  const handleSubmit = async (e) => {
    const photos = new FormData();
    for (let i = 0; i < e.length; i++) {
      photos.append("photos[]", e[i], e[i].name);
    }

    const response = await postRequest("/photo/store", photos);
    getPhotos();
  };

  useEffect(() => {
    getPhotos();
  }, []);

  const selectHandler = (e) => {
    console.log(e);
    dispatch(setImage(selectPhoto)) 
    close()
  }

  const handleActiveImage = (e) => {
    setActiveImage(e)
  }

  return (
    <>
      <Image
        width={'100%'}
        height={200}
        my={10}
        // radius={"50%"}
        onClick={open}
        src={selectPhoto ? selectPhoto.url : url}
        withPlaceholder
      />

      <Modal className=" file-modal" opened={opened} onClose={close} title={title}>
        <Divider variant="dashed" />
        <Text weight={700} my={20}>
          {" "}
          {message}{" "}
        </Text>

        <Center mb={30}>
          <form>
            <Card.Section>
              <div className=" relative">
                <IconCloudUpload
                  className=" border-dash"
                  size={45}
                  onClick={() => {
                    document.querySelector(".photo").click();
                  }}
                />
                <div className=" border-dash-1"></div>
              </div>
              <input
                multiple
                className=" photo"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(e) => handleSubmit([...e.target.files])}
                hidden
              />
            </Card.Section>
          </form>
        </Center>

        <div className=" flex-wrap">
          {photo?.data?.map((image) => {

            const isActive = activeImage === image?.name;

            return (
              <img
                key={image.id}
                m={0}
                width={150}
                height={100}
                className={` media-photo ${isActive && 'img-active'}`}
                mx="auto"
                radius="md"
                src={image.url}
                alt="Random image"
                onClick={() => 
                  (
                    setSelectPhoto(image),
                    handleActiveImage(image?.name)
                  )
                }
              />
            );
          })}
        </div>

        <Flex direction={"row"} align={"center"} justify={"flex-end"}>
          <Button variant="outline" mx={10} disabled={loading} onClick={close}>
            {" "}
            Cancel{" "}
          </Button>
          <Button
            color="blue"
            disabled={loading}
            onClick={() => selectHandler()}
          >
            {" "}
            Save{" "}
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
