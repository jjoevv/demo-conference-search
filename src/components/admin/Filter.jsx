
import {  Row, Col } from 'react-bootstrap';
import DropdownOptions from './DropdownOptions';
import DateRangePicker from '../Filter/DateRangePicker';
import { useTranslation } from 'react-i18next';
import Options from '../Filter/Options';
import AreaFilter from '../Filter/AreaFilter';


function Filter() {
  const {t} = useTranslation()
  return (
    <div className='shadow p-3 border rounded mb-2'>
      <Row>
        <Col><span className="fw-bold text-color-black">{t('location')}</span><Options label="location" placeholder={t('location')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('region')}</span><AreaFilter/></Col>
        <Col><span className="fw-bold text-color-black">{t('field_of_research')}</span><Options label="for" placeholder={t('field_of_research')}/></Col>
        <Col><span className="fw-bold text-color-black">{t('submission_date')}</span><DateRangePicker label="submissionDate"/></Col>
        <Col><span className="fw-bold text-color-black">{t('conference_date')}</span><DateRangePicker label="conferenceDate"/></Col>
      </Row>
      {/* Hàng 2 */}
      <Row className='my-2'> 
        <Col><span className="fw-bold text-color-black">{t('rank')}</span><Options label="rank" placeholder={t('rank')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('source')}</span><Options label="source" placeholder={t('source')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('acronym')}</span><Options label="acronym" placeholder={t('acronym')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('type')}</span><Options label="type" placeholder={t('type')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('rating')}</span><Options label="rating" placeholder={t('type')} /></Col>
      </Row>
    </div>
  );
}

export default Filter;
