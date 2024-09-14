import { Link, useNavigate } from 'react-router-dom';
import css from './Homepage.module.css';
import Slider from '../../components/Slider/Slider';
import Tariffes from '../../components/Tariffes/Tariffes';

type TProps = {
    formtype:String
}

function Homepage(props:TProps) {

    const navigate = useNavigate();

    if(props.formtype === "logout") {
        localStorage.removeItem("token");
        localStorage.removeItem("expire");
        navigate("/");
        navigate(0); // принудительно перерендерить страницу
    }

    return (
        <>
            <section className={css.section1}>
                <div className={css.section1_left_pane}>
                    <h1 className={css.section1_left_title}>сервис по поиску <br/> публикаций <br/> о компании <br/> по ее ИНН</h1>
                    <p className={css.section1_left_text}>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
                    <Link to="/query"><button className={css.section1_btn_requestData}>Запросить данные</button></Link>
                </div>
                <img src="/img/section1.svg" className={css.section1_img1} alt="Человекоподобное существо в заляпанном молоком костюме из кружки с кофе, стоящей на столе, которое тыкает пальцами в разноцветные прямоугольники, висящие в воздухе"/>
            </section>

            <section className={css.section2}>
                <p className={css.section2_3_title}>Почему именно мы</p>
                <Slider/>
                <div className={css.section2_div_img}>
                    <img src="./img/section2.svg" className={css.section2_img1} alt="Мужик, сидящий на скамейке и топающий по луже под ногами, расплескивая её во все стороны, держащий при этом мыльный пузырь с неведомой фигней внутри"/>
                </div>
            </section>

            <section className={css.section3}>
                <p className={css.section2_3_title}>Наши тарифы</p>
                <Tariffes/>
            </section>
               
        </>
    )
}

export default Homepage;