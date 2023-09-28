import {
  Card,
  Center,
  Divider,
  FileInput,
  Flex,
  Grid,
  Group,
  Image,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDocumentTitle, useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FormValidationMessage } from "../../../components/FormValidationMessage";
import { postRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "../../../redux/notificationSlice";
import { countryPayload } from "../countryPayload";
import { payloadHandler } from "../../../helpers/payloadHandler";
import { SaveButton } from "../../../components/SaveButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../../components/NavButton";
import { FileButton } from "../../../components/FileButton";

export const CreateCountry = () => {
  useDocumentTitle("New Country");

  const { countryCreate } = countryPayload;
  const [payload, setPayload] = useState('');
  const [mainPayload, setMainPayload] = useState({
    name : '',
    country_photo: ''
  })
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token] = useLocalStorage({key: 'token' });

  const dispatch = useDispatch();
  const navigate = useNavigate();


    const selectImage = useSelector((state) => state.imageSelect);

  const submitCreateCountry = async () => {
    setLoading(true);
    setErrors(null);

    console.log(mainPayload);

    const response = await postRequest("country/create", mainPayload);
    console.log(response);

    if (response && response.errors) {
      setErrors(response.errors);
      setLoading(false);
      return;
    }

    if (response && (response.status === 500 || response.status === 403)) {
      dispatch(
        updateNotification({
          title: "Error: Country create",
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
          title: "Country create",
          message: response.message,
          status: "success",
          token : token
        })
      );
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
      setMainPayload({
        name : payload,
        country_photo : selectImage?.url
      })
  }, [selectImage, payload])

  console.log(mainPayload);

  return (
    <Grid>
      <Grid.Col md={12}>
        <Flex direction={"row"} justify={"flex-end"} align={"center"}>
          <Group>
            <NavButton
              label="Country List"
              click={() => navigate("/country")}
            />
          </Group>
        </Flex>
      </Grid.Col>

      <Grid.Col sm={12} md={6}>
        <Card p={20} className="card-border">
          <Card.Section my={20}>
            <Text sx={{ fontSize: 20, fontWeight: 500 }}> Create Country </Text>
            <Divider variant="dashed" my={10} />
          </Card.Section>

          <Card.Section px={10}>
            <Center>
                <FileButton 
                id="file"
                    className="photo"

                    title={"File upload"}
                    />
            </Center>

            {/* <input 
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            onChange={(e) => console.log(e.target.files)}
            /> */}

            <TextInput
              my={10}
              placeholder="Enter full name"
              label="Name"
              disabled={loading}
              error={
                errors &&
                errors["name"] && (
                  <FormValidationMessage message={errors["name"][0]} />
                )
              }
              onChange={(e) => setPayload(e.target.value)
              }
            />

              {/* <div className={'hidden'}> */}
              {/* </div> */}

            <SaveButton
              loading={loading}
              submit={() => submitCreateCountry()}
            />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
