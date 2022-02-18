import axios from 'axios';
import storage from  './DataStorage';
import Database from './Database';
import {base_url} from '../constants/utils';
  
export default class ServerResources {
  
    fetchLatestCourse=(id) => {
       
        let durl="";
        if(id==""){
            durl=base_url+'course/list'; 
        }else{
            durl=base_url+'course/listlatest/'+id;
        }
        
        axios.get(durl)
            .then(function (response) { 
                
                const res=response.data;
                console.log(res);
                const db = new Database();
                console.log(res.length);
                res.forEach(element => {
                    
                    db.addCourse(element);  
                });
            
            })
            .catch(function (error) {
            console.log(error);
            
            });

    }
}