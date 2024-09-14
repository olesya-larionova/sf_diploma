import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import css from './LoginForm.module.css';
import {submitLoginInfo} from '../../DataQueries/DataQueries';


type TProps = {
    formtype:String
}

type TRefsObj = {
    loginNameRef:React.RefObject<HTMLInputElement>,
    loginPassRef:React.RefObject<HTMLInputElement>,
    loginButtonRef: React.RefObject<HTMLButtonElement>
}

function LoginForm(props:TProps) {

    const refs:TRefsObj = {
        loginNameRef: useRef(null),
        loginPassRef: useRef(null),
        loginButtonRef: useRef(null)
    }

    const navigate = useNavigate();

    function getForm(formtype:String) {

        const class_facebook_btn = css.snet_btn + ' ' + css.facebook;
        const class_google_btn = css.snet_btn + ' ' + css.google;
        const class_yandex_btn = css.snet_btn + ' ' + css.yandex;
        if (formtype === "login") {
            const styleTab1 = css.tab_nav + ' ' + css.login_tab1_active;
            const styleTab2 = css.tab_nav + ' ' + css.login_tab2_inactive;
            return (
                <>
                    <nav className={css.login_tab_authorization}>
                        <Link to="/login" className={styleTab1}><button>Войти</button></Link>
                        <Link to="/signup" className={styleTab2}><button>Зарегистрироваться</button></Link>
                    </nav>
    
                    <form action="" className={css.login_form_authorization}>
                        <div className={css.tab_content}>
                            <label htmlFor="userName">Логин или номер телефона:</label><br/>
                            <input name= "userName" type="text" className={css.username_pwd} onChange={validateLogin} ref={refs.loginNameRef}/><br/>
                            <div className={css.username_error}></div>
                            <label htmlFor="userPass">Пароль:</label><br/>
                            <input name= "userPass" type="password" className={css.username_pwd} onChange={validateLogin} ref={refs.loginPassRef}/>
                            <div className={css.pwd_error}></div>
                            <button type="button" className={css.login_btn} disabled ref={refs.loginButtonRef}>Войти</button>
                            <Link to="" className={css.login_a}>Восстановить пароль</Link>
                        </div>
                    </form>
                    
                    <div className={css.login_snet_btn}>
                        <p className={css.login_p}>Войти через:</p>
                        <button className={class_google_btn}></button>
                        <button className={class_facebook_btn}></button>
                        <button className={class_yandex_btn}></button>
                    </div>
                </>
            )
        }
        else {
            const styleTab1 = css.tab_nav + ' ' + css.login_tab1_inactive;
            const styleTab2 = css.tab_nav + ' ' + css.login_tab2_active;
            return (
                <>
                    <nav className={css.login_tab_authorization}>
                        <Link to="/login" className={styleTab1}><button>Войти</button></Link>
                        <Link to="/signup" className={styleTab2}><button>Зарегистрироваться</button></Link>
                    </nav>
    
                    <form action="" className={css.login_form_authorization}>
                        <div className={css.tab_content}>
                            Здесь как бы находится форма регистрации, но по условию задания ее реализации не требовалось
                        </div>
                    </form>
                </>
            )
        }
    
        function validateLogin(e:React.ChangeEvent<HTMLInputElement>) {
            
            if (refs.loginButtonRef.current && refs.loginNameRef.current && refs.loginPassRef.current) {
                const button = refs.loginButtonRef.current;
                if ((refs.loginNameRef.current.value && refs.loginPassRef.current.value)) {
                    button.disabled = false;
                    button.style.cursor = "pointer";
                    button.onclick = doLogin;
                } else {
                    button.disabled = true;
                    button.style.cursor = "not-allowed";
                }
            }
            return false;
        }    
        
        async function doLogin(e:MouseEvent) {
            e.preventDefault();
            if (refs.loginNameRef.current && refs.loginPassRef.current) {
                if (refs.loginNameRef.current.value && refs.loginPassRef.current.value) {
                    await submitLoginInfo(refs.loginNameRef.current.value, refs.loginPassRef.current.value).then(
                        (response) => {
                            navigate("/");
                            navigate(0); // принудительно перерендерить страницу
                        }
                    );
                }
            }
        }

    }
        
    return (
        <section className={css.login_section}>
            <div className={css.login_section_title}>
                <p className={css.login_title}>Для оформления подписки на тариф необходимо авторизоваться</p>
            </div>

            <div className={css.login_section_authorization}>
                <img src="/img/bolt.svg" className={css.bolt} alt="Замок"/>

                {getForm(props.formtype) /* получение основного HTML */} 

            </div>

            <div className={css.login_section_img}>
                <img src="/img/login_img.svg" className={css.login_img} alt="Пара кудрявых людей тащит ключ от врат рая"/>
            </div>
        </section>
    )
   
}

export default LoginForm;
