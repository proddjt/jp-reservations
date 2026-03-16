import { Group, Stack, Text, Textarea, TextInput } from "@mantine/core"
import type { Request } from "../../types"
import dayjs from "dayjs"
import { zones } from "../../data/zones"
import { sizes } from "../../data/sizes"
import Attachment from "../layout/Attachment"
import { getPhoneNumber } from "../../utils/functions"
import useMQuery from "../../context/MediaQuery/useMQuery"

interface Props {
    request: Request,
    images: (string | ArrayBuffer | null)[],
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void
}



const getZoneLabel = (value: string) => zones.flatMap(z => z.items).find(i => i.value === value)?.label ?? ""

const getSize = (value: string) => sizes.find(s => s.value === value)?.label ?? ""


export default function Summary({request, images, updateRequest}: Props){
    const {isMobile} = useMQuery()
    return (
        <Stack align="center" gap={10} flex={1}>
            <Stack align="center" gap={5}>
                <Text fw={700} fz="h2" ta={"center"}>Riepilogo richiesta</Text>
                <Text size="sm" c={"dimmed"} ta={"center"}>Attenzione! Ti ricordiamo che questa <b>NON</b> è una conferma di appuntamento ma solo una <b>richiesta</b>.</Text>
                <Text size="sm" c={"dimmed"} ta={"center"}>Verrai contattato da noi il prima possibile per l'esito della tua richiesta e per definire i dettagli.</Text>
            </Stack>

            <Stack flex={1} gap={isMobile ? 5 : 20} pb={30} justify="center" align="center" w={isMobile ? "90%" : "40%"}>

                <Group justify="space-between" w={"100%"} visibleFrom="md">
                    <TextInput flex={1} size="md" readOnly label="Nome" value={request.first_name || ""}/>
                    <TextInput flex={1} size="md" readOnly label="Cognome" value={request.last_name || ""}/>
                    <TextInput flex={1} size="md" readOnly label="Telefono" value={getPhoneNumber(request.phone_number.country, request.phone_number.nationalNumber) || ""}/>
                </Group>
                <TextInput w={isMobile ? "100%" : undefined} hiddenFrom="md" flex={1} size="sm" readOnly label="Nome" value={request.first_name || ""}/>
                <TextInput w={isMobile ? "100%" : undefined} hiddenFrom="md" flex={1} size="sm" readOnly label="Cognome" value={request.last_name || ""}/>
                <TextInput w={isMobile ? "100%" : undefined} hiddenFrom="md" flex={1} size="sm" readOnly label="Telefono" value={getPhoneNumber(request.phone_number.country, request.phone_number.nationalNumber) || ""}/>

                <Group justify="space-between" w={"100%"}>
                    <TextInput flex={1} size={isMobile ? "sm" : "md"} readOnly label="Zona" value={getZoneLabel(request.body_part || "") || ""}/>
                    <TextInput flex={1} size={isMobile ? "sm" : "md"} readOnly label="Dimensione" value={getSize(request.size || "") || ""}/>
                </Group>
                <Group justify="space-between" w={"100%"}>
                    <TextInput flex={1} size={isMobile ? "sm" : "md"} readOnly label="Data" value={dayjs(request.date).format("DD/MM/YYYY")}/>
                    <TextInput flex={1} size={isMobile ? "sm" : "md"} readOnly label="Ora" value={dayjs(request.date).format("HH:mm")}/>
                </Group>
                <Group w={"100%"} justify="center" style={{overflow: "hidden"}} py={15}>
                    {
                        images.length ?
                        images.map((a, i) => <Attachment url={a as string} i={i} key={i}/>) :
                        <Text c={"dimmed"} fs={"italic"} fz={"xs"} ta={"center"} w={"100%"}>Nessun allegato presente</Text>
                    }
                </Group>
                <Textarea
                label="Note aggiuntive"
                description="Inserisci qui eventuali note aggiuntive o richieste sul tatuaggio o sull'appuntamento"
                value={request.notes || undefined}
                onChange={(e) => updateRequest("notes", e.target.value)}
                autosize
                minRows={4}
                maxRows={4}
                size={isMobile ? "sm" : "md"}
                placeholder="Es. siamo un gruppo di tre persone, vorrei più di un tatuaggio in punti diversi, preferirei il martedì ma non è disponibile, ecc..."
                w={"100%"}
                />
            </Stack>
        </Stack>
    )
}