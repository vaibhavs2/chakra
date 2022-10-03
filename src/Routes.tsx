import { BrowserRouter, Route, Routes as ReactRouterRoutes } from "react-router-dom";
import { CustomForm } from "./components/CustomForm";
import { FormList } from "./components/FormList";


export  const Routes = ()=>{
    return (<BrowserRouter>
    <ReactRouterRoutes>
    <Route path="/" element={<FormList/>} />
    <Route path="/:formId" element={<CustomForm/>} />
    </ReactRouterRoutes>
    </BrowserRouter>)
}