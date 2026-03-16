import { Stack, Text } from "@mantine/core"
import type { Exclusions, Request } from "../../types"
import { useEffect, useEffectEvent, useState } from "react"
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates"
import dayjs from "dayjs"
import useIsLoading from "../../context/isLoading/useIsLoading"
import { supabase } from "../../lib/supabase/useSupabase"
import { showError } from "../../lib/notifications"
import MyLoader from "../layout/MyLoader"
import { Holiday } from "open-holiday-js"
import useMQuery from "../../context/MediaQuery/useMQuery"
import DateSelectionWrapper from "./DateSelectionWrapper"

type HolidayType = {
    start: string,
}

interface Props {
    request: Request,
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void
}

export default function DateSelection({request, updateRequest}: Props) {
    const {isPending, showLoader} = useIsLoading()
    const [exclusions, setExclusions] = useState<Exclusions>({} as Exclusions)
    const [holidays, setHolidays] = useState<Map<string, HolidayType>>(new Map())

    const {isMobile} = useMQuery()

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
                const today = dayjs().toDate()
                const sixMonthsAfter = dayjs().add(6, "month").toDate()
                const holiday = new Holiday();
                const holyData = await holiday.getPublicHolidays("IT", today, sixMonthsAfter, undefined, "IT");
                const holidays = new Map(holyData.reduce((acc: [string, HolidayType][], holiday) => {
                    if (holiday.nationwide) acc.push([dayjs(holiday.startDate).format("YYYY-MM-DD"), {start: dayjs(holiday.startDate).format("YYYY-MM-DD")}])
                    if (holiday.name[0].text === "Lunedì di Pasqua") acc.push ([dayjs(holiday.startDate).subtract(1, "day").format("YYYY-MM-DD"), {start: dayjs(holiday.startDate).subtract(1, "day").format("YYYY-MM-DD")}])
                    return acc
                }, []))
                setHolidays(holidays)
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
        <Stack align="center" gap={isMobile ? 10 : 40} flex={1}>
            <Text fw={700} fz="h2" ta={"center"}>Quando vorresti effettuare il tatuaggio?</Text>
                <DateSelectionWrapper>
                    <Stack w={isMobile ? "90%" : "50%"} align="center">
                        <Text fw={700} fz="h3" ta={"center"} c={"red"}>Data</Text>
                        <DatePicker
                        value={request.date || undefined}
                        size={isMobile ? "md" : "lg"}
                        locale="it"
                        excludeDate={(date) => 
                            new Date(date).getDay() === 0 || 
                            exclusions.exclusions?.some(e => dayjs(e.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")) || 
                            !!holidays.get(dayjs(date).format("YYYY-MM-DD"))
                        }
                        onChange={(v) => updateRequest("date", dayjs(v).format("YYYY-MM-DD"))}
                        maxDate={dayjs().add(4, "months").format("YYYY-MM-DD")}
                        minDate={dayjs().add(1, "day").format("YYYY-MM-DD")}
                        />
                    </Stack>
                    <Stack w={isMobile ? "90%" : "50%"} align="center">
                        <Text fw={700} fz="h3" ta={"center"} c={"red"}>Ora</Text>
                        <TimeGrid
                        data={getTimeRange({ startTime: exclusions.min_time || '10:00', endTime: exclusions.max_time || '19:30', interval: '00:30' })}
                        simpleGridProps={{
                            type: 'container',
                            cols: { base: 1, '180px': 2, '320px': 3 },
                            spacing: 'xs',
                        }}
                        disabled={!request.date}
                        disableTime={exclusions.exclusions?.find(e => dayjs(e.date).format("YYYY-MM-DD") === dayjs(request.date).format("YYYY-MM-DD"))?.hours || []}
                        w={"100%"}
                        onChange={(v) => {
                            const hours = v?.split(":")[0]
                            const minutes = v?.split(":")[1]
                            if (!hours || !minutes) return
                            updateRequest("date", dayjs(request.date).hour(+hours).minute(+minutes).format("YYYY-MM-DD HH:mm"))
                        }}
                        value={dayjs(request.date).format("HH:mm")}
                        withSeconds={false}
                        />
                    </Stack>
                </DateSelectionWrapper>

        </Stack>
    )
}