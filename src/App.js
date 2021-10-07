import './App.css'
import React, { Component } from 'react'
import Game from './game'


export default class App extends Component {
    constructor(props){
        super(props)
        this.state = JSON.parse(window.localStorage.getItem('state')) || {
            userStatus: false,
            currentUser: {},
            name: '',
            email: '',
            username: '',
            password: '',
            toggle: false,
            }
        }
    // saves this.state to browser cookies
    setState(state) {
        window.localStorage.setItem('state', JSON.stringify(state))
        super.setState(state)
    }

    // start here
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleLogin = async (event) => {
        event.preventDefault()
        const url = 'http://localhost:3001/user/login'
        try {
            const response = await fetch (url , {
                method: "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    email:    event.target.email.value,
                    password: event.target.password.value,
                })
            })
            const parsedResponse = await response.json()
            if (response.status === 200) {
                this.setState({
                    currentUser: parsedResponse,
                    userStatus: true,
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                })
            }
        }
        catch(err){
            console.log(err)
        }
    }

    handleRegister = async (event) => {
        event.preventDefault()
        const url = 'http://localhost:3001/user/register'
        try {
            const response = await fetch (url , {
                method: "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    name:     event.target.name.value,
                    username: event.target.username.value,
                    email:    event.target.email.value,
                    password: event.target.password.value,
                })
            })
            if (response.status === 200) {
                console.log('success')
                this.setState({
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                })
            }
        }
        catch(err){
            console.log(err)
        }
    }
    null = () => {
        return null
    }

    logout = () => {
        //console.log(this.state.userStatus)
        this.setState({
            userStatus: false,
        })
    }

    toggle = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    copyToClipboard = () => {
        let content = "https://www.linkedin.com/in/conner-hogan-40b39b37"
        navigator.clipboard.writeText(content)
    }


    render(){
        return(
        <div className="App">

        {this.state.userStatus

            ?

            <div>
            <button className="logout" onClick={this.logout}>Logout</button>
            <Game player={this.state.currentUser}/>
            </div>

            :

            <div>
            <button className="inout" onClick={this.toggle}>Register/Login</button>

            <form onSubmit={this.state.toggle ? this.handleLogin : this.handleRegister}>

            {
            this.state.toggle ?
            <div>
            <h3>Login</h3>
            <label>Email:</label>
            <input onChange={this.handleChange} name="email" value={this.state.email} />

            <label>Password:</label>
            <input type='password' onChange={this.handleChange} name="password" value={this.state.password} />

            <input className="logREG" type="submit" value="Login"></input>

            </div>

            :
            <div>

            <h3>Register</h3>
            <label>Name:</label>
            <input onChange={this.handleChange} name="name"  value={this.state.name} ></input>

            <label>Username:</label>
            <input onChange={this.handleChange} name="username"  value={this.state.username} ></input>

            <label>Email:</label>
            <input onChange={this.handleChange} name="email"  value={this.state.email} ></input>

            <label>Password:</label>
            <input type="password" onChange={this.handleChange} name="password"  value={this.state.password} ></input>

            <input className="logREG" type="submit" value="Register" ></input>
            </div>
            }

            </form>
            </div>
            }

            {!this.state.userStatus ?
            <form onSubmit={this.handleLogin}>
                <input className="hide" name="email" value="Recruiter@Email.com" onChange={this.null} />
                <input className="hide" name="password" value="password"    onChange={this.null} />
                <input type="submit" value="Recruiter Login" className="logREG"></input>
            </form>
            : null }

            <div className="footer">Designed By Conner Hogan <br></br>
                <p className="copy"><a onClick={this.copyToClipboard} href="https://www.linkedin.com/in/conner-hogan-40b39b37">Linkedin</a>&nbsp;&nbsp;copy</p>
                <a href=" mailto: ConnerRHogan@gmail.com">Email</a>

            </div>
        </div>
        )
    }
}
