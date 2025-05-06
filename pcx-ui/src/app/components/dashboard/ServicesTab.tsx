import {Grid, Pagination} from "@mui/material";
import {useGetUserServicesQuery} from "../../../features/api/pcxApi.ts";
import {useState} from "react";
import ServiceCard from "../services/ServiceCard.tsx";

const ServicesTab = () => {
    const [page, setPage] = useState(0);
    const {data} = useGetUserServicesQuery({page: page, size: 12, sort: ['id','desc']});

    return (
        <>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{mb: (theme) => theme.spacing(2)}}
            >
                {data?.content.map((service, index) => (
                    <Grid key={index} size={{xs: 12, sm: 6, lg: 3}}>
                        <ServiceCard publicVariant={false} {...service} />
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={data?.totalPages || 0}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
            />
        </>
    );
}

export default ServicesTab;