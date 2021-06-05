import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./style.css"
import d1 from "../img/d1.png"
import d2 from "../img/d2.png"

export default class Dashboard extends Component {
constructor(props) {
    super(props)
    this.state={
        userid:null
    }
}
    redirect = (e) => {
        console.log(e);     
    }
    componentDidMount =async() => {
        this.setState({
            userid: localStorage.getItem("userid")
        })
       
    }
        
    render() {
       const {userid}= this.state

       console.log(userid);
        // if(userid==null){
        //     window.location.replace("/")
        // }
        return (
            <div className="container-fluid mt-3">
                <div className="row mb-4">
                    <div className="col-6">
                        <img src={d1} alt="" />
                        <p className="qustxt mt-3">Why Right Brain?</p>
                    </div>
                    <div className="col-6">
                        <img src={d2} alt="" />
                        <p className="qustxt mt-3">How To Use?</p>
                    </div>
                </div>
                 
                <div className="row">     
                <div className="col-lg-2"></div>
                    <div className="col-lg-4 col-6 mb-2" id="uploadppt" onClick={(e) => this.redirect(e)}>
                        <Link className="nav-link" style={{ color: "black" }} to={"/uploadppt"}>
                            <div className="card cardborder" style={{ height: "100px" }}>
                                <div className="card-body">
                                    Upload PPT
                              </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-6 mb-2" id="refer" onClick={(e) => this.redirect(e)}>
                    <Link className="nav-link" style={{ color: "black" }} to={"#"}>
                        <div className="card cardborder" style={{ height: "100px" }}>
                            <div className="card-body">
                                Refer Your Friend
                              </div>
                        </div>
                        </Link>
                    </div>
                    <div className="col-lg-2"></div>
                    <div className="col-lg-2"></div>
                    <div className="col-lg-4 col-6 mb-2" id="remainder" onClick={(e) => this.redirect(e)}>
                        <Link className="nav-link" to={"/remainder"} style={{ color: "black" }}>
                            <div className="card cardborder" style={{ height: "100px" }}>
                                <div className="card-body">
                                    Daily Remainder
                              </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-6 mb-2" id="recently-uploaded" onClick={(e) => this.redirect(e)}>
                        <Link className="nav-link" to={"/recently-uploaded"} style={{ color: "black" }}>
                            <div className="card cardborder" style={{ height: "100px" }}>
                                <div className="card-body">
                                    Recently Uploaded
                              </div>
                            </div>
                        </Link>
                    </div>     
                    <div className="col-lg-2"></div>               
                </div>
            </div>
        )
    }
}
