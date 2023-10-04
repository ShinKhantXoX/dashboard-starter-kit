import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getReqeust, patchRequest, postRequest } from "../../../services/apiService";
import { updateNotification } from "../../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  Center,
  Divider,
  FileButton,
  Flex,
  Grid,
  Image,
  Text,
  TextInput,
} from "@mantine/core";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { IconArrowLeft } from "@tabler/icons-react";

const RecycleBinMediaDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [errors, setErrors] = useState();

  const params = useParams();
  console.log(params);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingData = useCallback(async () => {
    setLoading(true);
    const response = await getReqeust(`photo/deleted-photo/${params.id}`);
    console.log(response);

    if (
      response &&
      (response.status === 401 ||
        response.status === 500 ||
        response.status === 403)
    ) {
      dispatch(
        updateNotification({
          title: "Error",
          message: response.message,
          status: "fail",
        })
      );
      setLoading(false);
      return;
    }

    if (response && response.status === 200) {
      setData(response.data);
      setLoading(false);
      return;
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    loadingData();
  }, [loadingData]);
  console.log(data);

   // Restoring
   const RestoreMedia = async (id) => {
    setLoading(true);
    setErrors(null);
    //   return;

    const response = await patchRequest(`photo/restore/${id}`);
    // console.log("response >> ", response)
    if (response && response.errors) {
      setErrors(response.errors);
      setLoading(false);
      return;
    }

    if (response && (response.status === 500 || response.status === 403)) {
      dispatch(
        updateNotification({
          title: "Error: Booking Restoring!",
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
          title: "Booking Restored",
          message: response.message,
          status: "success",
        })
      );
      loadingData()
      setLoading(false);
      return;
    }
  };

  return (
    <Card p={20} className="card-border" w={500}>
      <Card.Section my={20}>
        <Flex direction={"row"} justify={"space-between"} align={"center"}>
          <Text sx={{ fontSize: 20, fontWeight: 500 }}>Recycle Media Detail </Text>
          <Button
            variant="filled"
            color="grape"
            onClick={() => navigate("/bin/media")}
          >
            <IconArrowLeft size={20} />
          </Button>
        </Flex>

        <Divider variant="dashed" my={10} />
      </Card.Section>

      <Card.Section px={10}>
        <Center>
          <Image
            radius="md"
            src={data?.url}
          />
        </Center>
        <Flex gap={{ base: "sm", sm: "lg" }}>
          <Text color="dark.2" w={200}>
            Name{" "}
          </Text>
          <Text>-</Text>
          <Text>{data?.name}</Text>
        </Flex>
        


      </Card.Section>


    </Card>
  );
};

export default RecycleBinMediaDetail;
