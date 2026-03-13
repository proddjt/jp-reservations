import { Checkbox, Group, Select, Stack, Text } from "@mantine/core";
import { zones } from "../../data/zones";
import { sizes } from "../../data/sizes";
import { Dropzone } from "@mantine/dropzone";
import { showError } from "../../lib/notifications";
import useIsLoading from "../../context/isLoading/useIsLoading";
import { LuImageOff, LuImagePlus, LuImageUp } from "react-icons/lu";
import Attachment from "../layout/Attachment";
import type { Request } from "../../types";

interface Props {
    convertFiles: (files: File[]) => void;
    images: (string | ArrayBuffer | null)[];
    deleteAttachment: (index: number) => void
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void
    request: Request
}

export default function TypeSelection({convertFiles, deleteAttachment, updateRequest, request, images} : Props){
    const {isPending} = useIsLoading()
    return (
        <Stack align="center" gap={40}>
            <Text fw={700} fz="h2" ta={"center"}>Che tipo di tatuaggio vorresti?</Text>

            <Select
            searchable
            value={request.body_part}
            onChange={(v) => updateRequest("body_part", v)}
            data={zones}
            size="md"
            label="Zona"
            withAsterisk
            description="Seleziona la zona in cui vorresti effettuare il tatuaggio"
            placeholder="Seleziona una zona"
            />

            <Select
            data={sizes.map(s => ({label: s.label, value: s.value, disabled: s.value !== "large" && request?.body_part?.includes("full")}))}
            value={request.size}
            onChange={(v) => updateRequest("size", v)}
            size="md"
            label="Dimensione"
            withAsterisk
            description="Seleziona la dimensione approssimativa del tatuaggio"
            placeholder="Seleziona una dimensione"
            />

            <Checkbox label="Il tatuaggio è colorato?" size="md" checked={!!request.has_colors} onChange={(e) => updateRequest("has_colors", e.currentTarget.checked)}/>

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

            <Text size="sm" fw={"500"}>Allegati</Text>
            <Group w={"100%"} justify="center" style={{overflow: "hidden"}}>
                {
                    images.length ?
                    images.map((a, i) => <Attachment url={a as string} i={i} key={i} onDelete={deleteAttachment}/>) :
                    <Text c={"dimmed"} fs={"italic"} fz={"xs"} ta={"center"} w={"100%"}>Nessu allegato presente</Text>
                }
            </Group>
        </Stack>
    )
}