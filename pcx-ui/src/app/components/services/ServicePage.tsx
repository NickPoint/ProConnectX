import Grid, {GridProps} from "@mui/material/Grid"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    BoxProps,
    Chip,
    Container,
    Divider,
    Fab,
    Step,
    StepButton,
    StepContent,
    Stepper,
    Typography
} from "@mui/material";
import {ExpandMore, Message, Place} from "@mui/icons-material";
import {styled, useTheme} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import React, {useEffect} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {useGetServiceQuery} from "../../../features/api/pcxApi";
import background from "../../../assets/background_service.jpg";
import BookServiceForm from "../BookServiceForm.tsx";
import {hasClientRole} from "../../../features/auth/authSlice.ts";
import UserCard from "../UserCard.tsx";
import Carousel from "react-material-ui-carousel";
import Paper from "@mui/material/Paper";
import VerticallyScrollingContainer from "../VerticallyScrollingContainer.tsx";
import Rating from "../Rating.tsx";
import Reviews from "../Reviews.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const BoxMainInfo = styled(Box)<BoxProps>(({theme}) => ({
    borderRadius: theme.spacing(2),
    borderColor: theme.palette.grey["400"],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.3),
    height: '100%',
}));

type GridWithDividersProps = GridProps & {
    children: React.ReactNode;
    dividerProps?: React.ComponentProps<typeof Divider>;
};

const GridWithDividers = React.forwardRef<HTMLDivElement, GridWithDividersProps>(
    function GridWithDividers({children, dividerProps, ...gridProps}, ref) {
        const childrenArray = React.Children.toArray(children);

        return (
            <Grid ref={ref} {...gridProps}>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        <Grid size={12}>
                            {index < childrenArray.length - 1 && <Divider {...dividerProps} />}
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        );
    }
);

const ServicePage = () => {
    const theme = useTheme();
    const userHasClientRole = useAppSelector(hasClientRole);
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = React.useState(0);
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Service'));
    }, [dispatch]);

    const {data: service, isSuccess, isLoading, isFetching}
        = useGetServiceQuery({id: Number.parseInt(id)});

    if (!isSuccess || !service) {
        navigate('/404')
    }

    return (<>
        <Grid container>
            <Grid size={{xs: 12}} sx={{
                position: 'relative',
            }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop
                    style={{ width: '100%', height: '400px' }}
                >
                    {service.imagesMeta.map((meta, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={meta.path}
                                alt={`Slide ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: `linexar-gradient(to bottom, transparent 85%, #000)`,
                }}>
                </Box>
            </Grid>
            <GridWithDividers container size={12} spacing={4} component={Container} maxWidth='xl'
                              sx={{mt: -10, zIndex: 1}}>
                <Grid size={12}>
                    <Box sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        display: 'flex',
                        color: 'white'
                    }}>
                        <UserCard variant='box' {...service.freelancer} />
                        <Fab color='primary'>
                            <Message/>
                        </Fab>
                    </Box>
                </Grid>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography sx={{textTransform: 'capitalize'}} variant='h3' component='h1'>{service.title}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Rating {...service} withRatingCount/>
                    </Grid>
                    <Grid size={6} textAlign='right'>
                        <Typography variant='h4' fontWeight='700'>${service.price}</Typography>
                        <Typography variant='body2'>Basic</Typography>
                    </Grid>
                </Grid>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography variant='h4' component='h2'>Description</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='body1'>{service.description}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <VerticallyScrollingContainer>
                            {service.address &&
                                <Chip color='secondary' icon={<Place/>} variant='filled'
                                      label={`${service.address.city}, ${service.address.postalCode}`}/>
                            }
                            {
                                service.categories.map((category, index) => (
                                    <Chip key={index} color='primary' variant='outlined' label={category}/>
                                ))
                            }
                        </VerticallyScrollingContainer>
                    </Grid>
                </Grid>
                {/*TODO: add packages*/}
                {service.workflow && service.workflow.length > 0 &&
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant='h4' component='h2'>Workflow</Typography>
                        </Grid>
                        <Grid size={12} component={Paper} sx={{p: 2}}>
                            <Stepper nonLinear orientation="vertical" activeStep={activeStep}>
                                {[...service.workflow]
                                    .sort((a, b) => a.stepNumber - b.stepNumber)
                                    .map((step, index) => (
                                        <Step key={index}>
                                            <StepButton onClick={() => setActiveStep(index)}>
                                                <Typography variant="h6">{step.title}</Typography>
                                            </StepButton>
                                            {step.description &&
                                                <StepContent>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </StepContent>}
                                        </Step>
                                    ))}
                            </Stepper>
                        </Grid>
                    </Grid>
                }
                {service.faqs && service.faqs.length > 0 &&
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant='h4' component='h2'>FAQ</Typography>
                        </Grid>
                        <Grid size={12}>
                            {service.faqs.map((faq, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary expandIcon={<ExpandMore/>}>
                                        <Typography variant="h6">{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                    </Grid>
                }
                {service.reviews && service.reviews.length > 0 &&
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant='h4' component='h2'>Reviews</Typography>
                        </Grid>
                        <Reviews {...service} />
                    </Grid>
                }
            </GridWithDividers>
            {userHasClientRole &&
                <Grid size={12}>
                    <BookServiceForm {...service}/>
                </Grid>}
        </Grid>
    </>);
}

export default ServicePage;

/*| Hero Section + CTA (Book) |
|----------------------------|
| Image / Gallery Carousel |
|----------------------------|
| Service Description |
|----------------------------|
| Freelancer Card |
|----------------------------|
| Service Packages (if any) |
|----------------------------|
| Booking Form |
|----------------------------|
| Reviews |
|----------------------------|
| FAQ |
|----------------------------|
| Related Services |*/