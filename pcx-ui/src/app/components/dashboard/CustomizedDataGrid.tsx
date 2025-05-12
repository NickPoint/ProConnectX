import {DataGrid, GridColDef, GridValidRowModel} from '@mui/x-data-grid';
import {Box} from '@mui/material';

interface CustomizedDataGridProps<T extends GridValidRowModel> {
    rows: T[];
    columns: GridColDef<T>[];
    checkboxSelection?: boolean;
    pageSizeOptions?: number[];
    disableRowSelectionOnClick?: boolean
    getRowId?: (row: T) => string
}

export default function CustomizedDataGrid<T extends GridValidRowModel>({
                                                                            rows,
                                                                            columns,
                                                                            checkboxSelection = false,
                                                                            pageSizeOptions = [10],
                                                                            disableRowSelectionOnClick = false,
                                                                            getRowId
                                                                        }: CustomizedDataGridProps<T>) {
    return (
        <Box sx={{width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection={checkboxSelection}
                getRowId={getRowId}
                disableRowSelectionOnClick={disableRowSelectionOnClick}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: {paginationModel: {pageSize: pageSizeOptions[0]}},
                }}
                pageSizeOptions={pageSizeOptions}
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
        </Box>
    );
}