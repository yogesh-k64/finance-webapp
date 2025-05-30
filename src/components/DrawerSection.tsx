import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

const DrawerSection = () => {
    return (
        <div className='container' >
            <div className='title section-title' >
                <span>Finance Manager</span>
                <UnfoldMoreOutlinedIcon className='collapse-icon' />
            </div>
            <div className='page-label' >
                <span>Customers</span>
            </div>
            <div className='page-label' >
                <span>Handouts</span>
            </div>
            <div className='page-label' >
                <span>Collection</span>
            </div>
        </div>
    )
}

export default DrawerSection