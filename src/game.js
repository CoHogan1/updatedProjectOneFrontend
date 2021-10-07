import './App.css'
import React, { Component } from 'react'

export default class Game extends Component {
    constructor(props){
        super(props)
        this.state = {
            highScore: [],
            round: false,
            colored: false,
            score: 0,
            timer: 30,
            mode: ['red','black','green','blue'],
        }
    }

    // start here
    getRandomColor = () => {
        const randomNumber = Math.floor(Math.random() * this.state.mode.length)
        return this.state.mode[randomNumber]
    }
    getRandomText = () => {
        const randomNumber = Math.floor(Math.random() * this.state.mode.length)
        console.log(this.state.mode[randomNumber])


    }

    setMode = (event) =>{
        if(event.target.innerText === 'Easy'){
            this.setState({
                mode: ['red','black','green','blue']
            })
        } else if(event.target.innerText === 'Medium'){
            this.setState({
                mode: ['red','pink','black','grey','green','lime','blue','cyan']
            })
        }else if (event.target.innerText === 'Hard'){
            this.setState({
                mode: ['red','pink','purple','black','grey','brown','green','lime','orange','blue','cyan','teal']
            })
        }
    }



    setGameColor = () => {
        if (this.state.colored){
            const style = {
                color : this.getRandomColor(),
                border: `2px solid ${this.getRandomColor()}`,
                backgroundColor : this.getRandomColor(),
            }
            return style
        }
        const style = {
            color : "black",
            border: "2px solid black",
            backgroundColor : "white",
        }
        return style
    }

    // box colors ==============================================================
    changeBoxColor = () => {
        if (this.state.colored){
            const style = {
                    color: this.getRandomColor(),
                    border: `2px solid ${this.getRandomColor()}`,
                    backgroundColor: this.getRandomColor(),
                    textShadow: `-1px 1px 0 white, 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white`,
                }
            return style
        }
    }

    togStateColors = () => {
        this.setState({ colored: !this.state.colored,
        correctColor:  this.getRandomColor()})
    }

    // this func is good.
    guess = (event) => {

        let score = (this.state.mode.length * 2) + (this.state.mode.length / 2)
        if (this.state.colored) {
            if (event.target.innerText === this.state.correctColor) {
                console.log("Correct", event.target.innerText)
                this.setState({ score: this.state.score + score })
            } else {
                console.log("Wrong", event.target.innerText)
                this.setState({ score: this.state.score - score })
            }
        } else {
            console.log("cannot guess un-colored square")
        }
    }

    // this func is good
    colorScore = () => {
        if (this.state.score > 0){
            return {'color': "green"}
        } else if(this.state.score < 0) {
            return {'color': 'red'}
        } else {
            return {'color': 'white'}
        }
    }

    // this one is good
    colorTimer = () => {
        if (this.state.timer < 10){
            return {'color': 'red'}
        }
    }

    // this one needs to filter only the top ten scores
    getHighScore = async (event) =>{
        //console.log("geting high scores")
        const url = 'http://localhost:3001/score/highscore'
        fetch(url)
        .then(res => {return res.json()
        }).then(data => {
            // sort data by highest to lowest highscores
            data.sort((a,b) => b.highscore - a.highscore)
            this.setState({highScore: data})
        })
    }
    // this one is working....
    sendDataToDatabase = async (event) => {
        console.log("Sending high scores")
        const url = 'http://localhost:3001/score/add'
        try{
            const response = await fetch (url , {
                method: "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    user: this.props.player.name,
                    highscore: this.state.score,
                })
            })
            if (response.status === 200) {
                console.log('success')
                this.componentDidMount()
                this.setState({
                    score: 0,
                })
            }
        }
        catch(err){
            console.log(err)
        }
    }


    startGameTimer = () => {
        this.setState({ round: true})

        const play = setInterval(()=>{
            this.togStateColors()
            this.setState({ timer : this.state.timer -1})

            if (this.state.timer <= 0){
                clearInterval(play)
                this.setState({
                    round: false,
                    timer: 30,
                })
                this.sendDataToDatabase()
            }
        }, 1200)
    }

    // initiate game play
    startGame = () => {
        if (this.state.round === true){
            return null
        }
        this.startGameTimer()
    }
    // working fine.
    componentDidMount(){
        this.getHighScore()
    }

    render(){
        return(
        <div className="game">
        <div className="gameNav">
            <div>Player:&nbsp; <span>{this.props.player.name}</span></div>
            <div>Score:&nbsp; <span style={this.colorScore()}> {this.state.score} </span></div>
            <div>Rounds:&nbsp; <span style={this.colorTimer()}> {this.state.timer} </span></div>
        </div>

        <div className="settings">
        <h2>Difficulty</h2>
        <div className="setBut">
        <button onClick={this.setMode} >Easy</button>
        <button onClick={this.setMode} >Medium</button>
        <button onClick={this.setMode} >Hard</button>
        </div>
        </div>


        <button className="start" onClick={this.startGame}>Start game</button>


        <div className="chosenColor" style={this.setGameColor()}>{this.state.colored ? this.state.correctColor : "Guess this color"}</div>

        <div className="boxContainer">
        <div className="allBoxes">

            {this.state.mode.map((item, index)=>{
                return <div className="box" key={index} onClick={this.guess} style={this.state.colored ? this.changeBoxColor(): this.state.style}>{this.state.colored ? this.getRandomColor() : null}</div>
            })}

        </div>
        </div>

        <div className="highscores"><h1>HighScores</h1>{this.state.highScore.map((item, index)=>{
                if (index >= 10){return null}
                return <div key={index} className="score">{item.user}&nbsp;&nbsp;{item.highscore}</div>
            })}
        </div>
        </div>
        )
    }
}
