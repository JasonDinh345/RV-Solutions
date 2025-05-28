import ImageSlide from "./componenets/ImageSlide";

export default function Home(){
    return(
       <>
        <ImageSlide/>
        <div id="purpose">
            <h1>Purpose</h1>
            <div id="purposeContent">
                <p>
                    We are developing a comprehensive database for a two-way RV marketplace catering specifically to users in Washington State. 
                    This platform enables both RV owners and renters to connect, list, and book RVs efficiently. The purpose of the database is to provide a well-structured and 
                    centralized system for managing various aspects of the business, including user accounts, RV listings, bookings, and damage reports.
                </p>
                <p>
                    By doing so, the business owner can ensure data consistency is upheld to prevent misdocumentation or miscommunication when creating data on thier site.
                    With this, users can confidently interact with thier site, knowing the information they fetch/see is managed securely and accuratly. 
                </p>
            </div>
        </div>
        </>
    )
}