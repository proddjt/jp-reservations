import { notifications } from "@mantine/notifications"

export const showSuccess = (msg: string, title?: string) => {
    notifications.show({title: title || "Successo", message: msg, color: "green", withBorder: true, withCloseButton: true})
}

export const showWarning = (msg: string, title?: string) => {
    notifications.show({title: title || "Attenzione", message: msg, color: "yellow", withBorder: true, withCloseButton: true})
}

export const showError = (msg: string, title?: string) => {
    notifications.show({title: title || "Errore", message: msg, color: "red", withBorder: true, withCloseButton: true})
}