import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Fetch.css'
const Fetach = () => {
// const [user,setUser]=useState([])
    const [rdata,setRdata]=useState([])
    const [searchTerm, setSearchTerm] = useState('');
const [locationFilter, setLocationFilter] = useState('');
const [industryFilter, setIndustryFilter] = useState('');
const [page, setPage] = useState(1)
const [userReq,setUserReq]=useState(35)
    async function featchData(){
        const url=`https://aws.amazon.com/api/dirs/items/search?item.directoryId=customer-references&sort_by=item.additionalFields.sortDate&sort_order=desc&size=${userReq}&item.locale=en_US&tags.id=GLOBAL%23industry%23financial-services%7Ccustomer-references%23industry%23financial-services&page=0`;
    const data=await axios.post(url);
    let datas=data.data.items
    setRdata(datas)

    }
// 



const filteredData = rdata.filter(res => {
  return (
    res?.item.additionalFields.displayLocation.toLowerCase().includes(locationFilter.toLowerCase()) &&
    res?.item.additionalFields.industry.toLowerCase().includes(industryFilter.toLowerCase()) 
    &&
    (res?.item.additionalFields['customer-name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    res?.item.additionalFields.descriptionSummary.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});
// 
console.log(">>>>",rdata);



useEffect(()=>{
featchData();
},[userReq])
const selectPageHandler = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= filteredData.length / 3 && selectedPage !== page) {
    setPage(selectedPage)
  }
}


  return (
    <div>
     
      <h1 className='headline'>API Data</h1>
      
      <label >Name & Descripation:</label>

      <input
        type="text"
        placeholder="Name and Descripation"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <label >Location Filter:</label>

      <input value={locationFilter}
        placeholder="Location"
      onChange={e => setLocationFilter(e.target.value)}>

      </input>
      <label >Industry Filter:</label>

      <input value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}
           placeholder="Industry Filter"
      >

     
      </input>
      <label >User Requset:</label>
      <input value={userReq} onChange={e => setUserReq(e.target.value)}
           placeholder="industryFilter"
      >
        
      </input>
      <br />
      <table>
        <thead>
          <tr>
            <th>Customer Logo</th>
            <th>Customer Name</th>
            <th>Headline</th>
            <th>URL</th>
            <th>Description Summary</th>
            <th>Location</th>
            <th>Industry</th>
          </tr>
        </thead>
       {
       }
        <tbody>
            {
              filteredData.length<0 ? (
                <p>Data not found</p>):
                filteredData.slice(page * 6 - 6, page * 6).map((res)=>{
           //api
            
        return(    
          
            <tr key={res?.item.id}>
                <td><img className='comImg' src={res?.item.additionalFields.imageSrcUrl } alt="Logo"/></td>
                <td>{ res?.item.additionalFields['customer-name'] }</td>
                <td>{res?.item.additionalFields.headline}</td>
                <td>
                  <a href={res?.item.additionalFields.headlineUrl } target="_blank">
                  Link
                  </a>
                  </td>
                <td>{res?.item.additionalFields.descriptionSummary}</td>
               
                <td>{res?.item.additionalFields.displayLocation}</td>
                <td>{res?.item.additionalFields.industry}</td>
            </tr>
          )  })}
          
        </tbody>
    </table>



   {filteredData.length > 0 && (
  <div className="pagination">
    <span
      onClick={() => selectPageHandler(page - 1)}
      className={page > 1 ? "" : "pagination__disable"}
    >
      ◀
    </span>

    {[...Array(Math.ceil(filteredData.length / 6))].map((_, i) => (
      <span
        key={i}
        className={page === i + 1 ? "pagination__selected" : ""}
        onClick={() => selectPageHandler(i + 1)}
      >
        {i + 1}
      </span>
    ))}

    <span
      onClick={() => selectPageHandler(page + 1)}
      className={page < Math.ceil(filteredData.length / 6) ? "" : "pagination__disable"}
    >
      ▶
    </span>
  </div>
)}

    </div>
  )
}

export default Fetach