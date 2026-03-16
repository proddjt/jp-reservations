import { Button, Stack, Title } from "@mantine/core";
import { useState } from "react";
import Form from "../form/Form";
import useMQuery from "../../context/MediaQuery/useMQuery";

export default function MainPage(){
    const [form, setForm] = useState(false);
    const {isMobile} = useMQuery()
    
    return (
        <Stack flex={1} p={isMobile ? "xs" : "md"}>
            <Title order={1}>JP Reservation</Title>
            {
                form ?
                <Form/>
                :
                <Stack flex={1} justify="center" align="center">
                    <Title order={2} ta={"center"}>Richiedi un appuntamento presso lo studio JP Tattoo</Title>
                    <Button variant="outline" color="red" onClick={() => setForm(true)}>Richiedi appuntamento</Button>
                </Stack>
            }
        </Stack>
    )
}