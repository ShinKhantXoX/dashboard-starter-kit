import { Button, Flex, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { packageInclusionParamsInit } from "../usePackageInclusionParams"

export const PackageInclusionSearch = ({submitCountrySearch, loading}) => {
    
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
                    placeholder="Search inclusion"
                    label="Search By"
                    disabled={loading}
                    value={search}
                    description={`[${packageInclusionParamsInit.columns}]`}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            submitCountrySearch(search);
                        }
                    }}
                />

                <Button
                    disabled={loading}
                    mx={10}
                    variant="outline"
                    onClick={() => 
                        (submitCountrySearch(""),
                        setSearch(''))
                    }
                >
                    Reset
                </Button>
            </Flex>
        </Group>
    )
}