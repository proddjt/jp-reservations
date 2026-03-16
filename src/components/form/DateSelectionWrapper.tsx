import { Group, Stack } from "@mantine/core"
import useMQuery from "../../context/MediaQuery/useMQuery"

export default function DateSelectionWrapper({children}: {children: React.ReactNode}) {
    const {isMobile} = useMQuery()
    return (
        <>
        {
            isMobile ? 
            <Stack w={"100%"} justify="start" align="center" gap={10}>
                {children}
            </Stack>
            :
            <Group flex={1} justify="center" gap={0} align="center" w={"100%"}>
                <Group align="start" gap={0} w={"100%"} justify="center" >
                    {children}
                </Group>
            </Group>
        }
        </>
    )
}