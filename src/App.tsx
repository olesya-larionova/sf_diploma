import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Content from './components/Content/Content';
import {TAppData, AppContext}  from './AppContext';

//import './App.css';

const appData:TAppData = {
  loginName: "",
  userName: ""
}

function App() {
  return (
    <AppContext.Provider value={appData}>
      <BrowserRouter>
        <Header/>
        <Content/>
        <Footer/>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
