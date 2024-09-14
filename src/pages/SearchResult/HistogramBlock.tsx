import css from './SearchResult.module.css';
import tableCss from "./HistogramBlock.module.css";
import { THistData, declOfNum } from '../../AppContext';
import { useState } from 'react';

type TRowData = {
    date: string,
    docsQty: number,
    riskQty: number
}

let firstElToShow = 0;

function HistogramBlock(props: {blockData:THistData}) {

    const [state, setState] = useState(0);

    let tableHeaderText = '';
    const variantsQty = (props.blockData && props.blockData.data && props.blockData.data.length) ? props.blockData.data[0].data.length: -1;
    const nothingFound = (props.blockData && props.blockData.data && !props.blockData.data.length) ? true: false;
    const error = props.blockData && props.blockData.errorCode;

    if (error) {
        tableHeaderText = "Ошибка сервера, повторите запрос через некоторое время";
    } else if (nothingFound) {
        tableHeaderText = "По вашему запросу ничего не найдено";
    } else if (props.blockData && props.blockData.data && props.blockData.data.length) {
        tableHeaderText = declOfNum(variantsQty, ['Найден ', 'Найдено ', 'Найдено ']) + variantsQty + declOfNum(variantsQty, [' вариант', ' варианта', ' вариантов']);
    } else {
        tableHeaderText = "Идет поиск, подождите";
    }

    function scrollTableLeft() {
        firstElToShow = Math.min(firstElToShow+1, variantsQty-1);
        setState(state+1);
    }

    function scrollTableRight() {
        firstElToShow = Math.max(firstElToShow-1, 0);
        setState(state+1);
    }    

    return (
        <section className={css.section_2}>
            <div className={css.section_2_title}>
                <p className={css.title}>Общая сводка</p>
                <p className={css.text}>{tableHeaderText}</p>
            </div>
            <div className={css.section_2_table}>
                <img src="./img/arrow_left.svg" alt="<" className={css.arrow} onClick = {scrollTableLeft}/>
                <HistTable blockData={props.blockData}/>
                <img src="./img/arrow_right.svg" alt=">" className={css.arrow}  onClick = {scrollTableRight}/>
            </div>            
        </section>
    )
}


function HistTable(props: {blockData:THistData}) {
    
    const arrayForTable = convertBlockDataToArray(props.blockData);
    const isMobile = window.matchMedia("(max-width: 780px)").matches;

    return(
        <table className={tableCss.rtable}>
            <thead>
                <tr>
                    <th>Период</th>
                    <th>Всего</th>
                    <th>Риски</th>  
                </tr>
            </thead>
            <tbody>
                {arrayForTable.slice(firstElToShow, isMobile ? firstElToShow+1 : firstElToShow+8).map((el)=><TableRow key={el.date} data={{date: new Date(el.date).toLocaleDateString("ru-RU"), docsQty: el.docsQty, riskQty: el.riskQty}}/> )}
            </tbody>
        </table>
    )
}

function TableRow(props: {data:TRowData}) {
    return (
        <tr>
            <td>{props.data.date}</td> 
            <td>{props.data.docsQty}</td>      
            <td>{props.data.riskQty}</td>
        </tr>
    )
}

function convertBlockDataToArray(blockData:THistData) {

    
    const result:TRowData[] = [];

    function addToResult(date: string, docQty: number, riskData?:{date:string, value:number}) {
        const riskQty = riskData ? riskData.value : 0;
        const res = {
            date: date,
            docsQty: docQty,
            riskQty: riskQty
        }
        result.push(res);
    }

    if (blockData && blockData.data && (blockData.data.length > 1)) {
        
        const docsData = blockData.data.find((el) => el.histogramType === 'totalDocuments');
        const riskData = blockData.data.find((el) => el.histogramType === 'riskFactors');
        docsData?.data.forEach((el) => {addToResult(el.date, el.value, riskData?.data.find((riskEl) => riskEl.date === el.date))})
    }


    result.sort((a, b) => {if (a.date < b.date) return 1; if (a.date > b.date) return -1; return 0;}) // по убыванию дат
    return result;

};


export default HistogramBlock;