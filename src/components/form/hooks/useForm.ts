import { showError, showSuccess } from "../../../lib/notifications"
import useIsLoading from "../../../context/isLoading/useIsLoading"
import { useRef, useState } from "react"
import { getPhoneNumber, toBase64 } from "../../../utils/functions"
import type { Request } from "../../../types"
import type { PhoneNumber } from "libphonenumber-js"
import { uploadImage } from "../../../data/images"
import { supabase } from "../../../lib/supabase/useSupabase"
import { modals } from "@mantine/modals"
import dayjs from "dayjs"

export default function useForm() {
    const [images, setImages] = useState<(string | ArrayBuffer | null)[]>([])
    const [request, setRequest] = useState<Request>({phone_number: {country: "IT", nationalNumber: ""}} as Request)
    const attachments = useRef<string[]>([])
    const newReq = useRef<string>("")

    const {showLoader} = useIsLoading()

    const [active, setActive] = useState(0);
    
    const handleStepChange = (nextStep: number) => {
        if (!shouldAllowSelectStep(nextStep - 1)) return
        if (nextStep > 3 || nextStep < 0) return

        setActive(nextStep);
    };

    const shouldAllowSelectStep = (step: number) => {
        const first = !!(request.body_part && request.size && request.duration)
        const second = !!(request.date && dayjs(request.date, "YYYY-MM-DD HH:mm").isValid())
        const third = !!(request.first_name && request.last_name && request.phone_number.country && request.phone_number.nationalNumber)
        if (step === 1) return first && active !== 4
        if (step === 2) return first && second && active !== 4
        if (step === 3) return first && second && third && active !== 4
        return active !== 4
    }

    const openModal = () => modals.openConfirmModal({
        title: "Conferma richiesta",
        centered: true,
        children: "Sei sicuro di voler confermare la richiesta di appuntamento?",
        labels: {confirm: "Conferma", cancel: "Annulla"},
        onConfirm: sendRequest,
    })
    

    const convertFiles = (files: File[]) => showLoader(async () => {
        if (!files.length) return
        if (images.length >= 3) {
            showError("Non puoi caricare piu' di 3 immagini", "Errore nell'upload")
            return
        }
        try{
            const results = await Promise.all(
                files.map(async f => {
                    const base64 = await toBase64(f)
                    return base64
                })
            )
            if (results) setImages(prev => [...prev, ...results])
            showSuccess(files.length === 1 ? "Immagine caricata con successo" : "Immagini caricate con successo")
        } catch (err) {
            showError((err instanceof Error ? err.message : err as string), "Errore nell'upload delle immagini")
        }
    })

    const deleteAttachment = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

    const updateRequest = (key: keyof Request, value: Request[keyof Request]) => {
        setRequest(prev => ({...prev, [key]: value}))
        if (key === "body_part") {
            setRequest(prev => ({...prev, size: null}))
            setRequest(prev => ({...prev, date: null}))
        }
        if (key === "size"){
            if (value === "small") setRequest(prev => ({...prev, duration: 1}))
            if (value === "medium") setRequest(prev => ({...prev, duration: 2}))
            if (value === "large") setRequest(prev => ({...prev, duration: 4}))
            setRequest(prev => ({...prev, date: null}))
        }
    }

    const sendRequest = () => {
        showLoader(async () => {
            setActive(4)
            try {
                const result = await Promise.all(
                    images.map(async i => {
                        const {url, error} = await uploadImage(i as string)
                        if (error) throw error
                        return url
                    })
                )
                attachments.current = result.filter(url => url) as string[]
                const { data, error } = await supabase
                    .from('reservation_requests')
                    .insert({
                        ...request,
                        phone_number: getPhoneNumber(request.phone_number.country, request.phone_number.nationalNumber),
                        attachments: attachments.current,
                        user_id: import.meta.env.VITE_SUPABASE_USER_ID
                    })
                    .select()
                if (error) throw error.message
                if (data) console.log(data);
                newReq.current = data[0].id
            } catch (err) {
                showError((err instanceof Error ? err.message : err as string), "Errore nell'invio della richiesta")
                setActive(3)
            }
        })
    }

    const updateNumber = (key: keyof PhoneNumber, value: PhoneNumber[keyof PhoneNumber]) => {
        setRequest(prev => ({...prev, phone_number: {...prev.phone_number, [key]: value}}))
    }
    
    return {
        convertFiles,
        deleteAttachment,
        updateRequest,
        updateNumber,
        openModal,
        setActive,
        shouldAllowSelectStep,
        handleStepChange,
        request,
        images,
        active,
        newReq
    }
}