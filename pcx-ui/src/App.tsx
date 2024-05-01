import * as React from "react";
import "./App.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./app/components/Layout";
import HomePage from "./app/pages/HomePage";
import ProfilePage from "./app/pages/ProfilePage";
import AdminPage from "./app/pages/AdminPage";
import UnauthorisePage from "./app/pages/UnauthorisePage";
import LoginPage from "./app/pages/LoginPage";
import RegisterPage from "./app/pages/RegisterPage";
import RequireUser from "./app/components/RequireUser";
import PostServicePageUsual from "./app/pages/PostServicePageUsual";
import ProjectsPage from "./app/pages/ProjectsPage";
import Filter from "./app/components/Filter";

const App = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout/>}>
                        <Route index element={<HomePage/>}/>

                        <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
                            <Route path='profile' element={<ProfilePage/>}/>
                        </Route>
                        <Route element={<RequireUser allowedRoles={['ROLE_ADMIN']}/>}>
                            <Route path='admin' element={<AdminPage/>}/>
                        </Route>
                        <Route path='unauthorized' element={<UnauthorisePage/>}/>
                        <Route path="projects" element={<ProjectsPage/>}/>
                    </Route>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='signup' element={<RegisterPage/>}/>
                    <Route path="postService" element={<PostServicePageUsual/>}/>
                    <Route path='filter' element={<Filter />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
