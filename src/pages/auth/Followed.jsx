import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from '../../components/Conference/Conference'
import useFollow from '../../hooks/useFollow'
import useSearch from '../../hooks/useSearch'

import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'


import useFilter from '../../hooks/useFilter'
import Filter from '../../components/Filter/Filter'
import { checkExistValue } from '../../utils/checkFetchedResults'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Followed = () => {
  const { t } = useTranslation()
  const {windowWidth} = useScreenSize()
  const { loading: loadingFollow, listFollowed, getListFollowedConferences } = useFollow()
  const { getOptionsFilter, optionsSelected } = useSearch()
  const { user } = useLocalStorage()

  const { filterConferences } = useFilter()


  const [displayConferences, setDisplayConferences] = useState(listFollowed)

  useEffect(() => {

    getOptionsFilter("", [])
    getListFollowedConferences()
  }, [])

  useEffect(() => {
    if (!listFollowed) {
      getListFollowedConferences()
      setDisplayConferences(listFollowed)
    }
  }, [user])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(listFollowed, optionsSelected)
      setDisplayConferences(filterResult)

    }
    else {
      setDisplayConferences(listFollowed)
    }
    // Tạo query string 
    const queryString = Object.entries(optionsSelected)
      .filter(([, values]) => values.length > 0)
      .map(([key, values]) => `${key}=${values.join(',')}`)
      .join('&');
    // Lấy phần hash của URL nếu có
    const { hash, pathname } = window.location;
    const newUrl = queryString ? `${pathname}${hash}?${queryString}` : `${pathname}${hash}`;

    // Cập nhật URL
    window.history.pushState({}, '', newUrl);
  }, [optionsSelected, listFollowed])

  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 >{t('followed_conference')}</h4>
      </div>

      {
        !loadingFollow ?
          <>
            {
              listFollowed && listFollowed.length > 0
                ?
                <>

                  <div className='fs-6 my-1 mb-3'>{t('review_followed_conferences')}</div>
                  <Filter />

                  <Conference
                    conferencesProp={displayConferences}
                    onReloadPage={getListFollowedConferences}
                    loading={loadingFollow} />
                </>
                :
                <p>{t('no_followed_conferences')}</p>
            }
          </>
          :
          <div className='mt-5'>
            <Loading onReload={getListFollowedConferences} />
          </div>
      }


    </Container>
  )
}

export default Followed