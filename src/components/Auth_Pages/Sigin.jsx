import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import firebase from '../../database/firebase'
import * as Yup from 'yup';
import "../style.css"
import login from "../../img/signup.png"
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
class Sigin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            userid: localStorage.getItem("userid")
        }
    }
    componentWillMount = () => {
        const { userid } = this.state
        if (userid != null) {
            this.props.history.push("/home")
        }
    }
    sendDatabase = (formData) => {
        toast.info("🕐 Please Wait...", {
            autoClose: 3000,
            transition: Slide
        })
        const { email, password, name } = formData
        const db = firebase.firestore()
        const auth = firebase.auth()
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                db.collection("users").doc(user.uid).set({
                    email: email,
                    pwd: password,
                    userid: user.uid,
                    name: name,
                    role: "user"
                }).then(() => {
                    toast.success("🕐 Account Created Successfully..", {
                        autoClose: 3000,
                        transition: Slide
                    })
                    var date = new Date();
                    var cdate = date.toLocaleString('en-US', { hour12: true })
                    console.log(cdate);
                    db.collection("users").doc(user.uid).collection("account_create").doc(user.uid).set({
                        date: cdate,
                        userid: user.uid
                    }).then(() => {
                        localStorage.setItem("userid", user.uid)
                        window.location.replace("/home")
                    })
                })
            })
            .catch((error) => {
                var errorMessage = error.message;
                toast.error(errorMessage, {
                    autoClose: 30000,
                    transition: Slide
                })
            });

    }
    googleBtn = () => {
        const db = firebase.firestore()
        const auth = firebase.auth()
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {

                var credential = result.credential;

                var token = credential.accessToken;
                var user = result.user;
                console.log(user, token)
                db.collection("users").doc(user.uid).set({
                    email: user.email,
                    userid: user.uid,
                    dppic: user.photoURL,
                    role: "user"
                }).then(() => {
                    toast.success("🕐 Account Created Successfully..", {
                        autoClose: 3000,
                        transition: Slide
                    })
                    var date = new Date();
                    var cdate = date.toLocaleString('en-US', { hour12: true })
                    console.log(cdate);
                    db.collection("users").doc(user.uid).collection("account_create").doc(user.uid).set({
                        date: cdate,
                        userid: user.uid
                    }).then(() => {
                        localStorage.setItem("userid", user.uid)
                        window.location.replace("/home")
                    })
                })
            }).catch((error) => {
                var errorMessage = error.message;
                toast.error(errorMessage, {
                    autoClose: 30000,
                    transition: Slide
                })
            });
    }
    render() {
        return (
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                    cpassword: "",
                    name: ""
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().matches(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, 'Invalid Email')
                        .required('Email is required'),
                    password: Yup.string().min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                    cpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required'),
                    name: Yup.string().required("User Name Is Required")
                })}
                onSubmit={formData => {
                    this.setState({
                        formData: formData
                    })
                    this.sendDatabase(formData)
                }}
                render={({ errors, status, touched }) => (
                    <div className="row container" id="bodycontent" style={{ marginTop: "40px" }}>
                        <div className="col-md-2"></div>
                        <div className="col-md-3">
                            <Form>
                                <h4 className="text-center">Sign Up</h4>

                                <div className="email-login">

                                    <label htmlFor="email"> <b>User Name</b></label>
                                    <Field name="name" type="text" id="uname" className={'form-control mb-1' + (errors.name && touched.name ? ' is-invalid' : '')} placeholder="Enter Your Name" />
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />

                                    <label htmlFor="psw"><b>Email</b></label>
                                    <Field name="email" type="email" id="email" className={'form-control mb-1' + (errors.email && touched.email ? ' is-invalid' : '')} placeholder="Enter Your Email" />
                                    <ErrorMessage name="email" component="div" className="invalid-feedback" />

                                    <label htmlFor="psw"><b>Password</b></label>
                                    <Field name="password" type="password" id="password" className={'form-control mb-1' + (errors.password && touched.password ? ' is-invalid' : '')} placeholder="Password" />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />

                                    <label htmlFor="psw"><b>Confirm Password</b></label>
                                    <Field name="cpassword" type="password" id="cpassword" className={'form-control mb-1 mt-2' + (errors.cpassword && touched.cpassword ? ' is-invalid' : '')} placeholder="Confirm Password" />
                                    <ErrorMessage name="cpassword" component="div" className="invalid-feedback" />

                                </div>




                                <div className="form-group">
                                    <button className="btn btn-primary mt-4" style={{ marginBottom: "20px" }} id="signin" type="submit">Sign Up</button>
                                </div>

                            </Form>
                            <center>---- OR ----</center>
                            <div id="socialicon">
                                <button className="btn-btn-primary" id="facebook"><i className="fa fa-facebook"></i> Facebook</button>
                                <button className="btn-btn-primary" id="google" onClick={this.googleBtn}><i className="fa fa-google"></i> Google</button>
                            </div>
                            <p id="signupbtn">Already Have Account ?<a href={"/"} id="signupword"> Sign In</a></p>
                        </div>
                        <div className="col-md-2"></div>

                        <div className="col-md-4 mt-5">
                            <img src={login} alt="" width="auto" id="loginimg" style={{ marginTop: "10px" }} />
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                )}


            />
        );
    }
}

export default Sigin;