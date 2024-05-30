import React from "react";

const CallforpaperPage = ({conference}) => {
  const processText = (text) => {
    return text.split('\n').map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    ));
  };
  return (
    <div className='p-5 mx-5 pt-4 px-5'>
      <h3 className='fs-4 fw-bold'>Call for paper</h3>
      {
        conference
          ?
          <>
           <div className="ps-4 pe-5 fs-5">
             <p className="text-justify">
             {processText(conference.callForPaper)}
             </p>
           </div>
          </>
          :
          <span>Please refresh page.</span>
      }
    </div>
  )
}

export default CallforpaperPage