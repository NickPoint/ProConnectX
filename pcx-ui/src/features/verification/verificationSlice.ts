import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DocumentType} from "../api/pcxApi.ts";

interface EmployerVerificationState {
    activeStep: number;
    file: File | null;
    fileType: DocumentType | null;
    profilePicture: File | null;
}

const initialState: EmployerVerificationState = {
    activeStep: 0,
    file: null,
    fileType: null,
    profilePicture: null,
}

export const employerVerificationSlice = createSlice({
    name: "employerVerification",
    initialState,
    reducers: {
        nextStep: (state) => {
            state.activeStep += 1;
        },
        prevStep: (state) => {
            state.activeStep -= 1;
        },
        setFile: (state, action: PayloadAction<File | null>) => {
            state.file = action.payload;
        },
        setDocumentType: (state, action: PayloadAction<DocumentType | null>) => {
            state.fileType = action.payload;
        }
    },
    selectors: {
        selectActiveStep: (state) => state.activeStep,
        selectFile: (state) => state.file,
        selectDocumentType: (state) => state.fileType,
    }
});

export const { nextStep, prevStep, setFile, setDocumentType } = employerVerificationSlice.actions

export const { selectActiveStep, selectFile, selectDocumentType } = employerVerificationSlice.selectors