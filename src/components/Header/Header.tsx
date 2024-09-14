import { useContext, useRef } from "react";
import { TAppData, AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import { getSavedToken, getUserProperties } from '../../DataQueries/DataQueries';
import Summary from "./Summary";
import css from './Header.module.css';
import cssMenu from './Menu.module.css';


function Header() {

    const appData = useContext(AppContext);
    const isMobile = window.matchMedia("(max-width: 780px)").matches;
    const menuRef:React.RefObject<HTMLDivElement> = useRef(null);

    function rightHeaderBlock(appData:TAppData) {

        const savedToken:string = getSavedToken();
    
        if (savedToken) { 
            return (
                <div className={css.authorized}>
                    <Summary/>
                    {userInfo(appData)}
                </div>
            )
        } else {
            return (
                <nav className={css.signin_login}>
                    <Link to="/signup" className={css.signin}>Зарегистрироваться</Link>
                    <div className={css.rectangle1}></div>
                    <Link to="/login"><button className={css.login}>Войти</button></Link>
                </nav>
            )
        }
    }
    
    function rightHeaderBlockMobile(appData:TAppData) {
    
        const savedToken:string = getSavedToken();
        return (
            <>
                <div className={css.authorized}>
                    {savedToken? <Summary/> : ''}
                    <div className={css.menubutton}>
                        <img src="/img/MenuButton.svg" alt="Меню" onClick={showMenu}/>
                    </div>
                </div>
            </>
        )
    }
    
    function showMenu() {
        if (menuRef.current) {
            const menuDiv = menuRef.current;
            menuDiv.style.display = "flex";
        }
    }

    function hideMenu() {
        if (menuRef.current) {
            const menuDiv = menuRef.current;
            menuDiv.style.display = "none";
        }
    }
    
    function userInfo (appData:TAppData) {
    
        return (
            <div className={css.user}>
                <div className={css.user_left}>
                    <div>{appData.userName}</div>
                    <div><Link to="/logout">Выйти</Link></div>
                </div>
                <div className={css.user_right}>
                    <img src={getUserProperties().userIcon} alt="ICO"/>
                </div>
            </div>
        )    
    }
    
    if (isMobile) {
        
        const savedToken:string = getSavedToken();

        return (
            <>
                { /*отключает масштабирование на смартфонах, может находиться в любом месте, все равно попадет в <head> */}
                <meta name="viewport" content="width=device-width, user-scalable=no"/> 
                
                { /* меню для мобил */}
                <div className={cssMenu.header_menu_mobile} ref={menuRef}>
                    <div className={cssMenu.menu_mobile_top}> 
                        <img src="/img/logo_mobile.svg" alt="СКАН" className={cssMenu.logo_mobile}/>
                        <button type="button" aria-label="Close" className={cssMenu.close_btn}>
                            <img src="/img/close.svg" alt="ЗАКРЫТЬ" className={cssMenu.close_mobile} onClick={hideMenu}/>
                        </button>
                    </div>
                    <nav className={cssMenu.mainmenu_mobile}>
                        <ul>
                            <li><Link to="/" onClick={hideMenu}>Главная</Link></li>
                            <li><Link to="/tariffes" onClick={hideMenu}>Тарифы</Link></li>
                            <li><Link to="/faq" onClick={hideMenu}>FAQ</Link></li>
                        </ul>
                    </nav>
                    { savedToken?
                        <Link to="/logout" className={cssMenu.enter_mobile_link}><button className={cssMenu.enter_mobile_btn} onClick={hideMenu}>Выйти</button></Link>
                        :
                        <>
                            <Link to="/signup" className={cssMenu.signin_mobile} onClick={hideMenu}>Зарегистрироваться</Link>
                            <Link to="/login" className={cssMenu.enter_mobile_link}><button className={cssMenu.enter_mobile_btn} onClick={hideMenu}>Войти</button></Link>
                        </>
                    }
                </div>

                <header className={css.header}>
                    <img src="/img/colorLogo.svg" alt="СКАН" className={css.logo}/>
                    <div className={css.right_pane}>
                        {rightHeaderBlockMobile(appData)}
                    </div>
                </header>
            </>
        )
    } else {
        return (
            <header className={css.header}>
                <img src="/img/colorLogo.svg" alt="СКАН" className={css.logo}/>
                <div className={css.right_pane}>
                    <nav className={css.mainmenu}>
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/tariffes">Тарифы</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </nav>
                    {rightHeaderBlock(appData)}
                </div>
            </header>
        )
    }
}

export default Header;
