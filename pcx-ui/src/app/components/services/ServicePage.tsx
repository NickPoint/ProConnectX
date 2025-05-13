import Grid, {GridProps} from "@mui/material/Grid"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Container,
    Divider,
    Fab,
    GlobalStyles,
    Step,
    StepButton,
    StepContent,
    Stepper,
    Typography,
} from "@mui/material"
import {ExpandMore, LocationOn, Message, Place} from "@mui/icons-material"
import {useNavigate, useParams} from "react-router-dom"
import {useAppDispatch} from "../../hooks"
import React, {useEffect} from "react"
import {setPageTitle} from "../../../features/header/headerSlice"
import {ProfileType, useGetCurrentUserQuery, useGetServiceQuery,} from "../../../features/api/pcxApi"
import BookServiceForm from "../BookServiceForm.tsx"
import UserCard from "../UserCard.tsx"
import Paper from "@mui/material/Paper"
import VerticallyScrollingContainer from "../VerticallyScrollingContainer.tsx"
import Rating from "../Rating.tsx"
import ServiceReviews from "../ServiceReviews.tsx"
import {Swiper, SwiperSlide} from "swiper/react"
import {Autoplay, Navigation, Pagination} from "swiper/modules"
import {useTranslation} from "react-i18next"
import {GlobalLoadingBackdrop} from "../GlobalLoadingBackdrop.tsx"
import DOMPurify from "dompurify"
import "swiper/css"
import "swiper/css/pagination"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material/styles"
import { getAddressAsString } from "./ServiceCard.tsx"

type GridWithDividersProps = GridProps & {
    children: React.ReactNode
    dividerProps?: React.ComponentProps<typeof Divider>
}

const GridWithDividers = React.forwardRef<
    HTMLDivElement,
    GridWithDividersProps
>(function GridWithDividers({children, dividerProps, ...gridProps}, ref) {
    const childrenArray = React.Children.toArray(children)

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
    )
})

