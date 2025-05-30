import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

const DrawerSection = () => {
    return (
        <div className='container' >
            <div className='title section-title' >
                <span>Finance Manager</span>
                <UnfoldMoreOutlinedIcon className='collapse-icon' />
            </div>
        </div>
    )
}

export default DrawerSection