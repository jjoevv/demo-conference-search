import React from "react";

const CallforpaperPage = ({conference}) => {
  const processText = (text) => {
    // Split text by \n
    const lines = text.split('\n');

    // Render lines with appropriate line breaks
    return lines.map((line, index) => {
      if (line === '' && index > 0 && lines[index - 1] === '') {
        // Ignore consecutive empty lines beyond the first two
        return null;
      }
      return (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
          {line === '' && lines[index + 1] === '' && <br />}
        </React.Fragment>
      );
    }).filter(element => element !== null);
  };
  return (
    <div className='p-4 m-0'>
      <div className="bg-white p-5 m-5">
        <h3 className='ms-3 fs-4 fw-bold'>Call for paper</h3>
        {
          conference
            ?
            <>
             <div className="px-3">
               <p className="text-justify fs-medium">
               {processText(conference.callForPaper)}
               </p>
             </div>
            </>
            :
            <span>Please refresh page.</span>
        }
      </div>
    </div>
  )
}

export default CallforpaperPage