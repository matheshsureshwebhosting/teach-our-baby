import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from "axios"
import firebase from '../../database/firebase'
import * as Yup from 'yup';
import "../style.css";
import edit from "../../img/Illus.png"
import { toast, Slide } from "react-toastify"
import crown from "../../img/crowns.svg"
class Login extends Component {


    constructor(props) {
        super(props)
        this.state = {
            image: null,
            test: "test",
            profile: null
        }
    }

    componentDidMount = async () => {
        const userid = localStorage.getItem("userid")
        await axios.get(`${process.env.REACT_APP_SERVER}/profile`, {
            headers: {
                userid: userid
            }
        }).then((res) => {
            const { profile } = res.data
            this.setState({
                profile: profile
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    sendDatabase = async (formData) => {
        try {
            const { image } = this.state
            const { username, email } = formData
            const userid = localStorage.getItem("userid")
            const path = userid + "/profile/"
            if (image === null) throw new Error("Image Not Founded")
            const imageuploader = await this.imageUploader(image, path)
            const profile = {
                username: username,
                email: email,
                profileimg: imageuploader,
                userid: userid
            }
            await axios.post(`${process.env.REACT_APP_SERVER}/profile/create`, { profile }, {
                headers: {
                    userid: userid
                }
            }).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            })

        } catch (error) {
            toast.error(error.message, {
                autoClose: 1000,
                transition: Slide
            })
        }
    }
    imageUploader = async (image, path) => {
        return new Promise(async (resolve, reject) => {
            var storageRef = firebase.storage().ref(path + image.name);
            storageRef.put(image).then(async function (snapshot) {
                console.log('Uploaded a blob or file!');
                await storageRef.getDownloadURL().then(function (url) {
                    resolve(url)
                })
            });

        });
    }
    imgPreview = (e) => {
        this.setState({
            image: e.target.files[0]
        })
        const inputPreview = document.querySelector(".input-preview")
        const reader = new FileReader();
        reader.onload = function (e) {
            inputPreview.style.backgroundImage = "url(" + e.target.result + ")";
            inputPreview.classList.add("has-image");
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    render() {
        const { profile } = this.state
        console.log(profile);        
        return (
            <Formik
                initialValues={{
                    email: "",
                    username: "",
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, 'Invalid Email')
                        .required('Email is required'),
                    username: Yup.string().min(6, 'Username must be at least 6 characters')
                        .required('Username is required')
                })}
                onSubmit={formData => {
                    this.sendDatabase(formData)
                }}
                render={({ errors, status, touched }) => (

                    <React.Fragment>
                        <div className="row container" id="bodycontent">
                            <div className="col-md-8" id="firstpart">
                                <img src={edit} alt="" id="leftimg" />
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-3" id="secondpart">
                                <div id="formdiv">
                                    {/* <a href="javascipt:void(0)"><i className="fa fa-chevron-left" id="before"></i></a> */}
                                    <h4 className="text-center mb-6">Edit account</h4>
                                    <Form>
                                        <div className="text-center bg-light mb-5 form-group" id="imgpre">
                                            <label htmlFor="file" className="input-preview text-center"></label>
                                            <Field name="file" type="file" id="file" className='form-control' onChange={this.imgPreview} style={{ display: "none" }} />
                                            <ErrorMessage name="file" component="div" className="invalid-feedback" />
                                            <p id="unametext">Username</p>
                                            <p><img src={crown} id="crown" alt="" width="15" /><span className="colortext"> Premium</span></p>
                                        </div>
                                        <div id="formdiv2">
                                            <div className="form-group" >
                                                <Field name="username" type="text" id="email" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder="Enter Username" />
                                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <Field name="email" type="email" id="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} placeholder="Enter Your Email" />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary mb-5" id="edit">Send</button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>

                )}


            />
        );
    }
}

export default Login;