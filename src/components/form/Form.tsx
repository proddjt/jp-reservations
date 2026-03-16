import { Button, Group, Stack, Stepper } from "@mantine/core";
import TypeSelection from "./TypeSelection";
import useForm from "./hooks/useForm";
import DateSelection from "./DateSelection";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PersonalInfo from "./PersonalInfo";
import Summary from "./Summary";
import Completed from "./Completed";
import useMQuery from "../../context/MediaQuery/useMQuery";
import { FaCalendarCheck, FaClipboardQuestion, FaListCheck } from "react-icons/fa6";
import { MdContactPhone } from "react-icons/md";
dayjs.extend(customParseFormat);

export default function Form(){
    const {isMobile} = useMQuery()
    const {
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
    } = useForm()
    

    return (
        <Stack justify="space-between" align="center" flex={1}>
            <Stepper
            w={isMobile ? "100%" : "75%"}
            active={active}
            onStepClick={setActive}
            styles={{
                content:{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                },
                root: {
                    flexGrow: 1
                }
            }}
            >
                <Stepper.Step
                aria-label="Seleziona tipo"
                icon={isMobile ? <FaClipboardQuestion /> : null}
                label={isMobile ? null : "Seleziona tipo"}
                description={isMobile ? null : "Seleziona il tipo di tatuaggio"}
                allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <TypeSelection convertFiles={convertFiles} images={images} deleteAttachment={deleteAttachment} updateRequest={updateRequest} request={request}/>
                </Stepper.Step>

                <Stepper.Step
                icon={isMobile ? <FaCalendarCheck /> : null}
                aria-label="Seleziona data"
                label={isMobile ? null : "Seleziona data"}
                description={isMobile ? null : "Seleziona giorno e ora in cui vorresti farlo"}
                allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <DateSelection updateRequest={updateRequest} request={request}/>
                </Stepper.Step>
                <Stepper.Step
                aria-label="Dati personali"
                icon={isMobile ? <MdContactPhone /> : null}
                label={isMobile ? null : "Dati personali"}
                description={isMobile ? null : "Inserisci i tuoi dati per essere contattato"}
                allowStepSelect={shouldAllowSelectStep(2)}
                >
                    <PersonalInfo updateRequest={updateRequest} request={request} updateNumber={updateNumber}/>
                </Stepper.Step>

                <Stepper.Step
                aria-label="Riepilogo"
                icon={isMobile ? <FaListCheck /> : null}
                label={isMobile ? null :"Riepilogo"}
                description={isMobile ? null : "Controlla la tua richiesta"}
                allowStepSelect={shouldAllowSelectStep(3)}
                >
                    <Summary request={request} images={images} updateRequest={updateRequest}/>
                </Stepper.Step>

                <Stepper.Completed>
                    <Completed code={newReq.current}/>
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                {
                active !== 4 ?
                <>
                <Button
                variant="default"
                onClick={() => handleStepChange(active - 1)}
                disabled={active === 0}
                >
                    Torna indietro
                </Button>

                <Button
                onClick={() => active === 3 ? openModal() : handleStepChange(active + 1)}
                disabled={!shouldAllowSelectStep(active + 1)}
                >
                    {active === 2 ? "Vai al riepilogo" : active === 3 ? "Conferma" : "Prossimo step"}
                </Button>
                </>
                :
                <Button
                onClick={() => {}}
                >
                    Torna alla homepage
                </Button>
                }
            </Group>
        </Stack>
    );
}