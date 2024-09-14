import { useState } from 'react';
import css from './Slider.module.css';
import Slide from './Slide';

type TSlideData = {
    text: string,
    img: string,
    key: number
};

const slides:TSlideData[] = [
    {
        text: "Высокая и оперативная скорость обработки заявки",
        img: "/img/slider_clock.png",
        key: 0
    },
    {
        text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
        img: "/img/slider_search.png",
        key: 1
    },
    {
        text: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
        img: "/img/slider_shield.png",
        key: 2
    },
    {
        text: "Достоверные сведения, помогающие принять правильные решения",
        img: "/img/slider_cat.png",
        key: 3
    },
    {
        text: "Оперативная служба поддержки ответит на вопросы по работе с сервисом 24/7",
        img: "/img/slider_support1.png",
        key: 4
    },
    {
        text: "Сервис опустошит ваш счет в банке всего лишь наполовину. Но помните - стакан наполовину полон!",
        img: "/img/slider_glass.png",
        key: 5
    }
];

function Slider() {

    const [state, setState] = useState(1);
    
    const scrollLeft = () => {
        slides.unshift(slides.pop() as TSlideData);
        setState(state + 1);
    }

    const scrollRight = () => {
        slides.push(slides.shift() as TSlideData);
        setState(state + 1);
    }

    const isMobile = window.matchMedia("(max-width: 780px)").matches;

    return (
        <div className={css.slider}>
            <img src="./img/arrow_left.svg" className={css.slider_arrow} alt="&lt;--" onClick={scrollLeft}/>
            {/* для вывода используем только три первых элемента массива (один для мобильной версии), так как при нажатии стрелок прокрутки массив перестраивается*/}
            {slides.slice(0, isMobile?1:3).map(function(slide){
                return <Slide key={slide.key} data={slide}/>
            })}

            <img src="./img/arrow_right.svg" className={css.slider_arrow} alt="--&gt;" onClick={scrollRight}/>
        </div>
    )
}

export default Slider;
