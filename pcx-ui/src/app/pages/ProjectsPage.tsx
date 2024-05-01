import {useAppDispatch, useAppSelector} from "../hooks";
import Grid from "@mui/material/Unstable_Grid2";
import ProjectCard from "../components/ProjectCard";
import Filter from "../components/Filter";
import {Box, Skeleton} from "@mui/material";
import {selectData, selectLastSize, selectLoading} from "../../features/projectFilter/projectFilterSlice";

const ProjectsPage = () => {
    const data = useAppSelector(selectData);
    const loading = useAppSelector(selectLoading);
    const lastSize = useAppSelector(selectLastSize);

    return (
        <Grid container rowSpacing={5} sx={{mt: 3}}>
            <Grid xs={12}>
                <Filter/>
            </Grid>
            <Grid xs={12}>
                <Grid container justifyContent='center' gap={2}>
                    {data.map(project => (
                        new Array(3).fill(0).map((_, index) => (
                            <Grid xs={12} md={6}>
                                <ProjectCard key={project.id} {...project}/>
                            </Grid>
                    ))))
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ProjectsPage;