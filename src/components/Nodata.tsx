import noDataImg from '../assets/img/no_data.png'

const Nodata = () => {
    return (
        <div className='nodata-container' >
            <img src={noDataImg} alt="No Data" className='nodata-image' />
            <h3>No Data Available</h3>
            <p>Please check back later or try a different date range.</p>
        </div>
    )
}

export default Nodata