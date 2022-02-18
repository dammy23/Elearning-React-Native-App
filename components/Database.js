import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import {base_url} from '../constants/utils';

 
const database_name = "LearnDB.db";
const database_version = "2.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

const db=SQLite.openDatabase(database_name,database_version);
console.log("Database OPEN");
 
db.transaction(tx => {
  /**tx.executeSql('DROP TABLE courses');
  tx.executeSql('DROP TABLE lessons');
  tx.executeSql('DROP TABLE enrollment');**/
 

  tx.executeSql('CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, courseid TEXT, lessons INT, name TEXT,description TEXT, image TEXT, created TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY AUTOINCREMENT, courseid TEXT, lessonid TEXT, type INT, name TEXT, description TEXT, video TEXT, duration TEXT, created TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS enrollment (id INTEGER PRIMARY KEY AUTOINCREMENT, courseid TEXT, created TEXT)');

});
 
   
export default class Database {

      getInit(){
        return db;
      }
   
      closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
      };

      
      listCourses() {
       
          
        
            db.transaction((tx) => {
              tx.executeSql('SELECT id, courseid, lessons,name, image, created FROM courses order by id desc limit 5', [],
                (txObj, { rows: { _array } }) => this.setState({ courses: _array }));
               
            });
          
      }

      courseById(id) {
        //console.log(id);
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM courses WHERE id = ?', [id]).then(([tx,results]) => {
                console.log(results);
                if(results.rows.length > 0) {
                  let row = results.rows.item(0);
                  return row;
                }
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
         
      }

      getLastCourse() {
            const _this=this;
            db.transaction(tx => {
              tx.executeSql('SELECT * FROM courses ORDER BY id DESC LIMIT 1', null,
              (txObj, res) => {

                let ele = res.rows.item(0); 
                if(res.rows.length==0){
                  _this.fetchLatestCourse("");
                }else{
                  _this.fetchLatestCourse(ele.courseid); 
                }
                


              } 
              
              )
 

              
              });
           
          
      }

     
      addCourse(prod) {
       
             // console.log(prod);
            this.fetchLatestLesson(prod.id);
            db.transaction((tx) => {
                
              tx.executeSql('INSERT INTO courses (courseid, lessons,name, image,description, created) VALUES (?, ?, ?, ?,?, ?)', [prod.id, prod.lessons, prod.name, prod.image,prod.description, prod.created_at],(tx, results) => {
                //console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('Data Insertedddd Successfully....');
                } else  console.log('Failed....')});
            })


          
      } 

      addLesson(prod) {

           
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO lessons (lessonid, courseid, name, description, video, duration, created,type) VALUES (?, ?, ?, ?, ?, ?, ?,?)', [prod.id, prod.course_id, prod.name, prod.description, prod.video_id, prod.duration, prod.created_at,prod.type],(tx, results) => {
               // console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                 // console.log('Data Inserted Successfully....');
                } else  console.log('Failed....');
              });
            
            });
          
      } 
 
      updateProduct(id, prod) {
          
                db.transaction((tx) => {
                  tx.executeSql('UPDATE courses SET name = ?, image = ?, lessons = ?,created = ? WHERE id = ?', [prod.name, prod.image, prod.lessons, prod.created_at, id]).then(([tx, results]) => {
                  
                  });
                }).then((result) => {
                  this.closeDatabase(db);
                }).catch((err) => {
                  console.log(err);
                });
            
      }

      deleteCourse(id) {
       
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM courses WHERE id = ?', [id]).then(([tx, results]) => {
                console.log(results);
                
              });
            })
         
      }

      fetchLatestCourse=(id) => {
       
          const _this=this;
          let durl="";
          if(id==""){
              durl=base_url+'course/list'; 
          }else{
              durl=base_url+'course/listlatest/'+id;
          }
       
          axios.get(durl)
              .then(function (response) { 
                
                  const res=response.data;
                  
                  //console.log(res);
                  res.forEach(element => {
                    
                    _this.addCourse(element);   
                  });
              
              })
              .catch(function (error) {
               
              
              });

      }

      fetchLatestLesson=(id) => {
        const _this=this;
        let durl=base_url+'lesson/list/'+id; 
        
        axios.get(durl).then(function (response) { 
              
                const res=response.data;
                //console.log(res);
                res.forEach(element => {
                  //console.log(element);
                  _this.addLesson(element);   
                });
            
            })
            .catch(function (error) {
          
            
            });

      }

}