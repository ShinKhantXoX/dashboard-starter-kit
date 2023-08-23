import { Button, Flex, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { useCustomerParamsInit } from "../useCustomerParams";

export const CustomerSearch = ({submitSearch, loading}) => {
    
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
                    placeholder="Search customer"
                    label="Search By"
                    disabled={loading}
                    description={`[${useCustomerParamsInit.columns}]`}
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