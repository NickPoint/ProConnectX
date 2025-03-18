import {createAppSlice} from "../../app/createAppSlice";

interface TotalEarningsState {
    monthEarnings?: number,
    monthTarget?: number,
    yearEarnings?: number,
    yearTarget?: number,
    quarterEarnings?: number,
    quarterTarget?: number
}

const initialState: TotalEarningsState = {
    monthEarnings: undefined,
    monthTarget: undefined,
    yearEarnings: undefined,
    yearTarget: undefined,
    quarterEarnings: undefined,
    quarterTarget: undefined
}

export const totalEarningsSlice = createAppSlice({
    name: "totalEarnings",
    initialState,
    reducers: {
        increaseStep: (state) => {
            state.step += 1;
        },
        decreaseStep: (state) => {
            state.step -= 1;
        }
    },
    selectors: {
        selectStep: state => state.step,
    }
})

export const { increaseStep, decreaseStep } = serviceFormSlice.actions

export const { selectStep } = serviceFormSlice.selectors