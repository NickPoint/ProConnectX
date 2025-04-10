import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import EmployerInformationForm from "../app/components/verification/employer/EmployerInformationForm.tsx";
import VerificationPage from "../app/pages/VerificationPage.tsx";
import BookServiceForm from "../app/components/BookServiceForm.tsx";
import OrderPage from "../app/pages/OrderPage.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/EmployerInformationForm">
                <EmployerInformationForm/>
            </ComponentPreview>
            <ComponentPreview path="/VerificationPage">
                <VerificationPage/>
            </ComponentPreview>
            <ComponentPreview path="/BookServiceForm">
                <BookServiceForm/>
            </ComponentPreview>
            <ComponentPreview path="/OrderPage">
                <OrderPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;