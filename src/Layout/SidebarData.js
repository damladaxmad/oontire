import React from 'react';
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import { MdOutlineAdminPanelSettings, MdOutlineFileDownload, MdSettings, } from 'react-icons/md';
import { HiOutlineDocumentReport } from "react-icons/hi";

export const SidebarData = [
  {
    text: "Dashboard",
    icon: <DashboardIcon style={{fontSize: "20px",}} />,
    path: "/dashboard",
  },

  {
    text: "Customers",
    icon: <GroupIcon style={{fontSize: "20px", }} />,
    path: "/customers",
  },
  {
    text: "Reports",
    icon: <HiOutlineDocumentReport   style={{fontSize: "20px",}} />,
    path: "/reports",
  },
  {
    text: "Adminstration",
    icon: <MdOutlineAdminPanelSettings  style={{fontSize: "20px",}} />,
    path: "/adminstration",
  },
  {
    text: 'Zone Setup',
    path: '/zones',
    icon: <MdSettings   style={{fontSize: "20px", }} />
  },
  {
    text: 'Invoices',
    path: '/invoices',
    icon: <MdSettings    style={{fontSize: "20px", }} />
  },
  {
    text: 'Import Data',
    path: '/import',
    icon: <MdOutlineFileDownload   style={{fontSize: "20px", }} />
  }
];
