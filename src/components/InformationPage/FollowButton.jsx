
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useFollow from '../../hooks/useFollow';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import useSessionStorage from '../../hooks/useSessionStorage';
import { useTranslation } from 'react-i18next';


const FollowButton = () => {
    const {t} = useTranslation()
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
                               {t('followed')}
                            </Tooltip>
                        }
                    >

                        <div>
                            <Button
                                className='d-flex justify-content-center align-items-center rounded-5 m-2 px-5 py-3 fw-semibold btn-wave-wrap'
                                onClick={handleUnfollow}
                            >
                                {
                                    loading
                                        ?
                                        <Loading size={'sm'}/>
                                        :
                                        `${t('followed')}`
                                }
                            </Button>
                        </div>
                    </OverlayTrigger>
                    :
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                {t('title_follow')}
                            </Tooltip>
                        }
                    >


                        <div className=''>
                            <Button
                                className='d-flex justify-content-center align-items-center rounded-5 m-2 px-5 py-3 fw-semibold btn-wave-wrap'
                                onClick={handleFollow}
                            >
                                {
                                    loading
                                        ?
                                        <Loading size={'sm'}/>
                                        :
                                        `${t('follow')}`
                                }
                            </Button>
                        </div>
                    </OverlayTrigger>
            }
        </>

    );
};

export default FollowButton;
