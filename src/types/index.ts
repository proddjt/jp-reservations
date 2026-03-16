import type { CountryCode } from "libphonenumber-js"

export type Phone = {
    country: CountryCode,
    nationalNumber: string
}

export type Request = {
    first_name: string | null,
    last_name: string | null,
    duration: number | null,
    attachments: string[] | null,
    date: string | null,
    phone_number: Phone,
    notes?: string | null,
    body_part: string | null,
    size: string | null
}

type ExcludedDate = {
    date: string,
    hours: string[] | null
}

export type Exclusions = {
    min_time: string | null,
    max_time: string | null,
    exclusions: ExcludedDate[]
}