import axios from 'axios'
import React, { Component } from 'react'
import { Link } from "react-router-dom"
// import "./admin.css"
export default class home extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            admin: false,
            users: 0,
            shuffledppts: 0,
            uploadedppts: 0
        }

    }
    componentDidMount = async () => {
        const { userid } = this.state
        if (userid !== null) {
            await axios.get(`${process.env.REACT_APP_SERVER}/admin`, {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                if (res.data !== true) {
                    window.location.replace("/")
                } else {
                    this.setState({
                        admin: true
                    })
                    const getusers = await this.getUsers(userid, res.data)
                    const getshuffleppts = await this.getShuffleppts(userid, res.data)
                    const getuploadedppts = await this.getUploadedppts(userid, res.data)
                    this.setState({
                        users: getusers,
                        shuffledppts: getshuffleppts,
                        uploadedppts: getuploadedppts
                    })
                }
            })
        }

    }
    getUsers = async (userid, admin) => {
        const getUsers = new Promise(async (resolve, reject) => {
            await axios.get(`${process.env.REACT_APP_SERVER}/admin/users`, {
                headers: {
                    userid: userid,
                    admin: admin
                }
            }).then((res) => {
                resolve(res.data.length)
            })
        })
        return await getUsers
    }
    getShuffleppts = async (userid, admin) => {
        const getUsers = new Promise(async (resolve, reject) => {
            await axios.get(`${process.env.REACT_APP_SERVER}/admin/shuffledppt`, {
                headers: {
                    userid: userid,
                    admin: admin
                }
            }).then((res) => {
                resolve(res.data.length)
            })
        })
        return await getUsers
    }
    getUploadedppts = async (userid, admin) => {
        const getUsers = new Promise(async (resolve, reject) => {
            await axios.get(`${process.env.REACT_APP_SERVER}/admin/uploadedppt`, {
                headers: {
                    userid: userid,
                    admin: admin
                }
            }).then((res) => {
                resolve(res.data.length)
            })
        })
        return await getUsers
    }
    render() {
        const { users, shuffledppts, uploadedppts } = this.state
        const btnview = {
            width: "80px",
            height: "45px",
            background: "#7c37fa",
            border: "2px solid #7c37fa ",
            outline: "0",
            color: "#fff",
            justifyContent: "center",
            textTransform: "uppercase",
            fontSize: "10px",
            fontWeight: "700",
            borderRadius: "50px",
            letterSpacing: "1px",
            textShadow: "1px 1px 1px rgba(0, 0, 0, .3)",
            boxShadow: "0 0 5px 5px rgba(238, 58, 183, .2)",
            cursor: "pointer",
            transition: " all .25s",
        }
        return (
            <div className="container">

                <div className="row mt-5">
                    <div className="col-md-4 col-12">
                        <div className="card shadow-lg p-3 mb-5 bg-white rounded" >
                            <div className="card-body text-center">
                                <h4>No Of Users</h4>
                                <h4>{users}</h4>
                                <button className="btnview" style={btnview} ><Link style={{ color: "white", textDecoration: "none" }} to="/admin/users">View</Link></button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                            <div className="card-body text-center">
                                <h4>No Of Uploded PPT</h4>
                                <h4>{uploadedppts}</h4>
                                <button className="btnview" style={btnview} ><Link style={{ color: "white", textDecoration: "none" }} to="/admin/uploadppts">View</Link></button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                            <div className="card-body text-center">
                                <h4>No Of Shuffled PPT</h4>
                                <h4>{shuffledppts}</h4>
                                <button className="btnview" style={btnview} ><Link style={{ color: "white", textDecoration: "none" }} to="/admin/shuffledppts">View</Link></button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
