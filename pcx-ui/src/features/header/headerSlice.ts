import {createAppSlice} from "../../app/createAppSlice";

export interface HeaderSliceState {
    pageTitle: string;
}

const initialState: HeaderSliceState = {
    pageTitle: '',
}

export const headerSlice = createAppSlice({
    name: "header",
    initialState,
    reducers: {
        setPageTitle: (state, action) => {
            state.pageTitle = action.payload;
        }
    },
    selectors: {
        selectPageTitle: state => state.pageTitle,
    },
});

export const {setPageTitle} = headerSlice.actions;
export const {selectPageTitle} = headerSlice.selectors;