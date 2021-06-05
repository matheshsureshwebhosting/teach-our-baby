import React, { Component } from 'react';
import "./css/recent.css"
import axios from "axios"
class Recentupload extends Component {

    constructor(props) {
        super()
        this.state = {
            recentuploads: null
        }
    }
    componentDidMount = async () => {
        const userid = localStorage.getItem("userid")
        if (userid != null) {
            await axios.get("http://168.119.159.183:4500/recentuploads", {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                const data = await res.data                
                this.setState({
                    recentuploads: data
                })
            })
        }
    }
    shuffledppts=(e,pptid)=>{
        window.location.replace(`/shuffledppt/${pptid}`)
      }
    render() {
        const { recentuploads } = this.state
        return (

            <div className="container mt-5">
                
                <div>

                    <div id="outer">
                    
                        <ul id="list">
                        <h4 style={{textAlign:"initial",fontWeight:"bold",marginBottom:"20px"}}>Recent Uploads</h4>
                            {
                                recentuploads != null ? recentuploads.map((data, index) => (
                                    <div className="col-md-12" key={index} style={{cursor:"pointer"}} onClick={()=>{this.shuffledppts(this,data.docid)}}>
                                <li> <div className="card">
                                    <div className="card-body">
                                        <div className= {(index % 2 === 0) ? "cardcontent1" : "cardcontent"}>
                                            <h6 className="data">{data.category.toUpperCase()}</h6>
                                            <p className="data blogshort">{data.date.split(",")[0]}, {data.description}</p>
                                            <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                                    <hr /></li>
                            </div>
                                )) : <div>No data Founded</div>
                            }                            
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Recentupload;