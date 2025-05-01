export default function LoginForm({handleFormChange}){
    const handleSubmit =(e)=>{
        e.preventDefault()
        
    }
        
    return(
        <>
        <form id="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required></input>
            <label htmlFor="password" required>Password:</label>
            <input id="password"name="password" type="password" required></input>
            <input type="submit" value="Login"/>
            <p onClick={handleFormChange}>New User?</p>
        </form>
        </>
    )
}