import React, { Component } from 'react'
import axios from 'axios'
import { menus } from "../../helpers/menu"
import { Link, NavLink } from "react-router-dom"
import logo from "../../img/logo__1_-removebg-preview.png"
import leaf from "../../img/leaf.png"
import icon from "../../img/magician-hat.png"
import crown from "../../img/Group 5.png"
import upgrade from "../../img/upgrade.png"
import "./Header.css"
import firebase from '../../database/firebase'
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import profile from '../../img/profilepic.png'
const db = firebase.firestore()
export default class Headers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: localStorage.getItem("userid"),
            username: localStorage.getItem("name"),
            dpimage: null,
            name: null,
            credits: 0,
        }
    }

    copyref = () => {
        const { userid } = this.state
        if (userid !== null) {
            axios.post(`${process.env.REACT_APP_SERVER}/referral/create`, {}, {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                const url = await res.data
                var input = document.body.appendChild(document.createElement("input"))
                input.value = url;
                input.focus();
                input.select();
                document.execCommand('copy');
                input.parentNode.removeChild(input);
                toast.info(`Link Copied`, {
                    autoClose: 10000,
                    transition: Slide
                })
            })
        }
    }

    componentDidMount = () => {
        const { userid } = this.state
        if (userid !== null) {
            db.collection("users").doc(userid).get().then((doc) => {
                if (doc.data() !== undefined && doc.data().dppic !== undefined) {
                    this.setState({
                        dpimage: doc.data().dppic
                    })
                }
            })
            db.collection("users").doc(userid).get().then((doc) => {
                if (doc.data() !== undefined) {
                    this.setState({
                        name: doc.data().name
                    })
                }
            })
        }
        // get credits
        axios.get(`${process.env.REACT_APP_SERVER}/razorpay`, {
            headers: {
                userid: userid
            }
        }).then((res) => {
            if (res.data !== false) {
                const { amount } = res.data
                this.setState({
                    credits: amount
                })
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    logout = () => {
        localStorage.removeItem("userid")
        window.location.replace("/")
    }
    render() {
        const { userid, dpimage, credits } = this.state

        return (
            <nav className="navbar navbar-expand-lg navbar-light">

                <div className="container-fluid">
                    <Link className="navbar-brand" to={userid == null ? "/" : "/home"}><img src={logo} alt="" style={{ height: "7vh" }}></img><span className="heading-title"> &nbsp; Teach Our Baby</span></Link>
                   
                    

                    {


                        userid != null ? (<div className="dropdown" id="dropdowndiv">
                            <a href={"javascipt:void(0)"} id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={dpimage !== null ? dpimage :profile } width="40" height="40" className="rounded-circle" alt="" />
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={{boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.1)"}}>
                                <li> <h4 style={{ marginLeft: "14px", fontSize: "20px" }}>Hello {this.state.name}</h4></li>
                                <li> <h6 style={{ marginLeft: "14px", cursor:"pointer"}}>Credit : {credits}</h6></li>
                                <li className="dropdown-item" style={{ textAlign: "left" }} data-bs-toggle="modal" data-bs-target="#exampleModal" >Add Credit</li>
                                <li><Link className="dropdown-item" to="/downloadhistory" style={{ cursor: "pointer" }} >History</Link></li>
                                <li><a id="copy" href="##" className="dropdown-item" onClick={this.copyref} >Share Now</a></li>
                                <li><Link to="/contact" className="dropdown-item" >Contact Now</Link></li>
                                <li><a className="dropdown-item" href="##" onClick={this.logout} style={{ cursor: "pointer" }} >Log Out</a></li>

                            </ul>
                        </div>) : null
                    }


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" id="pricemodel" style={{ backgroundColor: "none" }}>
                            <div className="modal-body">
                                <div className="card mb-5 mb-lg-0 rounded-lg shadow pricecard">
                                    <div className="card-body bg-light rounded-bottom">
                                        <div className="text-center crownimg">
                                            <img src={crown} alt="" width="50" />
                                            <h5>Premium</h5>
                                        </div>
                                        <ul className="list-unstyled mb-4 mt-5">
                                            <li className="mb-3"><span className="mr-3"><i
                                                className="fa fa-check text-success"></i></span> Sync on multiple devices</li>
                                            <li className="mb-3"><span className="mr-5"><i className="fa fa-check text-success"></i></span> Access notebook in offline mode</li>
                                            <li className="mb-3"><span className="mr-3"><i
                                                className="fa fa-check text-success"></i></span> <span>Search in documents and attachments</span></li>
                                            <li className="mb-3"><span className="mr-3"><i
                                                className="fa fa-check text-success"></i></span> Annotate PDF files</li>
                                            <li className="mb-3"><span className="mr-3"><i
                                                className="fa fa-check text-success"></i></span> Scan and digitize business Cards</li>
                                        </ul>
                                        <div className="text-center mb-3">
                                            <h4>₹ 50 <span className="month">Per month</span></h4>
                                        </div>
                                        <button onClick={() => this.payAmount("Basic", 50)} value="Select" className="btn btn-block text-uppercase rounded-lg py-3 paybtn">Select</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav justify-content-end" style={{ width: "95%" }}>


                            {
                                menus.map((menu, index) => (
                                    <li className="nav-item" key={index}>
                                        {
                                            // userid ===null ? menu.name === "Dashboard" ? null : <NavLink className="nav-link" exact activeClassName="activenav" to={menu.path} ><span><img src={leaf} className="leafimg" alt=""/></span>{menu.name}</NavLink> : <NavLink className="nav-link" exact activeClassName="activenav" to={menu.path} ><span><img src={leaf} className="leafimg" alt=""/></span>{menu.name}</NavLink>
                                            userid === null ? null : menu.name === "Upload" ? <button className="uploadbtn"><NavLink className="nav-link nav-button" exact activeClassName="activenav" to={menu.path} ><span><i className="fa fa-plus" style={{ marginRight: "5px" }} aria-hidden="true"></i></span>{menu.name}</NavLink></button> : <NavLink className="nav-link" exact activeClassName="activenav" to={menu.path} ><span><img src={leaf} className="leafimg" alt="" /></span>{menu.name}</NavLink>}

                                    </li>
                                ))
                            }

                        </ul>
                    </div>

                </div>
            </nav>
        )
    }
}
