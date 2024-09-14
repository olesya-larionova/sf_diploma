import { FunctionComponent } from 'react';
import css from './Slider.module.css';

interface IData {
    text: string;
    img: string;
}

type TProps = {
    data: IData;
};

const Slide:FunctionComponent<TProps> = (props) => {
    
    return (
        <div className={css.slide}>
            <img src={props.data.img} className={css.slide_icon} alt=""/>
            <p className={css.slide_text}>{props.data.text}</p>
        </div>
    )
}

export default Slide;
