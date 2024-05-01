import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import Header from "../features/header/Header";
import PostServicePage from "../app/pages/PostServicePage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Header">
                <Header/>
            </ComponentPreview>
            <ComponentPreview path="/PostServicePage">
                <PostServicePage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;