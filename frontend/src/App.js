import React, { useState, Fragment } from 'react';
import './App.css';
import Axios from 'axios';
import Card from './card';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loading from './loading';
async function getData(query) {
  let data = await Axios.get('http://localhost:5000/search/' + query);
 return data;
}
function App() {
  let [query, setQuery] = useState('');
  let [result,setResult] = useState([]);
  let [loading, setLoading] = useState(false);
  return (
    <div className="container">
      <div className="field">
        <div className="control has-icons-right">
          <input className="input is-medium" type="text" placeholder="Cari barang disini.." onKeyDown={async (e) => { 
            if (e.key === 'Enter') {
            setLoading(true);
            let result = await getData(query);
            setResult(result.data);
            setLoading(false);
            } }} onChange={(e) => { setQuery(e.target.value) }}>
          </input>
          <span className="icon is-small is-right">
            <i className="fas fa-search"></i>
          </span>
          <section class="section">
          {loading? <Loading/>:<Fragment/> }
            <Tabs>
         
              <TabList>
                <Tab>Tokopedia</Tab>
                <Tab>Bukalapak</Tab>
              </TabList>

              {result.map(data=>{
              return(
                <TabPanel>
                  {data.map(data=>(
                    <Card item={data}/>
                  ))}
                </TabPanel>
              )
            })}
            </Tabs>

          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
