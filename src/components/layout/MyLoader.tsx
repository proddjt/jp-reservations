import { Loader, Stack, Title } from "@mantine/core";

interface Props {
    size?: string
}

export default function MyLoader({size}: Props){
    return (
        <Stack
        flex={1}
        h={"100%"}
        justify="center"
        align="center"
        >
            <Loader size={size || "xl"} type="bars" />
            <Title order={3}>Caricamento...</Title>
        </Stack>
    )
}