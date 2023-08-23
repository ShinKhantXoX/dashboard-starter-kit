import { Button, Flex, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { itemParamsInit } from "../useItemParams"
import { useState } from "react"

export const ItemSearch = ({submitItemSearch, loading}) => {
    
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
                    description={`[${itemParamsInit.columns}]`}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            submitItemSearch(search);
                        }
                    }}
                />

                <Button
                    disabled={loading}
                    mx={10}
                    variant="outline"
                    onClick={() => submitItemSearch("")}
                >
                    Reset
                </Button>
            </Flex>
        </Group>
    )
}