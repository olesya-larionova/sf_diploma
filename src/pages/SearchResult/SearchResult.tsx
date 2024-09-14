import css from "./SearchResult.module.css";
import HistogramBlock from "./HistogramBlock";
import ArticlesBlock from './ArticlesBlock';

import { useNavigate } from 'react-router-dom';
import { isAuthorised } from '../../DataQueries/DataQueries';
import { useContext, useEffect , useState, useRef} from 'react';
import { getHistData, getArticleListData, getDocs } from '../../DataQueries/DataQueries';
import { SearchFormContext, TArticlesList, THistData, TDocument } from "../../AppContext";

let artList = {} as TArticlesList;
//const articles = [] as TDocument[];
let startNumber = 0;
const lazyLoadQty = 10;

function SearchResult() {

    // неавторизованного пользователя отправлять на страницу входа
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthorised()) {
            navigate('/login');
        } 
    });

    const [blockData, setBlockData] = useState<THistData>();
    const [articles, setArticles] = useState<TDocument[]>();

    const refGetMoreButton:React.RefObject<HTMLButtonElement> = useRef(null);

    function successHistCallback(result: THistData) {
        if (result && result.data) {
            setBlockData(result);

        } else if (result && result.errorCode) {
            //alert("Ошибка сервера")
        }
    }

    function failureHistCallback(error: string) {
    }      

    function successArticleListCallback(result: TArticlesList) {
        if (result && result.items) {
            artList = result;
            getSomeArticles();
        } else if (result && result.errorCode) {

        }
    }

    function failureArticleListCallback(error: string) {
    }      

    const formData = useContext(SearchFormContext);

    useEffect(() => { getHistData(formData).then(successHistCallback, failureHistCallback) }, [formData]);
    useEffect(() => { getArticleListData(formData).then(successArticleListCallback, failureArticleListCallback) }, [formData]);
    
    function getSomeArticles() {

        if (artList && artList.items.length > 0) {
            
            const itemsIDs:string[] = [];
            artList.items.slice(startNumber, startNumber + lazyLoadQty).forEach((el) => {
                itemsIDs.push(el.encodedId);
            });
            if (itemsIDs.length > 0) {
                 getDocs(itemsIDs).then((response) =>
                    {
                        const articlesToAdd = [] as TDocument[];
                        if (response && response.length > 0) {
                            response.forEach((el) => articlesToAdd.push(el))
                        }
                        startNumber += response.length;
                        if (artList && startNumber >= artList.items.length) {
                            if (refGetMoreButton.current) {
                                refGetMoreButton.current.style.display = "none";
                            }
                        }
                        setArticles( articles? articles.concat(articlesToAdd) : articlesToAdd);
                    });
            }
        } else {
        }
    }

    return (
        <>
            <section className={css.section_1}>
                <div className={css.section_1_left}>
                    <p className={css.section_1_left_title}>Ищем. Скоро будут результаты</p>
                    <p className={css.section_1_left_text}>Поиск может занять некоторое время, <br/> просим сохранять терпение</p>
                </div>
                <div className={css.section_1_right}>
                    <img src="/img/woman.png" alt="Женщина с оптическим прицелом из лупы и щитом, которым защищается от обстрела стрелами" className={css.section_1_right_img}/>
                </div>
            </section>

            <HistogramBlock blockData = {blockData}/>
            {articles ? <ArticlesBlock articles = {articles}/> : <></>}
            
            <button className={css.section_btn} ref={refGetMoreButton} onClick={getSomeArticles}>Показать больше</button>
        </>
    )
}

export default SearchResult;