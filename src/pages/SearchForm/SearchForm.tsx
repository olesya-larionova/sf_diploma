import css from './SearchForm.module.css';
import { useNavigate } from 'react-router-dom';
import { isAuthorised } from '../../DataQueries/DataQueries';
import { useEffect, useState, useRef, useContext } from 'react';
import { TSearchParameters, SearchFormContext } from '../../AppContext';

type TSomeError = {
    code: number,
    message: string
}

// переменная для хранения статуса проверки каждого из проверямых полей
const validationStatus = {inn: false, docQty: false, period: false};

function SearchForm() {

    // неавторизованного пользователя отправлять на страницу входа
    const navigate = useNavigate();

    const formData:TSearchParameters = useContext(SearchFormContext);  

    useEffect(() => {
        if (!isAuthorised()) {
            navigate('/login');
        }  else {
            initialCheck();
        }
    });

    ///////// СОСТОЯНИЯ И ССЫЛКИ //////////

    // состояние для текстов ошибок в проверяемых полях
    const [errors, setError] = useState({
        innErrorText: '',
        docQtyErrorText: '',
        periodErrorText: ''
    })

    // ссылка для обращения к кнопке отправки данных
    const submitButtonRef:React.RefObject<HTMLButtonElement> = useRef(null);

    
    ///////// ОБРАБОТЧИКИ СОБЫТИЙ //////////
    
    // ИНН
    function handleInnChange(e:React.ChangeEvent<HTMLInputElement>)  {

        const inn = e.target.value;
        const error = {code:0, message:''};
        const result = validateInn(inn, error);
        if (error.code !==2 ) formData.inn = inn;
        e.target.style.borderColor = result ? "rgba(199, 199, 199, 1)" : "red";
        setError({...errors, innErrorText: error.message});
        validationStatus.inn = result;
        controlRequiredFields();
    }

    // количество документов
    function handleDocQtyChange(e:React.ChangeEvent<HTMLInputElement>)  {
        
        const qty = e.target.value;
        const error = {code:0, message:''};
        const result = validateDocQty(qty, error);
        if (error.code === 1) { // в значение пропускаются только цифры, поэтому сообщения об ошибке не требуется
            setError({...errors, docQtyErrorText: ''});
            validationStatus.docQty = true;
        } else if (error.code === 2) { // была попытка ввести единственную букву, поле осталось не заполненным
            setError({...errors, docQtyErrorText: error.message});
            validationStatus.docQty = false;
        }
        else {
            formData.docQty = qty;
            setError({...errors, docQtyErrorText: error.message});
            validationStatus.docQty = result;
        }
        e.target.style.borderColor =  (result || error.code === 1) ? "rgba(199, 199, 199, 1)" : "red";
        controlRequiredFields();
    }

    // поля ввода даты
    function handleDateChange(e:React.ChangeEvent<HTMLInputElement>)  {
        const date = e.target.value;
        let result = false;
        const error = {code:0, message:""};
        if (e.target.name === "fromDate") {
            formData.fromDate = date;
            result = validatePeriod(date, formData.toDate, error);
        } else if (e.target.name === "toDate") {
            formData.toDate = date;
            result = validatePeriod(formData.fromDate, date, error);
        }
        validationStatus.period = result;
        setError({...errors, periodErrorText: error.message})
        controlRequiredFields();
    }

    // прочие поля ввода
    const handleInputChanges = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { type, name, value, checked } = e.target;
        formData[name] = (type==="checkbox") ? checked : value;
    };

    // поле выбора тона 
    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {    
        const {name, value} = e.target;
        formData[name] = value;
    }

    // проверка заполнености обязательных полей и активация кнопки отправки данных
    function controlRequiredFields() {  

        if (submitButtonRef.current) {
            const button = submitButtonRef.current;
            if (validationStatus.inn && validationStatus.docQty && validationStatus.period) {
                button.disabled = false;
                button.style.cursor = "pointer";
                button.style.opacity = "1";
                button.onclick = submitQueryData;
            } else {
                button.disabled = true;
                button.style.cursor = "not-allowed";
                button.style.opacity = "0.5";
            }
        }
    }

    // а вот при повторном открытии надо проверить все поля и если они заполнены, то активировать кнопку
    function initialCheck() {
        const error = {code: 0, message: ''};
        if (submitButtonRef.current) {
            const button = submitButtonRef.current;
            if (validateInn(formData.inn, error) && validateDocQty(formData.docQty, error) && validatePeriod(formData.fromDate, formData.toDate, error)) {
                button.disabled = false;
                button.style.cursor = "pointer";
                button.onclick = submitQueryData;
            } else {
                button.disabled = true;
                button.style.cursor = "not-allowed";
            }
        }
    }

    function submitQueryData(e:MouseEvent) {
        e.preventDefault();
        navigate("/results");
    }

    return(
        <>
            <section className={css.search_form_section_1}>
                <div className={css.search_form_section_title}>
                    <p className={css.search_form_title}>Найдите необходимые данные в пару кликов</p>
                    <p className={css.search_form_text}>Задайте параметры поиска. <br/>Чем больше заполните, тем точнее поиск</p>
                </div>
                <div className={css.search_form_section_img_1}>
                    <img src="/img/document.png" alt="Документ" className={css.img_1}/>
                </div>
                <div className={css.search_form_section_img_2}>
                    <img src="/img/folders.png" alt="Папки" className={css.img_2}/>
                </div>
            </section>
            <section className={css.search_form_section_2}>
                <form action="" className={css.search_form_data_form}>
                    
                    <div className={css.data_form_left}>
                        
                        <label htmlFor="inn" className={css.text_inn_ton_doc_calendar_chek}>ИНН компании<span className={css.asterisk}><sup>&#9913;</sup></span></label>
                        <input type="text" className={css.inn_ton_doc_calendar} name="inn" value={formData.inn} maxLength={10} placeholder="10 цифр" onChange={handleInnChange}/>
                        <div className={css.inn_ton_doc_calendar_error}>{errors.innErrorText}</div>

                        <label htmlFor="ton" className={css.text_inn_ton_doc_calendar_chek}>Тональность</label>
                        <select name="ton" className={css.inn_ton_doc_calendar} defaultValue={formData.ton} onChange={handleSelectChange}>
                            <option value="any">Любая</option>
                            <option value="positive">Позитивная</option>
                            <option value="negative">Негативная</option>
                        </select>

                        <label htmlFor="docQty" className={css.text_inn_ton_doc_calendar_chek}>Количество документов к выдаче<span className={css.asterisk}><sup>&#9913;</sup></span></label>
                        <input type="text" className={css.inn_ton_doc_calendar} name="docQty" value={formData.docQty} pattern="[0-9]{1,4}" maxLength={4} placeholder="от 1 до 1000" onChange={handleDocQtyChange}/>
                        <div className={css.inn_ton_doc_calendar_error}>{errors.docQtyErrorText}</div>

                        <div className={css.data_form_left_calendar}>
                            <label className={css.text_inn_ton_doc_calendar_chek}>Диапазон поиска</label> <span className={css.asterisk}><sup>&#9913;</sup></span><br/>
                            <input type="text" className={css.calendar} name="fromDate" value={formData.fromDate} onChange={handleDateChange} placeholder="Дата начала" onFocus={(e) => {e.target.type="date"}} onBlur={(e) => {e.target.value ? e.target.type="date" : e.target.type="text"}}/>
                            <input type="text" className={css.calendar} name="toDate" value={formData.toDate} onChange={handleDateChange} placeholder="Дата конца" onFocus={(e) => {e.target.type="date"}} onBlur={(e) => {e.target.value ? e.target.type="date" : e.target.type="text"}}/>
                            <div className={css.inn_ton_doc_calendar_error}>{errors.periodErrorText}</div>
                        </div>

                    </div>

                    <div className={css.data_form_right}>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="maxComplete" value="Признак максимальной полноты" defaultChecked={formData.maxComplete} onChange={handleInputChanges}/> Признак максимальной полноты</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="busMention" value="Упоминания в бизнес-контексте" defaultChecked={formData.busMention} onChange={handleInputChanges}/> Упоминания в бизнес-контексте</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="mainRole" value="Главная роль в публикации" defaultChecked={formData.mainRole} onChange={handleInputChanges}/> Главная роль в публикации</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="onlyRisky" value="Публикации только с риск-факторами" defaultChecked={formData.onlyRisky} onChange={handleInputChanges}/> Публикации только с риск-факторами</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="inclTech" value="Включать технические новости рынков" defaultChecked={formData.inclTech} onChange={handleInputChanges}/> Включать технические новости рынков</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="inclAnno" value="Включать анонсы и календари" defaultChecked={formData.inclAnno} onChange={handleInputChanges}/> Включать анонсы и календари</p>
                        <p className={css.text_inn_ton_doc_calendar_chek}><input type="checkbox" name="inclNews" value="Включать сводки новостей" defaultChecked={formData.inclNews} onChange={handleInputChanges}/> Включать сводки новостей</p>
                        <button type={"button"} ref={submitButtonRef} className={css.search_btn}>Поиск</button>
                        <p className={css.text_chek}>* Обязательные к заполнению поля</p>
                    </div>
                </form>
                <div className={css.search_form_section_img_3}>
                    <img src="/img/man_and_rocket.png" alt="Мужчина с ракетой" className={css.img_3}/>
                </div>
            </section>
        </>
    );
}



