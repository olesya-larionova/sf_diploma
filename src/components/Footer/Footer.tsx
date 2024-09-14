import React from "react";
import css from './Footer.module.css';

function Footer() {
    return (
        <footer className={css.footer}>
            <img src="./img/whiteLogo.svg" alt="СКАН" className={css.logo}/>
            <div className={css.address}>г. Москва, Цветной б-р, 40<br/>+7 495 771 21 11<br/>info@skan.ru<br/><br/>Copyright. 2022</div>
        </footer>
    )
}

export default Footer;
