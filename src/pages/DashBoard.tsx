import DrawerSection from "../components/DrawerSection"
import { Grid } from "@mui/material"
import { Outlet } from "react-router-dom"

const DashBoard = () => {
  return (
    <Grid container className="main-container" >
      <Grid size={2} p={3} className="drawer-section" >
        <DrawerSection />
      </Grid>
      <Grid size={10} px={2} className="content-section">
        <div className="header" ></div>
        <Outlet />
      </Grid>
    </Grid>
  )
}

export default DashBoard