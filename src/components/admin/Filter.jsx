
import {  Row, Col } from 'react-bootstrap';
import DropdownOptions from './DropdownOptions';
import DateRangePicker from '../Filter/DateRangePicker';
import { useTranslation } from 'react-i18next';


function Filter() {
  const {t} = useTranslation()
  return (
    <div className='shadow p-3 border rounded mb-2'>
      <Row>
        <Col><span className="fw-bold text-color-black">{t('location')}</span><DropdownOptions label="location" placeholder={t('location')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('field_of_research')}</span><DropdownOptions label="for" placeholder={t('field_of_research')}/></Col>
        <Col><span className="fw-bold text-color-black">{t('submission_date')}</span><DateRangePicker label="submissionDate"/></Col>
        <Col><span className="fw-bold text-color-black">{t('conference_date')}</span><DateRangePicker label="conferenceDate"/></Col>
      </Row>
      {/* Hàng 2 */}
      <Row className='my-2'> 
        <Col><span className="fw-bold text-color-black">{t('rank')}</span><DropdownOptions label="rank" placeholder={t('rank')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('source')}</span><DropdownOptions label="source" placeholder={t('source')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('acronym')}</span><DropdownOptions label="acronym" placeholder={t('acronym')} /></Col>
        <Col><span className="fw-bold text-color-black">{t('type')}</span><DropdownOptions label="type" placeholder={t('type')} /></Col>
      </Row>
    </div>
  );
}

export default Filter;
