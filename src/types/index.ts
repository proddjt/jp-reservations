export type Request = {
    first_name: string | null,
    last_name: string | null,
    duration: number | null,
    attachments: string[] | null,
    date: string | null,
    phone_number: string | null,
    notes?: string | null,
    body_part: string | null,
    has_colors: boolean | null,
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