////// ФУНКЦИИ ПРОВЕРКИ ВВЕДЕННЫХ ЗНАЧЕНИЙ ///////

// проверка дат и корректности периода
function validatePeriod(fromDate:string, toDate:string, error:TSomeError) {

    let result = false;
    if (!fromDate || !toDate) {
        error.code = 1;
        error.message = "Укажите обе даты";
    } else {
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
        if (date1 && date2) {
            if (date1 > new Date()) {
                error.code = 2;
                error.message = "Дата начала больше текущей даты";
            } else if (date1 > date2){
                error.code = 3;
                error.message = "Окончание раньше начала?";
            } else {
                result = true;
            }
        } else {
            error.code = 4;
            error.message = "Какой-то из дат нехорошо";
        }
    }
    return result;
}

// проверка допустимого количества документов
function validateDocQty(qty:string, error:TSomeError) {

    let result = false;

    if (/[^0-9]/.test(qty)) {
        error.code = 1;
        error.message = 'Вводить можно только цифры';
        if (qty.length === 1) { // особый случай
            error.code = 2;
            error.message = 'Количество должно быть заполнено';
        }
    } 
    if (!qty.length) {
        error.code = 3;
        error.message = 'Количество должно быть заполнено';
    } else if (+qty > 1000) {
        error.code = 4;
        error.message = 'Максимум 1000 документов';
    } else {
        result = true;
    }

    return result;

}

// проверка ИНН 
function validateInn(inn:string, error:TSomeError) {
    
    let result = false;

    if (!inn.length) {
        error.code = 1;
        error.message = 'ИНН должен быть заполнен';
    } else if (/[^0-9]/.test(inn)) {
        error.code = 2;
        error.message = 'ИНН может состоять только из цифр';
    } else if ([10, 12].indexOf(inn.length) === -1) {
        error.code = 3;
        error.message = 'В ИНН должно быть 10 цифр';
    } else {
        const checkDigit = function (inn:string, coefficients:Array<number>) {
            let n = 0;
            for (let i in coefficients) {
                n += coefficients[i] * (+inn[i]);
            }
            return n % 11 % 10;
        };
        switch (inn.length) {
            case 10:
                const n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if (n10 === parseInt(inn[9])) {
                    result = true;
                }
                break;
            case 12:
                var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                    result = true;
                }
                break;
        }
        if (!result) {
            error.code = 4;
            error.message = 'Введен неверный ИНН';
        }
    }
    return result;
}

export default SearchForm;