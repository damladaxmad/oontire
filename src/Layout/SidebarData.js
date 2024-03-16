import React from 'react';
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import { MdOutlineAdminPanelSettings, MdOutlineFileDownload, MdSettings, } from 'react-icons/md';
import { HiOutlineDocumentReport, HiOutlineNewspaper } from "react-icons/hi";
import { BiMessageDetail } from 'react-icons/bi';

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
    text: 'Invoices',
    path: '/invoices',
    icon: <HiOutlineNewspaper    style={{fontSize: "20px", }} />
  },
  {
    text: 'Zone Setup',
    path: '/zones',
    icon: <MdSettings   style={{fontSize: "20px", }} />
  },
  {
    text: 'Send SMS',
    path: '/sms',
    icon: <BiMessageDetail   style={{fontSize: "20px", }} />
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
    text: 'Import Data',
    path: '/import',
    icon: <MdOutlineFileDownload   style={{fontSize: "20px", }} />
  }
];
