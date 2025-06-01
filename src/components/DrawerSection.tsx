import { useLocation, useNavigate } from 'react-router-dom';

import type { DrawerSectionProps } from '../utils/interface';
import { SCREENS } from '../utils/constants';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

const DrawerSection = (props: DrawerSectionProps) => {
    const { isDrawerOpen, setOpenSideBar } = props
    const navigate = useNavigate()
    const locationInfo = useLocation()
    const { pathname } = locationInfo;

    const tabList = [
        { label: "Handouts", path: SCREENS.HANDOUTS },
        { label: "Collection", path: SCREENS.COLLECTION },
        { label: "Customers", path: SCREENS.CUSTOMERS },
    ]
    const toScreens = (path: string) => {
        navigate(path)
    }
    const toggleSideBar = () => {
        setOpenSideBar(prev => !prev)
    }
    return (
        <div className='container' >
            <div className={`title section-title ${isDrawerOpen ? "" : 'closed'}`} >
                <span className='pointer' onClick={() => toScreens(SCREENS.HOME)} >Finance Manager</span>
                <UnfoldMoreOutlinedIcon className='collapse-icon' onClick={toggleSideBar} />
            </div>
            {isDrawerOpen ? <>{tabList.map(item => {
                return <div key={item.path} className={`page-label pointer ${pathname === item.path ? "active" : ""}`}
                    onClick={() => toScreens(item.path)} >
                    <span>{item.label}</span>
                </div>
            })}</> : <></>}

        </div>
    )
}

export default DrawerSection