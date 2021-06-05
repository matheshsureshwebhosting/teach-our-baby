import React, { Component } from 'react'
import axios from 'axios'

export default class Usersdata extends Component {
    constructor(props) {
        super()
        this.state = {
            userid: localStorage.getItem("userid"),
            admin: false,
            users: null,
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
                    const getusers = await this.getUsers(userid, res.data)
                    this.setState({
                        users: getusers,
                    })
                }
            })
        }

    }
    getUsers = async (userid, admin) => {
        const getUsers = new Promise(async (resolve, reject) => {
            await axios.get("http://168.119.159.183:4500/admin/users", {
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
        const { users } = this.state
        return (
            <div className="container">
                <section >
                <div className="tbl-header table-responsive">
                        <table className="table" cellPadding="0" cellSpacing="0" border="1">
                            <thead id="tablebody">
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Credit Balance</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users !== null ? users.map((user, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{user.name !== undefined ? user.name : "User Not Provide"}</td>
                                            <td>{user.email}</td>
                                            <td>50</td>
                                        </tr>
                                    )) : null
                                }

                            </tbody>
                        </table>
                        {
                            users !== null ? users.length === 0 ? <div>No Data</div> : null : null
                        }

                    </div>
                </section>
            </div>
        )
    }
}
