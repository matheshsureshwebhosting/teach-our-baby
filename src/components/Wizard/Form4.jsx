import React, { Component } from 'react';
import welcomeimg from "../../img/Illus.png";
import "../css/wizard.css";
import { toast,Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
export default class Form4 extends Component {
  render() {
    if (this.props.currentStep !== 4) {
      return null
    }
    const { submitbtn, msg } = this.props     
    if(submitbtn!==false){
       toast.info(msg,{
         autoClose:10000,
         transition:Slide
       })
    }
    return (
      <React.Fragment>
        <div className="row container" id="bodycontent">
          <div className="col-md-8" id="firstpart">
            <img src={welcomeimg} alt="" id="leftimg" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3" id="secondpart">
            <div className="form-group lastform">
              <label htmlFor="password" id="shulabellabel">Number of Shuffle</label>
              <input
                className="form-control"
                id="shuffle"
                name="shuffle"
                type="shuffle"
                placeholder="Enter Number of Shuffle"
                value={this.props.shuffle}
                onChange={this.props.handleChange}
              />            
            </div>
            {
              submitbtn===false  ? <button className="btn btn-success btn-block submit" onClick={this.props.handleSubmit}>Submit</button> :  <button className="btn btn-success btn-block submit" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading...</button>
            }
            
           
          </div>
        </div>
      </React.Fragment>
    )
  }
}
