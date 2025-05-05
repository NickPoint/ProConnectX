import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Box} from '@mui/material';

interface CustomizedDataGridProps<T> {
    rows: T[];
    columns: GridColDef<T>[];
    checkboxSelection?: boolean;
    pageSizeOptions?: number[];
    disableRowSelectionOnClick?: boolean;
}

export default function CustomizedDataGrid<T>({
                                                  rows,
                                                  columns,
                                                  checkboxSelection = false,
                                                  pageSizeOptions = [10],
                                                  disableRowSelectionOnClick = false
                                              }: CustomizedDataGridProps<T>) {
    return (
        <Box sx={{width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection={checkboxSelection}
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