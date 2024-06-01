
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useFollow from '../../hooks/useFollow';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import useSessionStorage from '../../hooks/useSessionStorage';


const FollowButton = () => {
    const { loading, listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()
    const {getDataListInStorage} = useSessionStorage()
    const [isClick, setIsClick] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [status, setStatus] = useState(false)
    const id = useParams()

    useEffect(() => {
        const res = isCheck(id.id);
        setIsFollowing(res);
    }, [id, listFollowed]);

    useEffect(() => {
        const fetchData = async () => {
            const followedList = getDataListInStorage('listFollow')
            if(followedList.length === 0 || !followedList){
                await getListFollowedConferences();
            }
            const res = isCheck(id.id);
            setIsFollowing(res);
        };
        fetchData();
    }, [id, isClick])


    const handleFollow = async () => {
        setIsClick(true)
        const result = await followConference(id.id)
        setStatus(result)
    }


    const handleUnfollow = async () => {
        setIsClick(true)
        const result = await unfollowConference(id.id)

        setStatus(result)
    }

    const isCheck = (idToCheck) => {
        const check = listFollowed.some(item => item.id === idToCheck);

        return check
    };
    return (
        <>
            {
                isFollowing
                    ?
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                Click to unfollow conference
                            </Tooltip>
                        }
                    >

                        <Button
                            className='bg-darkcyan-normal rounded-5 mt-2 px-5 fw-semibold mx-2'
                            onClick={handleUnfollow}
                            title='Click to unfollow conference'
                        >
                            {
                                loading
                                    ?
                                    <Loading />
                                    :
                                    `Followed`
                            }
                        </Button>
                    </OverlayTrigger>
                    :
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                Click to follow conference
                            </Tooltip>
                        }
                    >


                        <Button
                            className='bg-darkcyan-normal rounded-5 mt-2 px-5 fw-semibold mx-2'
                            onClick={handleFollow}
                        >
                            {
                                loading
                                    ?
                                    <Loading />
                                    :
                                    `Follow`
                            }
                        </Button>
                    </OverlayTrigger>
            }
        </>

    );
};

export default FollowButton;
