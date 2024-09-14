import {getAccountInfo} from '../../DataQueries/DataQueries';
import css from './Header.module.css';
import { useState, useEffect } from 'react';

type TAccountInfo = {
    usedCompanyCount: number,
    companyLimit: number
}

function Summary() {

    const [usedCompanyCount, setCount] = useState(0);
    const [companyLimit, setLimit] = useState(0);

    function successCallback(result: TAccountInfo) {
        if (result.companyLimit) {
            setCount(result.usedCompanyCount);
            setLimit(result.companyLimit);
        }
    }

    function failureCallback(error: string) {
        setCount(0);
        setLimit(0);
    }      

    useEffect(() => {getAccountInfo().then(successCallback, failureCallback) }); 
   

    if (companyLimit) {
        return (
        <div className={css.summary}>
            <div className={css.summary_line}>Использовано компаний<span className={css.numberUsed}>{usedCompanyCount}</span></div>
            <div className={css.summary_line}>Лимит по компаниям<span className={css.numberAllowed}>{companyLimit}</span></div>
        </div>)
    } else {
        return (
            <div className={css.summary}>
                <i className={css.throbber}></i>
            </div>
        )
    }
}

export default Summary;