const DesktopServicePage = ({user, service}) => {
    const [activeStep, setActiveStep] = React.useState(0)
    const {t} = useTranslation()

    return (
        <Grid container spacing={8} alignItems="flex-start">
            <Grid size={7}>
                <Grid
                    component={Paper}
                    size={12}
                    sx={{position: "relative", overflow: "hidden"}}
                >
                    <GlobalStyles
                        styles={{
                            ".swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic":
                                {
                                    bottom: "110px",
                                },
                        }}
                    />
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{delay: 3500}}
                        loop
                        style={{
                            aspectRatio: "16 / 9",
                        }}
                    >
                        {service.galleryUrls.map((url, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={url}
                                    alt={`Slide ${index}`}
                                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                            pointerEvents: "none",
                            background: `linear-gradient(to bottom, transparent 75%, #000)`,
                        }}
                    ></Box>
                </Grid>
                <GridWithDividers
                    container
                    size={12}
                    spacing={4}
                    sx={{mt: -10, position: "relative", zIndex: 1}}
                >
                    <Grid size={12}>
                        <Box
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                display: "flex",
                                color: "white",
                                px: 1,
                            }}
                        >
                            <UserCard variant="box" {...service.freelancer} />
                            <Fab color="primary">
                                <Message/>
                            </Fab>
                        </Box>
                    </Grid>
                    <Grid container size={12} spacing={2} alignItems="center">
                        <Grid size={6}>
                            <Typography
                                sx={{textTransform: "capitalize"}}
                                variant="h3"
                                component="h1"
                            >
                                {service.title}
                            </Typography>
                            <Rating {...service} withRatingCount/>
                        </Grid>
                        <Grid size={6} textAlign="right">
                            <Typography variant="h4" fontWeight="700">
                                ${service.price}
                            </Typography>
                            <Typography variant="body2">
                                {t("service.package.basic")}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h4" component="h2">
                                {t("service.page.reviews")}
                            </Typography>
                        </Grid>
                        <ServiceReviews service={service}/>
                    </Grid>
                </GridWithDividers>
            </Grid>
            <GridWithDividers container size={5} spacing={4}>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h4" component="h2">
                            {t("service.page.description")}
                        </Typography>
                    </Grid>
                    <Grid
                        size={12}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(service.description),
                        }}
                    />
                    <Grid size={12}>
                        <VerticallyScrollingContainer>
                            <Chip icon={<LocationOn/>} color='secondary' label={getAddressAsString(service.address)}/>
                            {service.categories.map((category, index) => (
                                <Chip
                                    key={index}
                                    color="primary"
                                    variant="outlined"
                                    label={t(`enum.categories.${category}`)}
                                />
                            ))}
                        </VerticallyScrollingContainer>
                    </Grid>
                </Grid>
                {/*TODO: add packages*/}
                {service.workflow && service.workflow.length > 0 && (
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h4" component="h2">
                                {t("service.page.workflow")}
                            </Typography>
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
                                            {step.description && (
                                                <StepContent>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </StepContent>
                                            )}
                                        </Step>
                                    ))}
                            </Stepper>
                        </Grid>
                    </Grid>
                )}
                {service.faqs && service.faqs.length > 0 && (
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h4" component="h2">
                                {t("service.page.faq")}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            {service.faqs.map((faq, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary expandIcon={<ExpandMore/>}>
                                        <Typography variant="h6">{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                    </Grid>
                )}
            </GridWithDividers>
            {(!user || user.activeProfile.profileType === ProfileType.Client) && (
                <Grid size={12}>
                    <BookServiceForm service={service}/>
                </Grid>
            )}
        </Grid>
    )
}

const MobileServicePage = ({user, service}) => {
    const [activeStep, setActiveStep] = React.useState(0)
    const {t} = useTranslation()

    return (
        <Grid container>
            <Grid size={12} sx={{position: "relative", overflow: "hidden"}}>
                <GlobalStyles
                    styles={{
                        ".swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic":
                            {
                                bottom: "110px",
                            },
                    }}
                />
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{delay: 3500}}
                    loop
                    style={{
                        aspectRatio: "1 / 1",
                    }}
                >
                    {service.galleryUrls.map((url, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                style={{width: "100%", height: "100%", objectFit: "cover"}}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        pointerEvents: "none",
                        background: `linear-gradient(to bottom, transparent 75%, #000)`,
                    }}
                ></Box>
            </Grid>
            <GridWithDividers
                container
                size={12}
                spacing={4}
                component={Container}
                maxWidth="xl"
                sx={{mt: -10, zIndex: 1}}
            >
                <Grid size={12}>
                    <Box
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            display: "flex",
                            color: "white",
                        }}
                    >
                        <UserCard variant="box" {...service.freelancer} />
                        <Fab color="primary">
                            <Message/>
                        </Fab>
                    </Box>
                </Grid>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography
                            sx={{textTransform: "capitalize"}}
                            variant="h3"
                            component="h1"
                        >
                            {service.title}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Rating {...service} withRatingCount/>
                    </Grid>
                    <Grid size={6} textAlign="right">
                        <Typography variant="h4" fontWeight="700">
                            ${service.price}
                        </Typography>
                        <Typography variant="body2">
                            {t("service.package.basic")}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h4" component="h2">
                            {t("service.page.description")}
                        </Typography>
                    </Grid>
                    <Grid
                        size={12}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(service.description),
                        }}
                    />
                    <Grid size={12}>
                        <VerticallyScrollingContainer>
                            <Chip icon={<LocationOn/>} color='secondary' label={getAddressAsString(service.address)}/>
                            {service.categories.map((category, index) => (
                                <Chip
                                    key={index}
                                    color="primary"
                                    variant="outlined"
                                    label={t(`enum.categories.${category}`)}
                                />
                            ))}
                        </VerticallyScrollingContainer>
                    </Grid>
                </Grid>
                {/*TODO: add packages*/}
                {service.workflow && service.workflow.length > 0 && (
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h4" component="h2">
                                {t("service.page.workflow")}
                            </Typography>
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
                                            {step.description && (
                                                <StepContent>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </StepContent>
                                            )}
                                        </Step>
                                    ))}
                            </Stepper>
                        </Grid>
                    </Grid>
                )}
                {service.faqs && service.faqs.length > 0 && (
                    <Grid container size={12} spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h4" component="h2">
                                {t("service.page.faq")}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            {service.faqs.map((faq, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary expandIcon={<ExpandMore/>}>
                                        <Typography variant="h6">{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                    </Grid>
                )}
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h4" component="h2">
                            {t("service.page.reviews")}
                        </Typography>
                    </Grid>
                    <ServiceReviews service={service}/>
                </Grid>
            </GridWithDividers>
            {(!user || user.activeProfile.profileType === ProfileType.Client) && (
                <Grid size={12}>
                    <BookServiceForm service={service}/>
                </Grid>
            )}
        </Grid>
    )
}

const ServicePage = () => {
    const dispatch = useAppDispatch()
    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    if (!id) {
        navigate("/404");
        return;
    }

    useEffect(() => {
        dispatch(setPageTitle(t("service.page.title")))
    }, [dispatch]);

    const {data: user} = useGetCurrentUserQuery()
    const {
        data: service,
        isLoading,
        isFetching,
    } = useGetServiceQuery({id: Number.parseInt(id)});

    if (isLoading || isFetching) {
        return <GlobalLoadingBackdrop/>;
    }

    if (!service) {
        navigate("/404");
        return;
    }

    if (isMobile) {
        return <MobileServicePage user={user} service={service}/>;
    } else {
        return <DesktopServicePage user={user} service={service}/>;
    }
}

export default ServicePage

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