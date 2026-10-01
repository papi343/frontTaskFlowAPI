import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";

import Tasks from "../pages/tasks/Tasks";
import TaskDetails from "../pages/tasks/TaskDetails";

import Notifications from "../pages/notifications/Notifications";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* private routes */}

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetails />} />
                <Route path="/notifications" element={<Notifications />} />


                {/* default route*/}
                <Route path="/" element={<Navigate to="/Dashboard" replace />} />
                {/* 404 page*/}
                <Route path='*' element={<Navigate to=" /Dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes;