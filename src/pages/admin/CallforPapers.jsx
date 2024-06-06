import { useParams } from "react-router-dom"
import useConference from "../../hooks/useConferences"
import { useEffect, useState } from "react"
import Loading from "../../components/Loading"
import { Tab, Tabs } from "react-bootstrap"
import InformationPage from "../../components/InformationPage/InformationPage"
import ImportantDatePage from "../../components/InformationPage/ImportantDatePage"


const CallforPapers = () => {
  const {conference, handleGetOne} = useConference()
  const [loading, setLoading] = useState(false)
  const id = useParams()

  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
        const fetchData = async () => {
            await handleGetOne(id.id);
            setLoading(false)
        }
        if(id.id !== conference.id || !conference){
            setLoading(true)
            fetchData()
        }
  }, [id])
  return (
    <div>
      <h4>Call for paper detail</h4>
        {
        loading ?
        <div className="my-4">
          <Loading/>
        </div>
        :
       <>
       {
        conference &&
        <Tabs defaultActiveKey="one" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="one" title="Information">
          <InformationPage />
        </Tab>
        <Tab eventKey="two" title="Important dates">
          <ImportantDatePage />
        </Tab>
        <Tab eventKey="three" title="Call for paper">
          <CallforPapers />
        </Tab>
      </Tabs>
       }
       </>
        }
    </div>
  )
}

export default CallforPapers