import { Button, Flex, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { itemCategoryParamsInit } from "../useItemCategoryParams"

export const ItemCategorySearch = ({submitSearch, loading}) => {
    
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
                    placeholder="Search item categories"
                    label="Search By"
                    disabled={loading}
                    description={`[${itemCategoryParamsInit.columns}]`}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            submitSearch(search);
                        }
                    }}
                />

                <Button
                    disabled={loading}
                    mx={10}
                    variant="outline"
                    onClick={() => submitSearch("")}
                >
                    Reset
                </Button>
            </Flex>
        </Group>
    )
}