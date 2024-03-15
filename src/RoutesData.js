import { Route } from "react-router-dom";
  import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Reports from "./Pages/Reports"
import Adminstration from "./Pages/Adminstration"
import Import from "./Pages/Import";
import ZoneSetup from "./Pages/ZoneSetup";
import Invoices from "./Pages/Invoices";

export const pages = [
        <Route path="/dashboard" element={<Dashboard />} />,
        <Route path="/customers" element={<Customers />} />,
        <Route path="/reports" element={<Reports />} />,
        <Route path="/adminstration" element={<Adminstration />} />,
        <Route path="/zones" element={<ZoneSetup />} />,
        <Route path="/invoices" element={<Invoices />} />,
        <Route path="/import" element={<Import />} />,
]