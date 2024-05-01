import {createAppSlice} from "../../app/createAppSlice";
import {Category, Project, ProjectFilter, ProjectFilterResponse} from "../api/pcxApi";
import {toast} from "react-toastify";
import loading = toast.loading;

interface ProjectFilterSliceState {
    data: ProjectFilterResponse[];
    loading: boolean;
    lastSize: number;
}

const initialState: ProjectFilterSliceState = {
    data: [],
    loading: true,
    lastSize: 1,
}

export const projectFilterSlice = createAppSlice({
    name: 'projectFilter',
    initialState,
    reducers: {
        resetProjectFilter: (state) => {
            state.data = [];
            state.loading = true;
            state.lastSize = 1;
        },
        setData: (state, action) => {
            state.lastSize = state.data.length;
            state.data = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    selectors: {
        selectData: state => state.data,
        selectLoading: state => state.loading,
        selectLastSize: state => state.lastSize,
    }
});

export const {setData, resetProjectFilter, setLoading} = projectFilterSlice.actions;

export const {selectData, selectLoading, selectLastSize} = projectFilterSlice.selectors;