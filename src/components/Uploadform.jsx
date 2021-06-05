import React, { Component } from 'react'
import "./css/uploadfrom.css"
import imgleft from "../img/Illus.png"
import firebase from "../database/firebase"
import axios from 'axios';
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default class Uploadform extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            description: "",
            file: "",
            shuffle: "",
            category: "",
            newcategory: ["Color", "Fruits", "Vegetables"],
            modalShow: false,
            msg: "Please Wait...",
            submitbtn: false
        }
        const { userid } = this.state
        if (userid == null) {
            window.location.replace("/")
        }
    }
    handleChange = (event) => {
        const { name, value } = event.target
        if (name === "file") {
            this.setState({
                [name]: event.target.files[0]
            })
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
        const { category, description, file, shuffle } = this.state
        if (shuffle > 22) {

            toast.error("Shuffle more than 22 Not Accepted.. ", {
                autoClose: 1000,
                transition: Slide
            })
          
        } else {
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
            await axios.post("http://168.119.159.183:4500/shuffle/send", { pptdatas }, {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                const shuffledpptid = await res.data
                window.location.replace(`/shuffledppt/${shuffledpptid}`)
            })
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
            const path = `${userid}/shuffledppts/`
            const formData = await new FormData()
            await formData.append("myFile", file)
            await formData.append("shuffle", Number(shuffle))
            await axios.post("http://168.119.159.183:4500/shuffle-ppt/uploadfile", formData, {
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
        const pptUploader = new Promise(async (resolve, reject) => {
            const urls = []
            for (var i = 0; i < file.length; i++) {
                var storageRef = firebase.storage().ref(path + file[i].filename);
                await storageRef.putString(file[i].file, 'data_url').then(async (snapshot) => {
                    await this.setState({
                        msg: `${i + 1}/${file.length} Your Shuffled PPT Uploading...`
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
        const { newcategory, category, modalShow, submitbtn, msg } = this.state
        if (submitbtn !== false) {
            toast.info(msg, {
                autoClose: 10000,
                transition: Slide
            })
        }
        return (
            <React.Fragment>

                <div className="row container" id="bodycontent">
                    <div className="col-md-8" id="firstpart">
                        <img src={imgleft} alt="" id="leftimg" />
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-3 shadow p-3 mb-5 bg-white rounded" id="secondpart">
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
                        <div className="form-group mt-5" style={{ marginLeft: "12px", width: "100%", border: "none" }}>
                            {/* <label htmlFor="password" id="deslabel">Description</label><br /> */}
                            <textarea
                                id="Description"
                                name="description"
                                type="Description"
                                maxLength="100"
                                placeholder="Enter Description"
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: "-26px", marginTop: "-20px" }}>
                            {/* <label htmlFor="password" id="shulabellabel">Number of Shuffle</label> */}
                            <input
                                className="form-control"
                                id="shuffle"
                                name="shuffle"
                                type="shuffle"
                                placeholder="Enter Number of Shuffle"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group mt-5 mb-2" style={{ marginBottom: "-26px" }}>
                            <label htmlFor="comment" id="pptlabel"> Upload PPT:</label><br />
                            <input type="file" placeholder="Upload PPT" name="file"
                                onChange={this.handleChange} />
                        </div>
                        {
                            submitbtn === false ? <button className="btn btn-success btn-block submit" onClick={this.handleSubmit}>Submit</button> : <button className="btn btn-success btn-block submit" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading...</button>
                        }
                    </div>
                </div>

                <div className={`modal fade ${modalShow ? "show form1modal" : null}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
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

            </React.Fragment>
        )
    }
}
