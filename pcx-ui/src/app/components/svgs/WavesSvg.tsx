import {useTheme} from '@mui/material/styles';

export const FooterWave = ({style}: {style: React.CSSProperties}) => {
    const theme = useTheme();

    return (
        <svg
            viewBox="0 0 960 540"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{...style}}
        >
            <rect x="0" y="0" width="960" height="540" fill={theme.palette.secondary.main}></rect>
            <path
                d="M0 86L22.8 83.5C45.7 81 91.3 76 137 76.7C182.7 77.3 228.3 83.7 274 93.5C319.7 103.3 365.3 116.7 411.2 129.8C457 143 503 156 548.8 148.8C594.7 141.7 640.3 114.3 686 119.7C731.7 125 777.3 163 823 160.8C868.7 158.7 914.3 116.3 937.2 95.2L960 74L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z"
                fill={theme.palette.background.default} strokeLinecap="round" strokeLinejoin="miter"></path>
        </svg>
    );
};

export const HeroWave = ({style}: { style: React.CSSProperties }) => {
    const theme = useTheme();

    return (
        <svg
            viewBox="0 0 960 540"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{...style}}
        >
            <rect
                x="0"
                y="0"
                width="960"
                height="540"
                fill={theme.palette.primary.main}
            />
            <path
                d="M0 468L22.8 457.2C45.7 446.3 91.3 424.7 137 412.3C182.7 400 228.3 397 274 388.8C319.7 380.7 365.3 367.3 411.2 375.7C457 384 503 414 548.8 416.3C594.7 418.7 640.3 393.3 686 389.5C731.7 385.7 777.3 403.3 823 409.8C868.7 416.3 914.3 411.7 937.2 409.3L960 407L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z"
                fill={theme.palette.background.default} strokeLinecap="round" strokeLinejoin="miter"
            />
        </svg>
    );
};
