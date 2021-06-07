import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import "../style.css";
import edit from "../../img/Illus.png"
import axios from 'axios'
import firebase from "../../database/firebase"
import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
class Login extends Component {


    constructor(props) {
        super(props)
        this.state = {
            email: null
        }
    }
    codeverify = (e) => {
        const inputElements = [...document.querySelectorAll('input.code')]

        inputElements.forEach((ele, index) => {
            ele.addEventListener('keydown', (e) => {
                if (e.keyCode === 8 && e.target.value === '') inputElements[Math.max(0, index - 1)].focus()
            })
            ele.addEventListener('input', (e) => {
                const [first, ...rest] = e.target.value
                e.target.value = first ?? ''
                if (index !== inputElements.length - 1 && first !== undefined) {
                    inputElements[index + 1].focus()
                    inputElements[index + 1].value = rest.join('')
                    inputElements[index + 1].dispatchEvent(new Event('input'))
                }
            })
        })
    }
    sendbtn = () => {
        const { email } = this.state
        const number1 = document.getElementById("number1").value
        const number2 = document.getElementById("number2").value
        const number3 = document.getElementById("number3").value
        const number4 = document.getElementById("number4").value
        const code = number1 + number2 + number3 + number4
        if (code.length !== 4) {
            toast.error("Please Provide valid Code", {
                autoClose: 1000,
                transition: Slide
            })
        } else {
            axios.post(`${process.env.REACT_APP_SERVER}/forgot/verify`, {
                email: email,
                OTP: code
            }).then((res) => {
                if (res.data === true) {
                    firebase.auth().sendPasswordResetEmail(email).then(function () {
                        toast.info(`Password Reset Link sended in Email ${email}`, {
                            autoClose: 30000,
                            transition: Slide
                        })
                    })
                } else {
                    toast.info(`${res.data}`, {
                        autoClose: 10000,
                        transition: Slide
                    })
                }

            }).catch((error) => {
                console.log(error);
            })
        }
    }
    componentDidMount = () => {
        const { email } = this.props
        this.setState({
            email: email
        })
    }
    render() {
        const { email } = this.props
        console.log(email);
        return (
            <Formik
                initialValues={{
                    email: "",
                    text: "",
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, 'Invalid Email')
                        .required('Email is required'),
                    text: Yup.string().min(6, 'Username must be at least 6 characters')
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
                                    <h4 className="text-center mb-5">Verify Code</h4>
                                    <p className="mb-5">Check your email address, we have sent you the code at <span className="colortext">{email}</span></p>
                                    <Form>
                                        <div id="entercode">
                                            <input type="number" className="code" name="code1" id="number1" onChange={this.codeverify} />
                                            <input type="number" className="code" name="code2" id="number2" onChange={this.codeverify} />
                                            <input type="number" className="code" name="code3" id="number3" onChange={this.codeverify} />
                                            <input type="number" className="code" name="code4" id="number4" onChange={this.codeverify} />
                                        </div>
                                        <p className="mt-2" id="didcode">Didn't receive the code ?</p>
                                        <p id="resend"><span className="colortext">Resend</span></p>
                                        <p id="resendtime">(00:59)</p>
                                    </Form>
                                    <button className="btn btn-primary mb-5 mt-5" type="submit" id="signin" onClick={this.sendbtn}>Send</button>
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