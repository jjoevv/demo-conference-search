
const CallforpaperPage = ({conference}) => {
 
  return (
    <div className='p-5 mx-5 pt-4'>
      <h3 className='fs-4 fw-bold'>Call for paper</h3>
      {
        conference
          ?
          <>
           <p className="text-justify">
           {conference.callForPaper}
           </p>
          </>
          :
          <span>Please refresh page.</span>
      }
    </div>
  )
}

export default CallforpaperPage