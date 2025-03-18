import * as React from "react";
import "./App.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./app/components/layouts/Layout";
import HomePage from "./app/pages/HomePage";
import UnauthorizedPage from "./app/pages/UnauthorizedPage";
import LoginPage from "./app/pages/LoginPage";
import SignupPage from "./app/pages/SignupPage.tsx";
import RequireUser from "./app/components/RequireUser";
import {useAuthorizeQuery} from "./features/api/authApi";
import FilterPage from "./app/pages/FilterPage";
import {FilterType} from "./features/enums";
import PostServicePage from "./app/components/services/PostServicePage";
import PostProjectPage from "./app/components/projects/PostProjectPage";
import ProjectPage from "./app/components/projects/ProjectPage";
import Layout2 from "./app/components/layouts/Layout2";
import ApplyForProjectPage from "./app/components/projects/ApplyForProjectPage";
import Layout3 from "./app/components/layouts/Layout3";
import ServicePage from "./app/components/services/ServicePage";
import BidPage from "./app/components/bids/BidPage";
import VerificationPage from "./app/pages/VerificationPage.tsx";
import TestPage from "./app/pages/TestPage.tsx";

const App = () => {

    useAuthorizeQuery(null);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path='projects' element={<FilterPage type={FilterType.PROJETCS}/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
                            <Route path='projects/add' element={<PostProjectPage/>}/>
                        </Route>
                        <Route path='test' element={<TestPage/>}/>
                        <Route path='verification' element={<VerificationPage/>}/>
                        <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>
                        <Route path='services' element={<FilterPage type={FilterType.SERVICES}/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
                            <Route path='services/add' element={<PostServicePage/>}/>
                        </Route>
                        <Route path='unauthorized' element={<UnauthorizedPage/>}/>
                    </Route>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='signup' element={<SignupPage/>}/>
                    <Route path='/' element={<Layout2/>}>
                        <Route path='project/:id' element={<ProjectPage/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
                            <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>
                        </Route>
                        <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
                            <Route path='project/:id/amend' element={<ApplyForProjectPage/>}/>
                            <Route path='project/:id/bids' element={<FilterPage type={FilterType.BIDS}/>}/>
                        </Route>
                        <Route path='project/:projectId/bids/:id' element={<BidPage/>}/>
                    </Route>
                    <Route path='/' element={<Layout3/>}>
                            <Route path='service/:id' element={<ServicePage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
