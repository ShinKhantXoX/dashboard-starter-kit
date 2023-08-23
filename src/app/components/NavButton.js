import { Button } from "@mantine/core"

export const NavButton = ({label, click, disabled}) => {

    return(
        <Button
            variant="outline"
            onClick={() => click()}
            compact
            disabled={disabled}
        > 
        {label} 
    </Button>
    )
} 