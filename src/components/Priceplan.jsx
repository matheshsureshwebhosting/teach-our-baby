import React, { Component } from 'react'
import axios from 'axios'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import crown from "../img/crowns.svg"
import "./css/pricingstyle.css"
import { toast, Slide } from "react-toastify"
export default class Priceplan extends Component {
    constructor(props) {
        super(props);

        this.primaryRef = React.createRef();
    }
    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);
    }
    payAmount = (plan, amount) => {
        axios.post("http://168.119.159.183:4500/razorpay/pay", {
            plan: plan,
            amount: amount
        }, {
            headers: {
                userid: "s.kalidas120799@gmail.com"
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
                await axios.post("http://168.119.159.183:4500/razorpay/send", {
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    amount: amount,
                    plan: plan,
                    userid: "s.kalidas120799@gmail.com"
                }, {
                    headers: {
                        userid: "s.kalidas120799@gmail.com"
                    }
                }).then((res) => { console.log(res); })
            },
            "theme": {
                "color": "#227254"
            }
        };
        var rzp = new window.Razorpay(options);
        rzp.open();
    }
    render() {
        const primaryOptions = {
            type: 'loop',
            width: "100%",
            perPage: 3,
            perMove: 1,
            gap: '1rem',
            pagination: false,
            breakpoints: {
                600: {
                    perPage: 1,
                    type: 'loop',
                }
            }
        };
        return (
            <div className="container mt-5">
                <Splide options={primaryOptions} ref={this.primaryRef}>
                    <SplideSlide >
                        <div className="card mb-5 mb-lg-0 rounded-lg shadow">
                            <div className="card-body bg-light rounded-bottom">
                                <div className="text-center crownimg">
                                    <img src={crown} alt="" width="100" />
                                    <h5>Basic</h5>
                                </div>
                                <ul className="list-unstyled mb-4 mt-5">
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-success"></i></span>Single User</li>
                                    <li className="mb-3"><span className="mr-3"><i className="fa fa-check text-success"></i></span>5GB
                                    Storage</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-success"></i></span>Unlimited Public Projects</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-success"></i></span>Community Access</li>
                                    <li className="text-muted mb-3"><span className="mr-3"><i
                                        className="fa fa-times"></i></span>Unlimited Private Projects</li>
                                </ul>
                                <div className="text-center mb-3">
                                    <h4>₹ 50 <span className="month">Per month</span></h4>
                                </div>
                                <button onClick={() => this.payAmount("Basic", 50)} value="Select" className="btn btn-block text-uppercase rounded-lg py-3">Select</button>
                            </div>
                        </div>
                    </SplideSlide>
                    <SplideSlide >
                        <div className="card  mb-5 mb-lg-0 rounded-lg shadow">
                            <div className="card-body bg-light rounded-bottom">
                                <div className="text-center crownimg">
                                    <img src={crown} alt="" width="100" />
                                    <h5>Advance</h5>
                                </div>
                                <ul className="list-unstyled mb-4 mt-5">
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-warning"></i></span><strong>5 Users</strong></li>
                                    <li className="mb-3"><span className="mr-3"><i className="fa fa-check text-warning"></i></span>50GB
                                    Storage</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-warning"></i></span>Unlimited Public Projects</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-warning"></i></span>Community Access</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-warning"></i></span>Unlimited Private Projects</li>

                                </ul>
                                <div className="text-center mb-3">
                                    <h4>₹ 150 <span className="month">Per month</span></h4>
                                </div>
                                <button onClick={() => this.payAmount("Advance", 150)} className="btn btn-block text-uppercase rounded-lg py-3">Select</button>
                            </div>
                        </div>
                    </SplideSlide>
                    <SplideSlide>
                        <div className="card mb-5 mb-lg-0 rounded-lg shadow">
                            <div className="card-body bg-light rounded-bottom">
                                <div className="text-center crownimg">
                                    <img src={crown} alt="" width="100" />
                                    <h5>Premium</h5>
                                </div>
                                <ul className="list-unstyled mb-4 mt-5">
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-danger"></i></span><strong>Unlimited Users</strong>
                                    </li>
                                    <li className="mb-3"><span className="mr-3"><i className="fa fa-check text-danger"></i></span>150GB
                                    Storage</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-danger"></i></span>Unlimited Public Projects</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-danger"></i></span>Community Access</li>
                                    <li className="mb-3"><span className="mr-3"><i
                                        className="fa fa-check text-danger"></i></span>Unlimited Private Projects</li>
                                </ul>
                                <div className="text-center mb-3">
                                    <h4>₹ 250 <span className="month">Per month</span></h4>
                                </div>
                                <button onClick={() => this.payAmount("Premium", 250)} className="btn btn-block text-uppercase rounded-lg py-3">Select</button>
                            </div>
                        </div>
                    </SplideSlide>
                </Splide>
            </div>
        )
    }
}
