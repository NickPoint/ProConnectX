import {Category} from "../api/pcxApi";
import {createAppSlice} from "../../app/createAppSlice";

interface ServiceFormState {
    step: number,
    title: string,
    description: string,
    category: Category | null,
    budget: number | null
    location: string,
    image: string
}

const initialState: ServiceFormState = {
    step: 1,
    title: "",
    description: "",
    category: null,
    budget: null,
    location: "",
    image: ""
}

export const serviceFormSlice = createAppSlice({
    name: "serviceForm",
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