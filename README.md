<h1>TCSS445 Spring 2025 Project: RV Solutions</h1>
<p>We are trying to create a database for a car management rental system. This allows us to organize our data and prevent miscommunication in the availability of cars, ensuring business operates as nominal. We want to improve our knowledge of working with databases, since it is an important concept in virtually every software used today. Want to add more flexibility for users than existing solutions and allow users to host their own RV on the same platform. </p>
<h1>Folder Structure</h1>
<ul>
    <li><code>client</code>: Folder containing all frontend components </li>
        <ul>
            <li><code>public</code>: Folder containing static files to be used
            <li><code>src</code>: Folder containing React components
            <ul>
                <li><code>assets</code>: global files
                <li><code>components</code>: global components
                <li><code>hooks</code>: custom React hooks
                <li><code>provider</code>: custom React providers for context
                <li><code>context</code>: custom React useContext hooks
                <li><code>pages</code>: folder containing each page for the site
                <li><code>util</code>: functions to be imported from to keep things organized
            </ul>
        </ul>
    <li><code>server</code>: Folder containing all backend components using Express in TS</li>
        <ul>
            <li><code>src</code>: Folder containing files for backend
            <ul>
                <li><code>types</code>: Folder containing defined types describing the relational schema
                <li><code>route</code>: Folder containing the route layer for each table that contains the path that the frontend needs to visit in order to manipute/get data
                <li><code>controller</code>: Folder containing the controller layer for each table that recieves data from the route layer/frontend to be sent to the service layer and sends data back to the frontend
                <li><code>service</code>: Folder containing the service layer for each table that recieves data from the controller data and sends queries to the database
                <li><code>util</code>: functions to be imported from to keep things organized
            </ul>
        </ul>
</ul>
    
<h1>How to Run</h1>
<ol>
    <li>Have Node installed locally</li>
    <li>Start MySQL and the Apache Web Server using the XAMPP program</li>
    <li>Create a new database called "rvSolutions"</li>
    <li>Import the included SQL file into the database</li>
    <li>Create a new user privilege with the specifed attributes listed in the .env and set to have all global privilege </li>
    <li>In the project folder open a new terminal and run <code>cd server</code></li>
    <li>Next run <code>npm install</code> or <code>npm i</code> to install the needed npm modules for this package</li>
    <li>Then run <code>npm run build</code></li>
    <li>Finally, run <code>npm run dev</code>, this should say "Server running!" in the terminal</li>
    <li>Open a new terminal and run <code>cd client</code></li>
    <li>Next run <code>npm install</code> or <code>npm i</code> to install the needed npm modules for this package</li>
    <li>Finally, run <code>npm run dev</code>, there should a localhost server in the terminal where you can visit the frontend</li>
</ol>


