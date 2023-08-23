import { Text } from "@mantine/core"

export const FormValidationMessage = ({message}) => {

    return(
        <Text sx={{ color: 'red', fontStyle: 'italic'}}> *{message} </Text>
    )
}