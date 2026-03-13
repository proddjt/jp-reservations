import { showError, showSuccess } from "../../../lib/notifications"
import useIsLoading from "../../../context/isLoading/useIsLoading"
import { useState } from "react"
import { toBase64 } from "../../../utils/functions"
import type { Request } from "../../../types"

export default function useForm() {
    const [images, setImages] = useState<(string | ArrayBuffer | null)[]>([])
    const [request, setRequest] = useState<Request>({} as Request)

    const {showLoader} = useIsLoading()

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

    const updateRequest = (key: keyof Request, value: Request[keyof Request]) => setRequest(prev => ({...prev, [key]: value}))
    
    return {
        convertFiles,
        deleteAttachment,
        updateRequest,
        request,
        images
    }
}