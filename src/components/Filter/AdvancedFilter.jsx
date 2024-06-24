
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'
import { useTranslation } from 'react-i18next'

const AdvancedFilter = () => {
  const { t } = useTranslation()
  return (
    <Row gap={2} className="w-1a00">
      <Col xs={6} sm={2} md={2} lg={2} className="mt-1">
        <span className="fw-bold text-color-black">{t("rank")}</span>
        <Options label="rank" />
      </Col>
      <Col xs={6} sm={2} md={2} lg={2} className="mt-1">
        <span className="fw-bold text-color-black">{t("source")}</span>
        <Options label="source" />
      </Col>
      <Col xs={6} sm={2} md={2} lg={2} className="mt-1">
        <span className="fw-bold text-color-black">{t("acronym")}</span>
        <Options label="acronym" />
      </Col>
      <Col xs={6} sm={2} md={2} lg={2} className="mt-1">
        <span className="fw-bold text-color-black">{t("rating")}</span>
        <StarDropdown label="rating" />
      </Col>
      <Col xs={6} sm={2} md={2} lg={2} className="mt-1">
        <span className="fw-bold text-color-black">{t("type")}</span>
        <Options label="type" />
      </Col>
    </Row>
  )
}

export default AdvancedFilter