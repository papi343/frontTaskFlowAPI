import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

import Dashboard from "../pages/dashboard/dashboard";

import Projects from "../pages/projects/projects";
import ProjectDetails from "../pages/projects/projectDetails";

import Tasks from "../pages/tasks/tasks";
import TaskDetails from "../pages/tasks/taskDetails";

import Notifications from "../pages/notifications/notifications";
import ProtectedRoutes from "./ProtectedRoutes";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* private routes */}
                {/* <Route element={<ProtectedRoutes />}> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetails />} />
                <Route path="/notifications" element={<Notifications />} />
                {/* </Route> */}


                {/* default route*/}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* 404 page*/}
                <Route path='*' element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes;