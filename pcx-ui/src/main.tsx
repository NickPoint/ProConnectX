import './init.ts'
import React from "react"
import {createRoot} from "react-dom/client"
import {Provider} from "react-redux"
import App from "./App"
import {store} from "./app/store"
import "./index.css"
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./app/theme/theme";
import {SnackbarProvider} from "notistack";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import './i18n'

const container = document.getElementById("root")

if (container) {
    const root = createRoot(container)

    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <CssBaseline enableColorScheme/>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                        <DevSupport ComponentPreviews={ComponentPreviews}
                                    useInitialHook={useInitial}
                        >
                            <App/>
                        </DevSupport>
                    </SnackbarProvider>
                </ThemeProvider>
            </Provider>
        </React.StrictMode>,
    )
} else {
    throw new Error(
        "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
    )
}
