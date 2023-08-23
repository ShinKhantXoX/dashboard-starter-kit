import { Button } from "@mantine/core"

export const SaveButton = ({loading, submit}) => {

    return(
        <Button
            my={20}
            fullWidth
            variant="outline"
            onClick={() => submit()}
            loading={loading}
            disabled={loading}
        > 
        Save 
    </Button>
    )
} 