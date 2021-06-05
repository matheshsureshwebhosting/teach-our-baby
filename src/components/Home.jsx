import React, { Component } from 'react'
import axios from 'axios'
import icon from "../img/magician-hat.png"
import crown from "../img/Group 5.png"
import upgrade from "../img/upgrade.png"
import "./css/home.css";
import { Link } from "react-router-dom"
import firebase from "../database/firebase"
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
const db = firebase.firestore()
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem("userid"),
            credits: 0,
            recentupload: null,
            remainters: null,
            remainderdates: null,
            description: "",
            file: "",
            shuffle: "",
            category: "",
            newcategory: ["Color", "Fruits", "Vegetables"],
            modalShow: false,
            submitbtn: false,
            name: null,
            barcount: 0,
            progressbar: false
        }
        this.primaryRef = React.createRef();
        const { userid } = this.state
        if (userid == null) {
            window.location.replace("/")
        }
    }

    async componentDidMount() {
        const { userid } = this.state
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);


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

        this.recentuploads(userid)
        db.collection("remainder-ppt").get().then((snap) => {
            const data = [], remainderdate = []
            snap.forEach((doc) => {
                if (doc.data() !== undefined && doc.data().userid === userid) {
                    const dates = doc.data().remainder
                    remainderdate.push(dates)
                    const datesplid = dates.split("-")
                    data.push({
                        date: `${datesplid[2]}-${datesplid[1].length === 1 ? `0${datesplid[1]}` : datesplid[1]}-${datesplid[0]}`,
                        title: doc.data().category
                    })
                }
            })
            this.setState({
                remainters: data,
                remainderdates: remainderdate
            })
        })
        db.collection("users").doc(userid).get().then((doc) => {
            if (doc.data() !== undefined) {
                this.setState({
                    name: doc.data().name
                })
            }
        })
    }

    recentuploads = async (userid) => {
        await axios.get(`${process.env.REACT_APP_SERVER}/recentuploads`, {
            headers: {
                userid: userid
            }
        }).then(async (res) => {
            const data = await res.data
            this.setState({
                recentupload: data
            })
        })
    }


    payAmount = (plan, amount) => {
        const { userid } = this.state
        axios.post(`${process.env.REACT_APP_SERVER}/razorpay/pay`, {
            plan: plan,
            amount: amount
        }, {
            headers: {
                userid: userid
            }
        }).then(async (res) => {
            if (res.data.status === "success") {
                const id = await res.data.sub.id
                this.pay(id, plan, amount)
            } else {
                toast.error("Payment Error", {
                    autoClose: 1000,
                    transition: Slide
                })
            }
        }).catch((error) => {
            if (error.message === "Network Error") {
                toast.error("Server Not Connect", {
                    autoClose: 1000,
                    transition: Slide
                })
            }
        })
    }
    pay = (id, plan, amount) => {
        var date = new Date();
        var cdate = date.toLocaleString('en-US', { hour12: true })
        const { userid } = this.state
        console.log(id, plan);
        var options = {
            "key": process.env.REACT_APP_RAZORPAY_KEY_ID_TEST,
            "currency": "INR",
            "name": "Razorpay",
            "description": "Plan Subcription",
            "image": "https://previews.123rf.com/images/subhanbaghirov/subhanbaghirov1605/subhanbaghirov160500087/56875269-vector-light-bulb-icon-with-concept-of-idea-brainstorming-idea-illustration-.jpg",
            "order_id": id,
            "handler": async function (response) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response
                await axios.post(`${process.env.REACT_APP_SERVER}/razorpay/send`, {
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    amount: amount,
                    plan: plan,
                    userid: userid,
                    date: cdate
                }, {
                    headers: {
                        userid: userid
                    }
                }).then((res) => { window.location.reload() })
            },
            "theme": {
                "color": "#227254"
            }
        };
        var rzp = new window.Razorpay(options);
        rzp.open();
    }

    shuffledppts = (e, pptid) => {
        window.location.replace(`/shuffledppt/${pptid}`)
    }
    calenderview = () => {
        window.location.replace("/calendar")
    }
    openremainder = (date) => {
        window.location.replace(`/remainders/${date}`)
    }


    //form class

    handleChange = (event) => {

        const { name, value } = event.target
        if (name === "file") {
            this.setState({
                [name]: event.target.files[0]
            })
            // console.log((event.load))
        } else {
            if (value === "Add") {
                this.setState({
                    modalShow: true
                })
            }
            this.setState({
                [name]: value
            })
        }
    }
    addcat = () => {
        this.setState({
            option: true
        })
        const { newcategory, category } = this.state
        const tempcat = newcategory
        tempcat.push(category)
        this.setState({
            newcategory: tempcat
        })
        this.closemodal()
    }
    closemodal = () => {
        this.setState({
            modalShow: false
        })
    }

    handleSubmit = async () => {
        const userid = localStorage.getItem("userid")
        if (userid === null) {
            toast.error("Please Login", {
                autoClose: 1000,
                transition: Slide
            })
        } else {
            const { category, description, file, shuffle } = this.state
            var filetype = file.name.split(".")
            if (category !== "" && description !== "" && file !== "") {
                if (shuffle > 22) {
                    toast.error("Maximum Number Of Shuffles Only 21", {
                        autoClose: 50000,
                        transition: Slide
                    })
                } else {
                    if (filetype[1] === "pptx") {
                        this.setState({
                            submitbtn: true
                        })
                        console.log(file);
                        const originalppturl = await this.getOriginalppturl(file, userid)
                        const getshuffleppturl = await this.getShuffleppturl(file, userid, shuffle)
                        console.log(getshuffleppturl);
                        const pptdatas = await {
                            category: category,
                            description: description,
                            shuffle: Number(shuffle),
                            shuffled_ppt: getshuffleppturl,
                            original_ppt: originalppturl
                        }
                        console.log(pptdatas);
                        await axios.post(`${process.env.REACT_APP_SERVER}/shuffle/send`, { pptdatas }, {
                            headers: {
                                userid: userid
                            }
                        }).then(async (res) => {
                            const shuffledpptid = await res.data
                            window.location.replace(`/shuffledppt/${shuffledpptid}`)
                        })
                    } else {
                        toast.error("Upload File Format should .pptx only", {
                            autoClose: 3000,
                            transition: Slide
                        })
                    }
                }
            }
        }
    }
    getOriginalppturl = async (file, userid) => {
        const path = `${userid}/originalppts/`
        const getOriginalppturl = new Promise(async (resolve, reject) => {
            var storageRef = firebase.storage().ref(path + file.name);
            await storageRef.put(file).then(async function (snapshot) {
                console.log('Uploaded a blob or file!');
                await storageRef.getDownloadURL().then(function (url) {
                    resolve(url)
                })
            });
        });
        return await getOriginalppturl
    }
    getShuffleppturl = async (file, userid, shuffle) => {
        const getShuffleppturl = new Promise(async (resolve, reject) => {
            const path = `${userid}/originalppts/`
            const formData = await new FormData()
            await formData.append("myFile", file)
            await formData.append("shuffle", Number(shuffle))
            await axios.post(`${process.env.REACT_APP_SERVER}/shuffle-ppt/uploadfile`, formData, {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                console.log(res.data);
                const originalppt = await this.pptUploader(path, res.data)
                if (originalppt.length !== 0) {
                    return resolve(originalppt)
                } else {
                    return resolve(false)
                }
            })
        })
        return await getShuffleppturl
    }
    pptUploader = async (path, file) => {
        this.setState({
            progressbar: true
        })
        toast.info("Please Wait...", {
            autoClose: 5000,
            transition: Slide
        })
        const pptUploader = new Promise(async (resolve, reject) => {
            const urls = []
            for (var i = 0; i < file.length; i++) {
                this.setState({
                    barcount: 25
                })
                var storageRef = firebase.storage().ref(path + file[i].filename);
                await storageRef.putString(file[i].file, 'data_url').then(async (snapshot) => {
                    this.setState({
                        barcount: 50
                    })
                    var progress = await (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast.info(`${i + 1}/${file.length} Your Shuffled PPT Uploading...`, {
                        autoClose: 5000,
                        transition: Slide
                    })
                    this.setState({
                        barcount: progress
                    })
                    await storageRef.getDownloadURL().then(function (url) {
                        urls.push(url)
                    })
                });
            }
            resolve(urls)
        })
        return await pptUploader
    }
    render() {
        const { newcategory, category, modalShow, submitbtn, progressbar, barcount } = this.state
        const { recentupload } = this.state
        const data = []
        if (recentupload != null) {
            for (var i = 0; i < 3; i++) {
                if (recentupload[i] !== undefined) {
                    data.push(recentupload[i])
                }
            }
        }
        return (
            <div className="container mt-5">
                <div className="row">

                    <div className="col-md-4" id="formdiv">
                        <div className="col-md-6">
                            <div id="secondpart" style={{ width: "320px", marginLef: "auto", marginRight: "auto", marginBottom: "3em", boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.1)", padding: "1.8rem" }}>
                                <h4 style={{ textAlign: "center" }}>Upload PPT</h4><br />
                                {/* <a href="javascipt:void(0)"><i className="fa fa-chevron-left" id="before"></i></a> */}
                                <div className="form-group" style={{ marginBottom: "-26px" }}>
                                    {/* <label htmlFor="dname" id="catlabel">Category</label> */}
                                    <select name="category" id="category" multiple={false}
                                        onChange={this.handleChange}
                                        className="form-control">
                                        <option value="none">Choose Category</option>
                                        {
                                            newcategory.map((data, index) => {
                                                if (category === data) {
                                                    return <option defaultValue={data} selected key={index}>{data}</option>
                                                } else {
                                                    return <option defaultValue={data} key={index}>{data}</option>
                                                }
                                            })
                                        }
                                        <option value="Add">Add category</option>
                                    </select>
                                </div>
                                <div id="formmobile" className="form-group mt-5" style={{ marginBottom: "39px", width: "100%", border: "none" }}>
                                    <textarea
                                        id="Description"
                                        name="description"
                                        type="Description"
                                        placeholder="Enter Description"
                                        onChange={this.handleChange}
                                        maxLength="200"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: "-26px", marginTop: "-20px" }}>
                                    {/* <label htmlFor="password" id="shulabellabel">Number of Shuffle</label> */}
                                    <input
                                        className="form-control"
                                        id="shuffle"
                                        name="shuffle"
                                        type="shuffle"
                                        maxLength="100"
                                        placeholder="Enter Number of Shuffle"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group mt-5 mb-2" style={{ marginBottom: "-26px" }}>
                                    <br />
                                    <label htmlFor="file" className="form-control" style={{ marginLeft: "0px", marginTop: "-20px", backgroundColor: "#dee2e66e" }}>{this.state.file === "" ? "Choose File" : this.state.file.name}</label>
                                    <input type="file" placeholder="Upload PPT" name="file" id="file"
                                        onChange={this.handleChange} style={{ display: "none" }} />
                                    {
                                        progressbar ? <div className="progress" style={{ marginTop: "10px" }}>
                                            <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: `${barcount}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div> : null
                                    }

                                </div>
                                {
                                    submitbtn === false ? <button className="btn btn-success btn-block submit" onClick={this.handleSubmit}>Submit</button> : <button className="btn btn-success btn-block submit" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading...</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2"></div><br></br>
                    <div className="col-md-4">
                        {/* <div className="row mt-3 mb-2" id="creditdiv">
                            <div className="col-md-3 col-3">
                                <img src={credits === 0 ? icon : crown} alt="" id="iconimg" />
                            </div>
                            <div className="col-md-9 col-9" style={{ paddingTop: "21px" }}>
                                <h6 id="plan" style={{ textAlign: "left" }} data-bs-toggle="modal" data-bs-target="#exampleModal">Credit : <span>{credits}</span> <img id="crownimg" src={upgrade} alt="" /></h6>
                            </div>
                        </div> */}

                        {/* <div className="row mt-5 mb-2" id="recentdiv">
                            <div className="recentlyuploaded"><p id="recenthead" className="mb-3">Recently Uploaded</p>
                                {
                                    data.length !== 0 ? data.map((recents, index) => (
                                        <React.Fragment key={index}>
                                            <div className="card" style={{ cursor: "pointer" }} onClick={() => { this.shuffledppts(this, recents.docid) }}>
                                                <div className="card-body">
                                                    <div className={(index % 2 === 0) ? "cardcontent1" : "cardcontent"}>
                                                        <h6 className="data" >{recents.category.toUpperCase()}</h6>
                                                        <p className="data" >{recents.date}</p>
                                                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </React.Fragment>
                                    )) : <div style={{ marginLeft: "20px" }}>No Data Founded</div>
                                }
                                {
                                    recentupload != null ? recentupload.length > 3 ? <div className="mt-2 data" style={{ float: "left" }}><button className="btn btn-success btn-block submit" style={{ width: "111px" }} ><Link style={{ textDecoration: "none", color: "white" }} to="/recentuploads">View More</Link></button></div> : null : null
                                }</div>
                        </div> */}
                        <div className="row mt-5 mb-2" id="recentdiv">
                            <div className="recentlyuploaded"><p id="recenthead" className="mb-3">Recently Uploaded</p>
                                {
                                    data.length !== 0 ? data.map((recents, index) => (
                                        <React.Fragment key={index}>
                                            <div className="card" style={{ cursor: "pointer" }} onClick={() => { this.shuffledppts(this, recents.docid) }}>
                                                <div className="card-body">
                                                    <div className={(index % 2 === 0) ? "cardcontent1" : "cardcontent"}>
                                                        <h6 className="data" >{recents.category.toUpperCase()}</h6>
                                                        <p className="data" >{recents.date}</p>
                                                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </React.Fragment>
                                    )) : <div style={{ marginLeft: "20px" }}>No Data Founded</div>
                                }
                                {
                                    recentupload != null ? recentupload.length > 3 ? <div className="mt-2 data" style={{ float: "left" }}><button className="btn btn-success btn-block submit" style={{ width: "111px" }} ><Link style={{ textDecoration: "none", color: "white" }} to="/recentuploads">View More</Link></button></div> : null : null
                                }</div>
                        </div>


                        { /* <div style={{marginTop: "20px !important"}}>  <p id="recenthead" className="mb-3 mt-5">Schedules</p>
                        { 
                            sorteddate.length !== 0 ? sorteddate.map((newdate, index) => (
                                <React.Fragment key={index}>
                                    <div className="card" style={{ cursor: "pointer" }} onClick={() => { this.openremainder(`${newdate}`) }}>
                                        <div className="card-body">
                                            <div className={(index % 2 === 0) ? "cardcontent1" : "cardcontent"}>
                                                <h6 className="data">{newdate === today ? "Today" : newdate === tomorrow ? "Tomorrow" : newdate}</h6>
                                                <p className="data">Shuffled PPT</p>
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </React.Fragment>

                            ))

                                : <div>No Remainder Info</div>
                            }
                       </div>  */ }
                    </div>
                    <div className="col-md-2"></div>
                    { /* 
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-12 col-12 mt-3">
                                <div className="conta" onClick={this.calenderview} style={{ cursor: "pointer" }}>
                                    <FullCalendar id="calenderview"
                                        plugins={[dayGridPlugin]}
                                        initialView="dayGridMonth"
                                        weekends={true}
                                        events={
                                            remainters != null ? remainters : null
                                        }

                                    />
                                </div>
                            </div>
                            <div className="col-md-12 col-6" id="secondcol">
                                
                            </div>
                        </div>
                    </div>
                    */ }
                </div>
                <div>
                    <a href="/uploadppt" className="float">
                        <i className="fa fa-plus my-float"></i>
                    </a>
                </div>

                <div className="modal fade" id="exampleModalcopy" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: "none" }}>
                            <div className="modal-body">
                                <div className="card mb-5 mb-lg-0 rounded-lg shadow pricecard">
                                    <div className="card-body bg-light rounded-bottom">
                                        <div className="text-center crownimg">
                                            <h5 id="copyinform">Your Link Copied</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                <div className={`modal fade ${modalShow ? "show form1modal" : null}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" id="copymodel" style={{ backgroundColor: "white !important" }}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add New Category</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.closemodal}></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <input type="text" name="category" id="addcat" onChange={this.handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-info add" onClick={this.addcat}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}
