
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'
import { useTranslation } from 'react-i18next'

const AdvancedFilter = () => {
    const {t} = useTranslation()
    return (
        <Row direction="horizontal" gap={3} className="w-100">
        <Col>
          <span className="fw-bold text-color-black">{t('rank')}</span>
          <Options label="rank" />
        </Col>
        <Col>
          <span className="fw-bold text-color-black text-nowrap">{t('field_of_research')}</span>
          <Options label="for" />
        </Col>
        <Col>
          <span className="fw-bold text-color-black">{t('source')}</span>
          <Options label="source" />
        </Col>
        <Col>
          <span className="fw-bold text-color-black">{t('acronym')}</span>
          <Options label="acronym" />
        </Col>
        <Col>
          <span className="fw-bold text-color-black">{t('rating')}</span>
          <StarDropdown label="rating" />
        </Col>
        <Col>
          <span className="fw-bold text-color-black">{t('type')}</span>
          <Options label="type" />
        </Col>
      </Row>
    )
}

export default AdvancedFilter