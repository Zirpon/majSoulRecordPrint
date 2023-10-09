import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import bg1 from './assets/images/bg1.jpg'
import bg2 from './assets/images/bg2.jpg'
import bg4 from './assets/images/bg4.png'
import bg5 from './assets/images/bg5.jpg'
import loadingimg from './assets/images/loading.jpg'
// style={{justifyContent: 'center', alignItems: 'center', textAlign:'center'}} height: 300, width:800
export default function DemoCarousel() {
    return (
        <Carousel width={"100%"} infiniteLoop={true} dynamicHeight={false}
            thumbWidth={70} autoPlay={true} interval={800}>
            <div>
                <img src={bg1} />
                {/*<p className="legend">Legend 1</p>*/}
            </div>
            <div>
                <img src={bg2} />
                {/*<p className="legend">Legend 1</p>*/}
            </div>
            <div>
                <img src={bg4} />
                {/*<p className="legend">Legend 1</p>*/}
            </div>
            <div>
                <img src={bg5} />
                {/*<p className="legend">Legend 1</p>*/}
            </div>
            <div>
                <img src={loadingimg} />
                {/*<p className="legend">Legend 1</p>*/}
            </div>
        </Carousel>
    );
}

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>