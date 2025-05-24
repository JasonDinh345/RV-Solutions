import useGet from "../../../hooks/useGet"
import { useAuth } from "../../../hooks/useAuth";
import MyRV from "./components/MyRV";
import { RVProvider } from "../../../provider/RVProvider";
import MyRVInfo from "./components/MyRVInfo";
import "./MyRVs.css"
export default function MyRVs(){
    const {account, authLoading, error: authError} = useAuth();
    const {data: RVs, isLoading, error} = useGet(account?.AccountID ? `http://localhost:1231/RV/owner/${account.AccountID}`: null)

    
    if(isLoading || authLoading){
        return <p className="flexCenter">Loading...</p>
    }
    if(error){
        if(error?.response.status === 404){
            return <h1 className="flexCenter" style={{marginTop: "2%"}}>No RVs found!</h1>
        }else{
            return <p>{error}</p>
        }
    }else if (authError){
        return <p>{authError}</p>
    }
    
    return(
        <RVProvider>
        <>
        {account && RVs &&
        
        <>
         <table className="accountTable">
            <thead>
                <tr>
                    <th>RV</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Size Class</th>
                    <th>Cost To Rent</th>
                    <th>Is Available?</th>
                </tr>
            </thead>
            <tbody>
              
                  {RVs.map((RV, i)=>
                    <MyRV rvData={RV} key={i+1}/>
                )}
              
            </tbody>
        </table>
       
            
        <MyRVInfo/>
        
        
        </>
         
        }
        </>
        </RVProvider>
    )
}