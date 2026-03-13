import { MantineProvider, type MantineTheme, type TooltipProps } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { mantineTheme } from "../../utils/theme";
import 'dayjs/locale/it';
import { MediaQueryProvider } from "../../context/MediaQuery/MediaQueryProvider";
import { IsLoadingProvider } from "../../context/isLoading/isLoadingProvider";

const theme = {
    ...mantineTheme,
    components: {
        Tooltip: {
            defaultProps: {
                events: {
                    hover: true,
                    touch: true
                }
            } as TooltipProps
        }
    }
} as MantineTheme

export default function Providers({ children }: { children: React.ReactNode }) {

    return (
        <MantineProvider
        theme={theme}
        forceColorScheme="dark"
        >
            <MediaQueryProvider>
            <IsLoadingProvider>
                <Notifications
                autoClose={5000}
                position="bottom-center"
                />
                <ModalsProvider
                modalProps={{
                    centered: true,
                    styles:{
                        title: {
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "#e03131"
                        }
                    }
                }}
                >
                    {children}
                </ModalsProvider>
            </IsLoadingProvider>
            </MediaQueryProvider>
        </MantineProvider>
    )
}