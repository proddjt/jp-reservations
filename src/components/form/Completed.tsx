import { Stack, Text, Title } from "@mantine/core";
import useIsLoading from "../../context/isLoading/useIsLoading";
import MyLoader from "../layout/MyLoader";

interface Props {
    code: string
}

export default function Completed({code} : Props){
    const {isPending} = useIsLoading()

    if (isPending) return <MyLoader/>

    return (
        <Stack align="center" justify="center" gap={10} flex={1}>
            <Stack align="center" gap={5}>
                <Title order={1} size={"3em"} ta={"center"}>Richiesta inviata con successo!</Title>
                <Text size="md" c={"dimmed"} ta={"center"}>Codice prenotazione: #{code}</Text>
                <Text size="md" c={"dimmed"} ta={"center"}>Fai uno screenshot a questa pagina e conservalo fino al giorno dell'appuntamento.</Text>
            </Stack>
        </Stack>
    )
}