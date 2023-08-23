import { Button, Flex, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { userParamsInit } from "../useUserParams";

export const UserSearch = ({submitUserSearch, loading}) => {
    
    const [search, setSearch] = useState("");

    return(
        <Group>
            <Flex
                direction={"row"}
                justify={"flex-start"}
                align={"flex-end"}
            >
                <TextInput 
                    icon={<IconSearch />}
                    placeholder="Search items"
                    label="Search By"
                    disabled={loading}
                    description={`[${userParamsInit.columns}]`}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            submitUserSearch(search);
                        }
                    }}
                />

                <Button
                    disabled={loading}
                    mx={10}
                    variant="outline"
                    onClick={() => submitUserSearch("")}
                >
                    Reset
                </Button>
            </Flex>
        </Group>
    )
}