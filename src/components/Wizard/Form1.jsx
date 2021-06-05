import React, { Component } from 'react';
import welcomeimg from "../../img/Illus.png";
import "../css/wizard.css";
class Form1 extends Component {

  render() {
    if (this.props.currentStep !== 1) {
      return null
    }
    const { modalShow, closemodal, addcat,category,selectedcat } = this.props    
    return (
      <React.Fragment>
        <div className="row container mt-5" id="bodycontent">
          <div className="col-md-8" id="firstpart">
            <img src={welcomeimg} alt="" id="leftimg" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3" id="secondpart">
            <div className="form-group">
              <label htmlFor="dname" id="catlabel">Category</label>
              <select name="category" id="category" multiple={false}
                onChange={this.props.handleChange}
                className="form-control">
                <option value="none">Choose Category</option>
                {
                  category.map((data, index) => {
                    if(selectedcat===data){
                      return <option value={data} selected key={index}>{data}</option>
                    }else{
                      return <option value={data} key={index}>{data}</option>
                    }
                  })
                }           
                <option value="Add">Add category</option>
              </select>
            </div>
          </div>
        </div>
        <div className={`modal fade ${modalShow ? "show form1modal" : null}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add New Category</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closemodal}></button>
              </div>
              <div className="modal-body">
                <div>
                  <input type="text" name="category" id="addcat" onChange={this.props.handleChange} className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-info add" onClick={addcat}>Add Category</button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Form1;