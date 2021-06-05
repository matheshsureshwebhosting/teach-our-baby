import axios from 'axios'
import React, { Component } from 'react'

export default class Uploadedppts extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            admin: false,
            uploadedppts: null
        }

    }
    componentDidMount = async () => {
        const { userid } = this.state
        if (userid !== null) {
            await axios.get("http://168.119.159.183:4500/admin", {
                headers: {
                    userid: userid
                }
            }).then(async (res) => {
                if (res.data !== true) {
                    window.location.replace("/")
                } else {
                    this.setState({
                        admin: true
                    })
                    const getuploadedppts = await this.getUploadedppts(userid, res.data)
                    this.setState({
                        uploadedppts: getuploadedppts
                    })
                }
            })
        }

    }


    getUploadedppts = async (userid, admin) => {
        const getUsers = new Promise(async (resolve, reject) => {
            await axios.get("http://168.119.159.183:4500/admin/uploadedppt", {
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
        const { uploadedppts } = this.state
        return (
            <div className="container">
                <section >
                <div className="tbl-header table-responsive">
                        <table className="table" cellPadding="0" cellSpacing="0" border="1">
                            <thead id="tablebody">
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Category</th>
                                    <th>No.Of Shuffle</th>
                                    <th>Date</th>
                                    <th>Download</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    uploadedppts !== null ? uploadedppts.map((uploades, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{uploades.category}</td>
                                            <td>{uploades.shuffle}</td>
                                            <td>{uploades.date}</td>
                                            <td>{uploades.original_ppt !==undefined ? <a href={uploades.original_ppt}>{uploades.category} Uploads PPT</a> : "No Uploads PPT"}</td>                                                                                 
                                        </tr>
                                    )) : null
                                }

                            </tbody>
                        </table>
                        {
                            uploadedppts !== null ? uploadedppts.length === 0 ? <div>No Data</div> : null : null
                        }
                    </div>
                </section>
            </div>
        )
    }
}
