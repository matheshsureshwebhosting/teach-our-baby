import React, { Component } from 'react'

export default class upload extends Component {
    render() {
        return (
            <div className="container">            
                <div className="row fileuploadrow">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <label className="mb-4" htmlFor="file" style={{ color: "#908da1" }}>No Items Yet</label>
                        <input type="file" className="file" id="file" style={{ display: "none" }} />
                        <button className="btn"  style={{ backgroundColor: "rgb(124 55 250 / 30%",marginLeft:"0px"}}>Upload</button>
                    </div>
                    <div className="col-4"></div>
                </div>                                
            </div>
        )
    }
}
