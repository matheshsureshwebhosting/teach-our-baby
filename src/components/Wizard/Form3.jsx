import React, { Component } from 'react';
import welcomeimg from "../../img/Illus.png";
import "../css/wizard.css";
class Form3 extends Component {
  render() {
    if (this.props.currentStep !== 3) {
      return null
    }
    return (
      <React.Fragment>
        <div className="row container mt-5" id="bodycontent">
          <div className="col-md-8" id="firstpart">
            <img src={welcomeimg} alt="" id="leftimg" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3" id="secondpart">
            <div className="form-group">
              <label htmlFor="comment" id="pptlabel"> Upload PPT:</label><br/>
              <input type="file" placeholder="Upload PPT" name="file"
                onChange={this.props.handleChange} />
            </div>

          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Form3;