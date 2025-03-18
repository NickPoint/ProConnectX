import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import EmployerInformationForm from "../app/components/verification/employer/EmployerInformationForm.tsx";
import VerificationPage from "../app/pages/VerificationPage.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/EmployerInformationForm">
                <EmployerInformationForm/>
            </ComponentPreview>
            <ComponentPreview path="/VerificationPage">
                <VerificationPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;