import axios from 'axios'
import React, { Component } from 'react'

export default class Shuffledpptdata extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            admin: false,            
            shuffledppts:null,            
        }

    }
    componentDidMount = async () => {
        const { userid } = this.state
        if (userid !== null) {
            await axios.get("http://168.119.159.183:4500/admin", {
                headers: {
                    userid: userid
                }
            }).then(async(res) => {
                if (res.data !== true) {
                    window.location.replace("/")
                } else {  
                    this.setState({
                        admin: true
                    })                       
                    const getshuffleppts = await this.getShuffleppts(userid, res.data)                    
                    this.setState({                      
                        shuffledppts:getshuffleppts,                        
                    })                                               
                }
            })        
        }   
      
    }

    getShuffleppts = async (userid, admin) => {        
        const getUsers = new Promise(async (resolve, reject) => {
           await axios.get("http://168.119.159.183:4500/admin/shuffledppt", {
                headers: {
                    userid: userid,
                    admin: admin
                }
            }).then((res) => {
                resolve(res.data)
            })
        })
        return await getUsers
    }

    render() {
        const {shuffledppts}=this.state
        return (
            <div className="container">
                <section >
                <div className="tbl-header table-responsive">
                        <table className="table" cellPadding="0" cellSpacing="0" border="1">
                            <thead id="tablebody">
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Category</th>                                    
                                    <th>Schdule Date</th>
                                    <th>Download</th>

                                </tr>
                            </thead>
                            <tbody>
                            {
                                    shuffledppts !== null ? shuffledppts.map((uploades, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{uploades.category}</td>                                            
                                            <td>{uploades.remainder}</td>
                                            <td><a href={uploades.shuffled_ppt}>{uploades.category} Shuffled PPT</a></td>                                     
                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>
                        {
                            shuffledppts !== null ? shuffledppts.length === 0 ? <div>No Data</div> : null : null
                        }
                    </div>
                </section>
            </div>
        )
    }
}
