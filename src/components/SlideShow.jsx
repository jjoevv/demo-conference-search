import { useState } from 'react';
import { Card, Container, Stack, Image, Button, Carousel } from 'react-bootstrap';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import UnfollowIcon from './../assets/imgs/unfollow.png'
import FollowIcon from './../assets/imgs/follow.png'
import TimeIcon from './../assets/imgs/time.png'
import LocationIcon from './../assets/imgs/location.png'
import PrevIcon from './../assets/imgs/control_prev.png'
import NextIcon from './../assets/imgs/control_next.png'

const properties = {
    prevArrow: <Button className='bg-transparent border-0'>
        <Image src={PrevIcon} style={{ width: "15zpx" }} fluid />
    </Button>,

    nextArrow: <Button className='bg-transparent border-0 ms-2'>
        <Image src={NextIcon} style={{ width: "15px" }} />
    </Button>
}
const SlideShow = ({showSlideShow, setShowSlideShow}) => {
    const [listEvents, setListEvents] = useState(test)
    
    const onClickFollow = () => {

    }
    return (
        <Container className='mt-4 border-0 rounded-4 p-4 bg-blue-light mx'  >

            <Stack direction='horizontal'>
                <span className='p-0 fw-bold fs-4 text-color-black me-auto'>Popular conferences</span>
                <Button 
                    onClick={()=>setShowSlideShow(!showSlideShow)}
                    className='bg-transparent rounded-circle text-color-medium border-color-medium'>X
                </Button>
            </Stack>

            <Slide slidesToScroll={2} slidesToShow={2} indicators={false} autoplay={false} {...properties}
                className='bg-primary mt-4'>
                {
                    listEvents.map((conf) => (
                            <Card
                                className='border-0 rounded-4 p-2 bg-blue-light'
                                
                                id={conf.con_id} key={conf.con_id}>
                                <Stack className=' pe-4 ms-2 bg-blue-light ' direction='horizontal' >

                                    <Card.Body  className='mx-2 bg-white w-100 rounded-4'>
                                        <Stack direction='horizontal' className='w-100' gap={4}>
                                            <div md={4} className='w-25 bg-white rounded-4 h1 fw-bolder  border border-secondary p-3'>
                                                <div style={{width: '64px', height: '64px'}} className='fw-bold text-color-darker fs-3 m-2 d-flex align-items-center justify-content-center '>{conf.acronym}</div>
                                            </div>
                                            <Stack>
                                                <Card.Title className='d-flex align-items-center mb-1 w-100 fs-6 text-color-back fw-bold' >{conf.con_name}</Card.Title>
                                                <Stack direction="horizontal" gap={5}>
                                                    <Card.Text className='d-flex align-items-center mb-1'>
                                                        <Image src={TimeIcon} className='me-2' style={{ width: '20px' }} />
                                                        <span className='fs-6 fw-bold text-color-back'>{conf.update_time}</span>
                                                    </Card.Text>
                                                    <Card.Text className='d-flex align-items-center mb-1'>
                                                        <Image src={TimeIcon} className='me-2' style={{ width: '20px' }} />
                                                        <span className='fs-6 fw-bold text-color-back'>{conf.update_time}</span>
                                                    </Card.Text>
                                                </Stack>
                                                
                                        <Card.Text className='fw-bold text-color-back m-0'>
                                            <Image src={LocationIcon} className='me-2' style={{ width: '18px' }} />
                                            {conf.location}
                                            <Button onClick={onClickFollow()} className='bg-primary-light border-0 float-end'>
                                                {
                                                    conf.follow === true
                                                        ?
                                                        <>
                                                            <Image src={FollowIcon} width={15} height={18} />
                                                        </>
                                                        :
                                                        <>
                                                            <Image src={UnfollowIcon} width={15} height={18} />
                                                        </>
                                                }
                                            </Button>
                                        </Card.Text>
                                            </Stack>
                                        </Stack>
                                    </Card.Body>

                                </Stack>
                            </Card>
                    ))
                }
            </Slide>
        </Container>
    )
}

export default SlideShow