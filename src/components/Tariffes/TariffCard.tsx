import { FunctionComponent } from 'react';
import css from './Tariffes.module.css';

interface IData {
    name: string,
    desc: string,
    icon: string,
    bcolor: string,
    fcolor: string,
    price: number,
    oldprice: number,
    instprice: number,
    months: number,
    incl1: string,
    incl2: string,
    incl3: string,
    key: number
}

type TProps = {
    data: IData,
    currentTariffe: string
};

const TariffCard:FunctionComponent<TProps> = (props) => {

    const data = props.data;
    const currentTarrife = props.currentTariffe === props.data.name;
    return (
        <div className={css.tariff_card}>
            <div className={css.tariff_card_top} style={{backgroundColor:data.bcolor, color:data.fcolor}}>
                <div className={css.tariff_card_top_left}>
                    <p className={css.tariff_card_top_left_title}>{data.name}</p>
                    <p className={css.tariff_card_text}>{data.desc}</p>
                </div>
                <div className={css.tariff_card_top_right}>
                    <img src={data.icon} className={css.tariff_card_top_right_img} alt=""/>
                </div>
            </div>
            <div className={css.tariff_card_bottom}>
                {currentTarrife ? <img src="./img/tariff.png" className={css.tariff_card_bottom_img} alt=""/> : <div className={css.tariff_card_bottom_img}/>}
                <div className={css.prices}>
                    <p className={css.price_activ}>{data.price} ₽</p>
                    <p className={css.price_past}>{data.oldprice} ₽</p>
                </div>
                <p className={css.tariff_card_text}>{!isNaN(data.instprice)?"или " + data.instprice + " ₽/мес. при рассрочке на " + data.months + " мес.":'\u00A0'}</p>
                <p className={css.tariff_card_bottom_title}>В тариф входит:</p>
                <ul className={css.tariff_card_bottom_ul}>
                    <li className={css.tariff_card_bottom_li}>{data.incl1}</li>
                    <li className={css.tariff_card_bottom_li}>{data.incl2}</li>
                    <li className={css.tariff_card_bottom_li}>{data.incl3}</li>
                </ul>
                <button className={css.tariff_card_bottom_btn}>{currentTarrife ? "Перейти в личный кабинет" : "Подробнее"}</button>
            </div>
        </div>
    )
}

export default TariffCard;
