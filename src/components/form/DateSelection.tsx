import { Group, Stack, Text } from "@mantine/core"
import type { Exclusions, Request } from "../../types"
import { useEffect, useEffectEvent, useState } from "react"
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates"
import dayjs from "dayjs"
import useIsLoading from "../../context/isLoading/useIsLoading"
import { supabase } from "../../lib/supabase/useSupabase"
import { showError } from "../../lib/notifications"
import MyLoader from "../layout/MyLoader"

interface Props {
    request: Request,
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void
}

export default function DateSelection({request, updateRequest}: Props) {
    const {isPending, showLoader} = useIsLoading()
    const [exclusions, setExclusions] = useState<Exclusions>({} as Exclusions)

    const initData = useEffectEvent(() => {
        showLoader(async () => {
            try{
                const {data, error} = await supabase
                .rpc("get_exclusions", {
                    p_user_id: import.meta.env.VITE_SUPABASE_USER_ID,
                    p_duration: request.duration || 1
                })
                if (error) throw error
                if (data) setExclusions(data)
            } catch (err) {
                showError((err instanceof Error ? err.message : err as string), "Errore nel caricamento dei dati")
            }
        })
    })

    useEffect(() => {
        initData()
    }, [])

    if (isPending) return <MyLoader/>

    return (
        <Stack align="center" gap={40}>
            <Text fw={700} fz="h2" ta={"center"}>Quando vorresti effettuare il tatuaggio?</Text>

            <Group flex={1} justify="center" gap={0} align="start" w={"100%"}>
                <Stack w={"50%"} align="center">
                    <Text fw={700} fz="h3" ta={"center"} c={"red"}>Data</Text>
                    <DatePicker
                    value={request.date || undefined}
                    size="lg"
                    locale="it"
                    excludeDate={(date) => 
                        new Date(date).getDay() === 0 || 
                        exclusions.exclusions?.some(e => dayjs(e.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD"))
                    }
                    onChange={(v) => updateRequest("date", dayjs(v).format("YYYY-MM-DD"))}
                    maxDate={dayjs().add(4, "months").format("YYYY-MM-DD")}
                    minDate={dayjs().add(1, "day").format("YYYY-MM-DD")}
                    />
                </Stack>
                <Stack w={"50%"} align="center">
                    <Text fw={700} fz="h3" ta={"center"} c={"red"}>Ora</Text>
                    <TimeGrid
                    data={getTimeRange({ startTime: exclusions.min_time || '10:00', endTime: exclusions.max_time || '19:30', interval: '00:30' })}
                    simpleGridProps={{
                        type: 'container',
                        cols: { base: 1, '180px': 2, '320px': 3 },
                        spacing: 'xs',
                    }}
                    disableTime={exclusions.exclusions?.find(e => dayjs(e.date).format("YYYY-MM-DD") === dayjs(request.date).format("YYYY-MM-DD"))?.hours || []}
                    w={"100%"}
                    withSeconds={false}
                    />
                </Stack>
            </Group>

        </Stack>
    )
}