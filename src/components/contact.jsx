import React, { Component } from 'react'
import "./css/uploadfrom.css"
import imgleft from "../img/Illus.png"
import axios from 'axios';
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default class Uploadform extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            description: "",
            msg: "",
            subject: "",
            submitbtn: false
        }
        const { userid } = this.state
        if (userid == null) {
            window.location.replace("/")
        }
    }
    handleChange = (event) => {
        const { name } = event.target
        if (name === "msg") {
            this.setState({
                msg: event.target.value
            })
        }
        if (name === "subject") {
            this.setState({
                subject: event.target.value
            })
        }
    }


    handleSubmit = async () => {
        const userid = localStorage.getItem("userid")
        this.setState({
            submitbtn: true
        })
        const maildatas = await {
            subject: this.state.subject,
            description: this.state.msg,
        }
        console.log(maildatas);
         await axios.post(`${process.env.REACT_APP_SERVER}/contact/send`,{ maildatas },{
            headers: {
                userid: userid
            }
        }).then(async (res) => {
            const mailres = await res.data
            console.log(mailres)
        })
    }





    render() {
        const { modalShow, submitbtn, msg } = this.state
        if (submitbtn !== false) {
            toast.info(msg, {
                autoClose: 10000,
                transition: Slide
            })
        }
        return (
            <React.Fragment>
                <div className="container row mt-5" id="bodycontent">
                    <div className="col-md-2"></div>
                    <div className="col-md-4">
                        <img src={imgleft} alt="" id="leftimg" />
                    </div>
                    <div className="col-md-4" id="secondpart" style={{ height: "47vh",boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.1)",padding:"1.8em" }}>
                        <h3 className="mt-3 mb-3" style={{ textAlign: " center" }}>Send a mail </h3>

                        <div className="email-login">
                            <label htmlFor="email"> <b>Subject</b></label>
                            <input className="form-control mb-3" id="shuffle" name="subject" type="shuffle" placeholder="Subject" onChange={this.handleChange} />

                            <label htmlFor="psw"><b>Message</b></label>
                            <input className="form-control" id="shuffle" name="subject" type="shuffle" placeholder="Subject" onChange={this.handleChange} />

                        </div>

                        <div className="">
                            {
                                submitbtn === false ? <button className="btn btn-success btn-block submit" onClick={this.handleSubmit}>Submit</button> : <button className="btn btn-success btn-block submit" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading...</button>
                            }
                        </div>

                    </div>
                </div>



            </React.Fragment>
        )
    }
}
