import React, { Component } from 'react'
import firebase from "../database/firebase"
import "./css/table.css"
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import sweetalert from "sweetalert2"
const db = firebase.firestore()
export default class Shuffledppt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shuffledpptid: null,
            pptdata: null,
            pptdataid: null,
            editremainder: 0,
            editdate: null,
            btntoggle: false,
            datetogle: 0
        }
    }
    componentDidMount = () => {
        const { match } = this.props
        const shuffledpptid = match.params.id
        db.collection("remainder-ppt").where("docid", "==", shuffledpptid).get().then((snap) => {
            var data = [], dataid = []
            snap.forEach((doc) => {
                data.push(doc.data())
                dataid.push(doc.id)
            })
            this.setState({
                pptdata: data,
                pptdataid: dataid,
                shuffledpptid: shuffledpptid
            })
        })
    }
    downloadbtn = async (event, pptdata, id) => {
        const date = new Date()
        const months = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        const today = date.getDate() + "-" + (months[date.getMonth() + 1]) + "-" + date.getFullYear()
        const { category, docid, shuffled_ppt } = pptdata
        const userid = localStorage.getItem("userid")
        if (userid === null) return
        toast.error("please login", {
            autoClose: 1000,
            transition: Slide
        })
        sweetalert.fire({
            title: '1 Credits For Download Your Shuffled PPT',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Okay`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payments = await db.collection("users").doc(userid).collection("payments").doc(userid)
                const getamount = await payments.get().then((doc) => {
                    if (doc.data() === undefined) return false
                    if (doc.data().amount <= 10) {
                        toast.info(`Your Credits ${doc.data().amount} Very Low`, {
                            autoClose: 30000,
                            transition: Slide
                        })
                        return false
                    } else {
                        return doc.data().amount
                    }
                })
                console.log(getamount);
                if (getamount === false) return toast.warning(`Please Purchase Credits`, {
                    autoClose: 30000,
                    transition: Slide
                })
              await payments.update({
                    amount: Number(getamount) - Number(1)
                }).then(() => {
                    db.collection("users").doc(userid).collection("downloadppt").doc().set({
                        date: today,
                        category: category,
                        docid: docid,
                        pptid: `Shuffled PPT ${id}`,
                        credits: 1
                    })
                    sweetalert.fire('Your PPT Is Ready For Downloading', '', 'success').then((results) => {
                        if (results.isConfirmed) {
                            window.open(shuffled_ppt)
                        }
                    })

                })

            } else if (result.isDenied) {
                sweetalert.fire('Thank You For Comming', '', 'info')
            }
        })
    }

    editremainter = (e, remainerid) => {
        this.setState({
            editremainder: remainerid
        })
    }
    handlechange = (e) => {
        const date = e.target.value
        var dates = date.split("-")
        this.setState({
            editdate: `${dates[2]}-${dates[1]}-${dates[0]}`
        })
    }
    saveremainder = async (e, remainerid) => {
        const { pptdataid, editdate } = this.state
        const docid = pptdataid[remainerid]
        if (editdate != null) {
            await db.collection("remainder-ppt").doc(docid).update({
                remainder: editdate
            }).then(async () => {
                toast.success("📅 Updated", {
                    autoClose: 3000,
                    transition: Slide
                })
                await this.setState({
                    editremainder: 0
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            })
        } else {
            toast.error("📅 please Select Date", {
                autoClose: 3000,
                transition: Slide
            })
        }


    }
    cancelremainder = () => {
        this.setState({
            editremainder: 0
        })
    }
    dateshow = (e, dateid) => {
        this.setState({
            datetogle: dateid
        })
    }
    render() {
        const { pptdata, editremainder } = this.state        
        return (
            <div className="container">
                <section >
                    <div className="row">
                        <div className="col-md-12 col-md-6">
                            <div className="tbl-header table-responsive">
                                <table className="table" cellPadding="0" cellSpacing="0" border="1">
                                    <thead id="tablebody">
                                        <tr>
                                            <th>Sl.No</th>
                                            <th>Category</th>
                                            <th>Uploaded Date</th>
                                            <th>Schedule Date</th>
                                            <th>Description</th>
                                            <th>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            pptdata != null ? pptdata.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.category}</td>
                                                    <td>{data.date}</td>
                                                    <td>{editremainder === index + 1 ? <input type='date' className="form-control" name="editdate" onChange={(e) => this.handlechange(e)} style={{ marginBottom: "10px" }} /> : data.remainder} {editremainder === index + 1 ? <button className='btn3' onClick={() => this.saveremainder(this, (index))}>Save</button> : <i className="fa fa-pencil-square-o" aria-hidden="true" style={{ cursor: "pointer" }} onClick={() => this.editremainter(this, (index + 1))}></i>} {editremainder === index + 1 ? <button className='btn2' onClick={() => this.cancelremainder(this, (index))}>Cancel</button> : null} </td>
                                                    <td>{data.description}</td>
                                                    <td><a href="##" className="btn1" onClick={() => this.downloadbtn(this, data, (index + 1))}>Shuffled PPT {index + 1}</a></td>

                                                </tr>
                                            )) : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}


