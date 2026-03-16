import { Group, Select, Stack, Text } from "@mantine/core";
import { zones } from "../../data/zones";
import { sizes } from "../../data/sizes";
import { Dropzone } from "@mantine/dropzone";
import { showError } from "../../lib/notifications";
import useIsLoading from "../../context/isLoading/useIsLoading";
import { LuImageOff, LuImagePlus, LuImageUp } from "react-icons/lu";
import Attachment from "../layout/Attachment";
import type { Request } from "../../types";
import useMQuery from "../../context/MediaQuery/useMQuery";

interface Props {
    convertFiles: (files: File[]) => void;
    images: (string | ArrayBuffer | null)[];
    deleteAttachment: (index: number) => void
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void
    request: Request
}

export default function TypeSelection({convertFiles, deleteAttachment, updateRequest, request, images} : Props){
    const {isPending} = useIsLoading()
    const {isMobile} = useMQuery()
    return (
        <Stack align="center" gap={isMobile ? 10 : 40} flex={1}>
            <Text fw={700} fz="h2" ta={"center"}>Che tipo di tatuaggio vorresti?</Text>
            <Stack flex={1} gap={40} justify={isMobile ? "start" : "center"} align="center">
                <Select
                searchable
                value={request.body_part}
                onChange={(v) => updateRequest("body_part", v)}
                data={zones}
                size="md"
                label="Zona"
                withAsterisk
                description="Seleziona la zona in cui vorresti effettuare il tatuaggio"
                placeholder="Es. Torace - Spalle"
                />

                <Select
                data={sizes.map(s => ({label: s.label, value: s.value, disabled: s.value !== "large" && request?.body_part?.includes("full")}))}
                value={request.size}
                onChange={(v) => updateRequest("size", v)}
                size="md"
                label="Dimensione"
                withAsterisk
                description="Seleziona la dimensione approssimativa del tatuaggio"
                placeholder="Es. Medio"
                />

                <Stack gap={0} justify="center" align="center" w={isMobile ? "100%" : "40%"}>
                    <Text size="md" fw={"700"}>Allegati</Text>
                    <Text size="sm" c={"dimmed"} ta={"center"}>Se hai già un'idea di come vorresti il tatuaggio, allega una o più immagini per velocizzare il processo di accettazione dell'appuntamento</Text>
                </Stack>
                <Dropzone
                onDrop={(files) => convertFiles(files)}
                onReject={() => showError("Non è possibile caricare questo file. Il file non è un'immagine JPG o PNG, la dimensione supera i 2MB o hai selezionato più di 3 files")}
                accept={[
                    'image/png',
                    'image/jpeg',
                    'image/jpg'
                ]}
                maxFiles={3}
                maxSize={2000000}
                loading={isPending}
                >
                    <Dropzone.Accept>
                        <Group align="center" justify="center">
                            <LuImagePlus size={25}/>
                            <Text fz={"xs"}>Rilascia qui per caricare i file</Text>
                        </Group>
                    </Dropzone.Accept>
                    <Dropzone.Idle>
                        <Group align="center" justify="center">
                            <LuImageUp size={25}/>
                            <Text fz={"xs"}>Seleziona allegati o trascinali qui per caricarli (Massimo 3 files)</Text>
                        </Group>
                    </Dropzone.Idle>
                    <Dropzone.Reject>
                        <Group align="center" justify="center">
                            <LuImageOff size={25}/>
                            <Text fz={"xs"}>Formato allegato non valido, seleziona un file JPG o PNG</Text>
                        </Group>
                    </Dropzone.Reject>
                </Dropzone>

                <Group w={"100%"} justify="center" style={{overflow: "hidden"}}>
                    {
                        images.length ?
                        images.map((a, i) => <Attachment url={a as string} i={i} key={i} onDelete={deleteAttachment}/>) :
                        <Text c={"dimmed"} fs={"italic"} fz={"xs"} ta={"center"} w={"100%"}>Nessun allegato presente</Text>
                    }
                </Group>
            </Stack>
        </Stack>
    )
}