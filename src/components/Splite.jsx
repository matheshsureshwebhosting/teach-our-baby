import React, { Component } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import d1 from '../img/d1.png'
export default class Splite extends Component {
    constructor( props ) {
		super( props );

		this.primaryRef   = React.createRef();		
	}
   
    render() {
        const primaryOptions = {
			type      : 'loop',
			width     : 800,
			perPage   : 1,
			perMove   : 1,
			gap       : '1rem',
			pagination: false,
		};

        return (
            <div>
                <Splide options={ primaryOptions } ref={ this.primaryRef }>
                    <SplideSlide>
                        <img src={d1} alt="1" />
                    </SplideSlide>
                    <SplideSlide>
                        <img src={d1} alt="2" />
                    </SplideSlide>
                </Splide>
            </div>
        )
    }
}
