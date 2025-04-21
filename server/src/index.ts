import {authApp} from './authServer.js'; 
import {app} from './server.js'; 



app.listen(4000,()=>{
    console.log("Server running!")
})

authApp.listen(5000 ,()=>{
    console.log("Auth Server running!")
})