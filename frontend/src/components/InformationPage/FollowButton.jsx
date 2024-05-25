
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useFollow from '../../hooks/useFollow';
import { isObjectInList } from '../../utils/checkExistInList';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Loading from '../Loading';


const FollowButton = () => {
    const { listFollowed, followConference, unfollowConference} = useFollow()
    const [loading, setLoading] = useState(false)
    const id = useParams()

const handleFollow = async () => {
    setLoading(true)
    const status = await followConference(id.id)
    if(status){
        setLoading(false)
        
    }
}


const handleUnfollow = async () => {
    setLoading(true)
    const status = await unfollowConference(id.id)
    if(status){
        setLoading(false)
    }
}

    return (
        <>
        {
                isObjectInList(id.id, listFollowed)
                ?
                
                <Button 
                className='bg-darkcyan-normal rounded-5 mt-2 px-5 fw-semibold mx-2'
                onClick={handleUnfollow}
                title='Click to unfollow'
                >
                {
                    loading
                    ?
                    <Loading/>
                    :
                    `Followed`
                }
                </Button>
                :
                <Button 
                className='bg-darkcyan-normal rounded-5 mt-2 px-5 fw-semibold mx-2'
                onClick={handleFollow}
                title='Click to follow conference'
                >
                 {
                    loading
                    ?
                    <Loading/>
                    :
                    `Follow`
                }
                </Button>
            }
        </>

    );
};

export default FollowButton;
