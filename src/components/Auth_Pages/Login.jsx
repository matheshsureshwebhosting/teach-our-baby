import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import firebase from '../../database/firebase'
import * as Yup from 'yup';
import "../style.css";
import login from "../../img/login.png"
import { Link } from "react-router-dom"
import { toast,Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
toast.configure()
class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            userid: localStorage.getItem("userid")
        }
    }
    componentDidMount = () => {        
        const { userid } = this.state
        if (userid != null) {
            this.props.history.push("/home")
        }
    }
    sendDatabase = (formData) => {
        toast.info("🕐 Please Wait...",{
            autoClose: 3000,
            transition:Slide
        })
        const { email, password } = formData
        const db = firebase.firestore()
        const auth = firebase.auth()
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {

                var user = userCredential.user;
                localStorage.setItem("userid", user.uid)
                var date = new Date();
                var cdate = date.toLocaleString('en-US', { hour12: true })
                db.collection("users").doc(user.uid).collection("login_activity").doc().set({
                    date: cdate,
                    userid: user.uid
                }).then(() => {
                    db.collection("users").doc(user.uid).update({
                        lastlogin: cdate
                    }).then(() => {
                        window.location.replace("/home")
                    })
                })
            })
            .catch((error) => {                
                var errorMessage = error.message;             
                toast.error(errorMessage,{
                    autoClose: 30000,
                    transition:Slide
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
                    role:"user"
                }).then(() => {
                    localStorage.setItem("userid", user.uid)
                    var date = new Date();
                    var cdate = date.toLocaleString('en-US', { hour12: true })
                    console.log(cdate);
                    db.collection("users").doc(user.uid).collection("login_activity").doc(user.uid).set({
                        date: cdate,
                        userid: user.uid
                    }).then(() => {
                        window.location.replace("/home")
                    })
                })
            }).catch((error) => {                
                var errorMessage = error.message;                              
                toast.error(errorMessage,{
                    autoClose: 30000,
                    transition:Slide
                })
            });
    }

    render() {
        return (
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().matches(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, 'Invalid Email')
                        .required('Email is required'),
                    password: Yup.string().min(6, 'Password must be at least 6 characters')
                        .required('Password is required')
                })}
                onSubmit={formData => {
                    this.sendDatabase(formData)
                }}
                render={({ errors, status, touched }) => (
                    <React.Fragment>
                        <div className="row container" id="bodycontent">
                            <div className="col-md-2"></div>
                            <div className="col-md-3">
                                <Form id="formdiv">
                                    <h4 className="text-center mb-3">Sign In</h4>
                                    <div className="email-login">
                                        <label htmlFor="email"> <b>Email</b></label>
                                        <Field name="email" type="email" id="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} placeholder="Enter Your Email" />
                                        <ErrorMessage name="email" id="erroremail" component="div" className="invalid-feedback" />
                                        <label htmlFor="psw"><b>Password</b></label>
                                      <Field name="password" type="password" id="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} placeholder="Password" />
                                        <ErrorMessage style={{marginTop:"-5px"}} name="password" component="div" className="invalid-feedback" />
                                    </div>
                                    <Link to="/forgot" id="forgottext" className="mt-1">Forgot Your Password ?</Link>
                                    <div className="form-group">
                                        <button className="btn btn-primary" id="signin" type="submit">Sign In</button>
                                    </div>
                                </Form>
                                <center className="mt-5">---- Or ----</center>
                                <div id="socialicon">
                                    <button className="btn-btn-primary" id="facebook"><i className="fa fa-facebook"></i> Facebook</button>
                                    <button className="btn-btn-primary" id="google" onClick={this.googleBtn}><i className="fa fa-google"></i> Google</button>
                                </div>
                                <p id="signupbtn">Don't  Have Account ?<a href={"/signup"} id="signupword"> Sign Up</a></p>
                            </div>
                            <div className="col-md-2"></div>

                            <div className="col-md-4 mt-5">
                                <img src={login} alt="" id="loginimg" width="auto" />
                            </div>
                            <div className="col-md-1"></div>
                        </div>
                    </React.Fragment>
                )}


            />
        );
    }
}

export default Login;