import ImageSlide from "./componenets/ImageSlide";
import "./Home.css"
export default function Home(){
    return(
        <>
        <div id="homePage">
            <ImageSlide/>
            <div id="purpose">
                <h1>Purpose</h1>
                <div id="purposeContent">
                    <p>
                        We are developing a comprehensive database for a two-way RV marketplace catering specifically to users in Washington State. 
                        This platform enables both RV owners and renters to connect, list, and book RVs efficiently. The purpose of the database is to provide a well-structured and 
                        centralized system for managing various aspects of the business, including user accounts, RV listings, bookings, and damage reports.
                    </p>
                    <br></br>
                    <p>
                        By doing so, the business owner can ensure data consistency is upheld to prevent misdocumentation or miscommunication when creating data on thier site.
                        With this, users can confidently interact with thier site, knowing the information they fetch/see is managed securely and accuratly. 
                    </p>
                </div>
            </div>
            <div id="projectInfo">
            <h1>Project Info</h1>
            <h2><a href="https://github.com/JasonDinh345/RV-Solutions">GitHub Repo</a></h2>
            <table id="teamInfo">
                <thead>
                    <tr>
                        <th>Team Member</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jason Dinh</td>
                        <td>jasond34@uw.edu</td>
                    </tr>
                    <tr>
                        <td>Cuauhtemoc Aguilar Mandujano</td>
                        <td>aguilcua@uw.edu</td>
  
                    </tr>
                    <tr>
                        <td>RJ Calderon</td>
                        <td>insert</td>
                        
                    </tr>
                    <tr>
                        <td>Holden Tsang</td>
                        <td>ht0726@uw.edu</td>
                      
                    </tr>
                    
                </tbody>
            </table>
        </div>
        </div>
        </>
    )
}