import React, { useContext, useState } from 'react';
import { Button, Accordion, AccordionContext, useAccordionButton, Card, Row, Image, Col } from 'react-bootstrap';
import DropdownOptions from './DropdownOptions';
import DateRangePicker from '../Filter/DateRangePicker';

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Button
      className='bg-white rounded-2'
      style={{ backgroundColor: isCurrentEventKey ? "white" : "pink" }}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

function Filter() {
  return (
    <div>
    <Row>
      <Col><DropdownOptions label="location" placeholder="Location" /></Col>
      <Col><DropdownOptions label="fors" placeholder="Field of research"/></Col>
      <Col><DropdownOptions label="ranks" placeholder="Rank" /></Col>
      <Col><DateRangePicker label="submissionDate"/></Col>
      <Col><DateRangePicker label="date"/></Col>
    </Row>
    {/* Hàng 2 */}
    <Row className='my-2'> 
      <Col><DropdownOptions label="sources" placeholder="Source" /></Col>
      <Col><DropdownOptions label="acronyms" placeholder="Acronym" /></Col>
      <Col><DropdownOptions label="rating" placeholder="Rating" /></Col>
      <Col><DropdownOptions label="types" placeholder="Type" /></Col>
      <Col><DropdownOptions label="owner" placeholder="Owner by" /></Col>
    </Row>
  </div>
  );
}

export default Filter;
