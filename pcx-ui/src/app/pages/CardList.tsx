import Grid from "@mui/material/Grid"
import {Skeleton} from "@mui/material";
import React from "react";
import ServiceCard from "../components/services/ServiceCard.tsx";

interface CardListProps<T> {
    lastListSize: number;
    isLoading: boolean;
    data: T[] | undefined;
}

const CardList = <T,>({lastListSize, isLoading, data}: CardListProps<T>) => {
    if (isLoading || !data) {
        return (
            <Grid container spacing={{xs: 6, sm: 3}}>
                {new Array(lastListSize).fill(0).map((_, index) => (
                    <Grid
                        key={index}
                        size={{
                            xs: 12,
                            md: 6,
                            lg: 3
                        }}>
                        <Skeleton variant='rectangular' height={300}/>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={{xs: 6, sm: 3}}>
            {data.map((props, index) => (
                <Grid
                    key={index}
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}>
                    {/*TODO: Here can be other cards too*/}
                    {props &&
                        <ServiceCard {...props}/>
                    }
                </Grid>
            ))}
        </Grid>
    );
}

export default CardList;