import { Button, Group, Stack, Stepper } from "@mantine/core";
import { useState } from "react";
import TypeSelection from "./TypeSelection";
import useForm from "./hooks/useForm";
import DateSelection from "./DateSelection";

export default function Form(){
    const {
        convertFiles,
        deleteAttachment,
        updateRequest,
        request,
        images
    } = useForm()
    const [active, setActive] = useState(0);
    const [highestStepVisited, setHighestStepVisited] = useState(active);

    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > 3 || nextStep < 0;

        if (isOutOfBounds) return

        setActive(nextStep);
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
    };

    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

    return (
        <Stack justify="space-between" align="center" flex={1}>
            <Stepper w={"75%"} active={active} onStepClick={setActive}>
                <Stepper.Step
                label="Seleziona tipo"
                description="Seleziona il tipo di tatuaggio"
                allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <TypeSelection convertFiles={convertFiles} images={images} deleteAttachment={deleteAttachment} updateRequest={updateRequest} request={request}/>
                </Stepper.Step>

                <Stepper.Step
                label="Seleziona data"
                description="Seleziona giorno e ora in cui vorresti farlo"
                allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <DateSelection updateRequest={updateRequest} request={request}/>
                </Stepper.Step>
                <Stepper.Step
                label="Dati personali"
                description="Inserisci i tuoi dati per essere contattato"
                allowStepSelect={shouldAllowSelectStep(2)}
                >
                    Step 3 content: Get full access
                </Stepper.Step>

                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                <Button variant="default" onClick={() => handleStepChange(active - 1)}>
                Back
                </Button>
                <Button onClick={() => handleStepChange(active + 1)}>Next step</Button>
            </Group>
        </Stack>
    );
}