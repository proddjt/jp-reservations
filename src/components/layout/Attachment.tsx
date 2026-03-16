import { ActionIcon, Button, Group, Image, Paper, Popover, PopoverDropdown, Stack, Text, Title } from "@mantine/core"
import { useState } from "react"
import { TiDelete } from "react-icons/ti"
import { modals } from "@mantine/modals"
import useMQuery from "../../context/MediaQuery/useMQuery"

interface Props{
    url: string,
    onDelete?: (i: number) => void
    i?: number,
    name?: string
}

export default function Attachment({url, i, onDelete}: Props){
    const [open, setOpen] = useState(false)
    const {isMobile} = useMQuery()

    const openImg = () => modals.open({
        title: 
            <Group justify="space-between">
                <Title order={4}>Allegato</Title>
            </Group>,
        children: <Image src={url} w={"100%"}/>,
        size: "xl"
    })

    return (
        <Paper style={{overflow: "hidden", position: "relative"}} shadow="md" radius="md" withBorder w={isMobile ? "40%" : "10%"} p={0}>
            {
                (onDelete && (i !== undefined)) && 
                <Popover opened={open} onChange={setOpen}>
                    <Popover.Target>
                        <ActionIcon style={{position: "absolute", right: "5px", top: "5px"}} size={"xs"}>
                            <TiDelete onClick={() => setOpen(true)}/>
                        </ActionIcon>
                    </Popover.Target>
                    <PopoverDropdown>
                        <Stack>
                            <Text size="xs">Vuoi confermare l'eliminazione dell'allegato?</Text>
                            <Group justify="space-between">
                                <Button variant="light" size="xs" onClick={() => setOpen(false)}>Annulla</Button>

                                <Button size="xs" onClick={() => {onDelete(i); setOpen(false)}}>Conferma</Button>
                            </Group>
                        </Stack>
                    </PopoverDropdown>
                </Popover>
            }
            <Image onClick={openImg} src={url} w={"100%"}/>
        </Paper>
    )
}