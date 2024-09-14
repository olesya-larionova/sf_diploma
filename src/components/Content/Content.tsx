import React from "react";
import {Route, Routes} from "react-router-dom";
import css from './Content.module.css';
import Homepage from "../../pages/Homepage/Homepage";
import LoginForm from "../../pages/LoginForm/LoginForm";
import SearchForm from "../../pages/SearchForm/SearchForm";
import SearchResult from "../../pages/SearchResult/SearchResult";

function Content() {

    return (
        <main className={css.main}>
            <Routes>
                <Route path='/' element={<Homepage formtype=""/>} />
                <Route path='/tariffes' element={<div>Тарифы</div>}/>
                <Route path='/faq' element={<div>FAQ</div>}/>
                <Route path='/signup' element={<LoginForm formtype="signup" />} />
                <Route path='/login' element={<LoginForm formtype="login" />} />
                <Route path='/logout' element={<Homepage formtype="logout"/>} />
                <Route path='/query' element={<SearchForm/>} />
                <Route path='/results' element={<SearchResult/>} />
            </Routes>
        </main>
    )
}

export default Content;