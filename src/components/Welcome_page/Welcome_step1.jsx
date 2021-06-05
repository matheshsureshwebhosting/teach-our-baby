import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import "../welcome.css";
import welcomeimg from "../../img/Illus.png"

class Welcome_step1 extends Component {


    constructor(props) {
        super(props)
        this.state = {
            image: {},
            test: "test"
        }
    }
    render() {
        return (
            <Formik
                render={({ errors, status, touched }) => (
                    <React.Fragment>
                        <div className="row container" id="bodycontent">
                            <div className="col-md-2"></div>
                            <div className="col-md-3">
                                <Form id="formdiv">
                                    <h1 className="mb-3 welcomeheading">Welcome !</h1>
                                    <p id="welcometext">Focus on what matters most. <br />Manage everything, from big projects to <br /> personal moments.</p>
                                </Form>
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-4 mt-3">
                                <img src={welcomeimg} alt="" id="welcomeimg" width="auto" />
                            </div>
                            <div className="col-md-2"></div>
                        </div>
                    </React.Fragment>

                )}


            />
        );
    }
}

export default Welcome_step1;