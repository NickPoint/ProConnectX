import {createAppSlice} from "../../app/createAppSlice";
import {BidCardDto, FreelancerFilterResponse, ProjectFilterResponse, ServiceFilterResponse} from "../api/pcxApi";

interface FilterSlice {
    data: ServiceFilterResponse[] | ProjectFilterResponse[] | FreelancerFilterResponse[]
        | BidCardDto[];
    loading: boolean;
    lastDataSize: number;
}

const initialState: FilterSlice = {
    data: [],
    loading: true,
    lastDataSize: 12,
}

export const filterSlice = createAppSlice({
    name: 'filter',
    initialState,
    reducers: {
        resetFilter: (state) => {
            state.data = [];
            state.loading = true;
        },
        setData: (state, action) => {
            state.lastDataSize = action.payload.length;
            state.data = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    selectors: {
        selectData: state => state.data,
        selectLoading: state => state.loading,
        selectLastDataSize: state => state.lastDataSize,
        selectWithId: (state, id: number)=> {
            return state.data.find((entity) => entity.id === id);
        }
    }
});

export const {setData, resetFilter, setLoading} = filterSlice.actions;

export const {selectData, selectLoading, selectLastDataSize, selectWithId} = filterSlice.selectors;