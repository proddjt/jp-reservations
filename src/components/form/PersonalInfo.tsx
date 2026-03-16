import { Group, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core"
import type { Request } from "../../types"
import ReactCountryFlag from "react-country-flag";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, PhoneNumber, type CountryCode, type NationalNumber } from "libphonenumber-js";
import useMQuery from "../../context/MediaQuery/useMQuery";

interface Props {
    request: Request,
    updateRequest: (key: keyof Request, value: Request[keyof Request]) => void,
    updateNumber: (key: keyof PhoneNumber, value: PhoneNumber[keyof PhoneNumber]) => void
}

export default function PersonalInfo({request, updateRequest, updateNumber}: Props){
    const {isMobile} = useMQuery()
    return (
        <Stack align="center" gap={isMobile ? 10 : 40} flex={1}>
            <Text fw={700} fz="h2" ta={"center"}>Come possiamo contattarti?</Text>
            <Stack flex={1} gap={30} justify={isMobile ? "start" : "center"} align="center" w={isMobile ? "90%" : "25%"}>
                <TextInput
                label="Nome"
                description="Inserisci il tuo nome"
                placeholder="Es. Mario"
                value={request.first_name || undefined}
                size="md"
                withAsterisk
                w={"100%"}
                onChange={(e) => updateRequest("first_name", e.target.value)}
                />
                <TextInput
                label="Cognome"
                description="Inserisci il tuo cognome"
                placeholder="Es. Rossi"
                value={request.last_name || undefined}
                size="md"
                withAsterisk
                w={"100%"}
                onChange={(e) => updateRequest("last_name", e.target.value)}
                />

                <Stack gap={0} align="start" w={"100%"}>
                    <Text size="md" fw={500}>Numero di telefono</Text>
                    <Text size="sm" c={"dimmed"}>Inserisci il tuo numero di telefono</Text>

                    <Group w={"100%"} gap={0} align="start">
                        <Select
                        w={"25%"}
                        leftSection={
                            <Group gap={5} justify="end">
                                <ReactCountryFlag countryCode={request.phone_number.country || "IT"} svg/>
                                <Text size="sm">+</Text>
                            </Group>
                        }
                        size="md"
                        data={getCountries().map(c => ({value: c, label: getCountryCallingCode(c)}))}
                        rightSection={null}
                        value={request.phone_number.country}
                        searchable
                        placeholder="00"
                        limit={50}
                        renderOption={(v) =>
                            <Group gap={3}>
                                <ReactCountryFlag countryCode={v.option.value || "IT"} svg/> <Text size="xs">+ {v.option.label}</Text>
                            </Group>
                        }
                        onChange={(v) => updateNumber("country", v as CountryCode)}
                        />
                        <NumberInput
                        size="md"
                        allowDecimal={false}
                        allowNegative={false}
                        allowLeadingZeros={false}
                        hideControls
                        placeholder="1234567890"
                        value={request.phone_number.nationalNumber || undefined}
                        w={"75%"}
                        onChange={(v) => updateNumber("nationalNumber", v.toString() as NationalNumber)}
                        error={request.phone_number.nationalNumber &&
                            !isValidPhoneNumber(request.phone_number.nationalNumber, request.phone_number.country as CountryCode) &&
                            "Attenzione! Inserire un numero di telefono valido"
                        }
                        />
                    </Group>
                </Stack>
            </Stack>
        </Stack>
    )
}