import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
// import firebase from '../../database/firebase'
import * as Yup from 'yup';
import "../css/forgot.css";
import imgleft from "../../img/Illus.png"
import Verificationcode from '../Auth_Pages/Verificationcode'
import axios from 'axios'
import { toast, Slide } from "react-toastify"


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: null,
            isemail: false
        }
    }
    checkemail = async (email) => {
        console.log(email)
        await axios.post("http://168.119.159.183:4500/forgot", {
            email: email
        }).then((res) => {
            if (res.data === true) {
                this.setState({
                    isemail: true
                })
            } else {
                toast.error("Please Check Email", {
                    autoClose: 1000,
                    transition: Slide
                })
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    render() {
        const { formData, isemail } = this.state
        return (
            <Formik
                initialValues={{
                    email: "",
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, 'Invalid Email')
                        .required('Email is required')
                })}
                onSubmit={formData => {
                    this.setState({
                        formData: formData
                    })
                    this.checkemail(formData.email)
                }}
                render={({ errors, status, touched }) => (

                    <React.Fragment>

                        {
                            !isemail ? <div className="row container" id="bodycontent" style={{ marginTop: "40px" }}>
                                <div className="col-md-2"></div>
                                <div className="col-md-5" id="firstpart">
                                    <img src={imgleft} alt="" id="leftimg" />
                                </div>
                                <div className="col-md-3" id="secondpart">
                                    {/* <a href="javascipt:void(0)"><i className="fa fa-chevron-left" id="before"></i></a> */}
                                    <h4 className="text-center mb-3">Forgot Password</h4>
                                    <p className="mb-2 content">Enter <span className="colortext">your email address</span> to reset your password.</p>
                                    <Form>
                                        {/* <label htmlFor="email"> <b>Email</b></label> */}
                                        <input name="email" type="email" id="email1" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} placeholder="Enter Your Email" />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        <button className="btn btn-primary mb-5 mt-2" type="submit" id="forgot">Send</button>
                                    </Form>
                                </div>
                            </div> : <Verificationcode email={formData.email} />
                        }
                    </React.Fragment>

                )}


            />
        );
    }
}

export default Login;