import {useAppSelector} from "../hooks";
import Grid from "@mui/material/Grid"
import ProjectCard from "../components/projects/ProjectCard";
import ProjectsFilter from "../components/projects/ProjectsFilter";
import {Skeleton} from "@mui/material";
import {selectData, selectLastDataSize, selectLoading} from "../../features/filter/filterSlice";
import {FilterType} from "../../features/enums";
import ServiceCard from "../components/services/ServiceCard";
import {FC} from "react";
import ServicesFilter from "../components/services/ServicesFilter";
import FreelancersFilter from "../components/freelancers/FreelancersFilter";
import FreelancerCard from "../components/freelancers/FreelancerCard";
import BidsFilter from "../components/bids/BidsFilter";
import BidCard from "../components/bids/BidCard";

interface FilterPageProps {
    type: FilterType;
}

const FilterPage: FC<FilterPageProps> = ({type}) => {
    const data = useAppSelector(selectData);
    const loading = useAppSelector(selectLoading);
    const lastDataSize = useAppSelector(selectLastDataSize);

    return (
        (<Grid container rowSpacing={5}>
            <Grid size={12}>
                {type === FilterType.PROJETCS ? <ProjectsFilter/>
                    : type === FilterType.SERVICES ? <ServicesFilter/>
                    : type === FilterType.FREELANCERS ? <FreelancersFilter/>
                    : type === FilterType.BIDS ? <BidsFilter/> : null
                }
            </Grid>
            <Grid size={12}>
                <Grid container spacing={{xs: 6, sm: 3}}>
                    {loading ? new Array(lastDataSize).fill(0).map((_, index) => (
                        <Grid
                            key={index}
                            size={{
                                xs: 12,
                                md: 6,
                                lg: 3
                            }}>
                            <Skeleton variant='rectangular' height={300}/>
                        </Grid>
                    )) : data.map(element => (
                        new Array(12).fill(0).map((_, index) => (
                            <Grid
                                key={index}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                    lg: 3
                                }}>
                                {type === FilterType.PROJETCS ? <ProjectCard {...element}/>
                                    : type === FilterType.SERVICES ? <ServiceCard {...element}/>
                                    : type === FilterType.FREELANCERS ? <FreelancerCard {...element}/>
                                    : type === FilterType.BIDS ? <BidCard {...element}/> : null
                                }
                            </Grid>
                        ))))
                    }
                </Grid>
            </Grid>
        </Grid>)
    );
}

export default FilterPage;