import React, { Component } from 'react'
import firebase from '../database/firebase'
const db = firebase.firestore()

export default class Downloadhistory extends Component {
    constructor(props) {
        super()
        this.state = {
            downloadhistory: null,
            userid: localStorage.getItem("userid"),
        }
    }

    componentDidMount = () => {
        const { userid } = this.state
        if (userid !== null) {
            db.collection("users").doc(userid).collection("downloadppt").orderBy("date", "desc").get().then((snap) => {
                const data = []
                snap.forEach((doc) => {
                    if (doc.data() !== undefined) {
                        data.push(doc.data())
                    }
                })
                this.setState({
                    downloadhistory: data
                })
            })
        }
    }
    render() {
        const { downloadhistory } = this.state
        return (
            <div className="container">
                <section >
                    <div className="tbl-header table-responsive">
                        <table className="table" cellPadding="0" cellSpacing="0" border="1">
                            <thead id="tablebody">
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Downloaded Date</th>
                                    <th>Category</th>
                                    <th>Downloaded PPT</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    downloadhistory != null ? downloadhistory.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.date}</td>
                                            <td>{data.category}</td>
                                            <td>{data.pptid}</td>
                                            <td>{data.credits}</td>

                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>
                        {
                            downloadhistory != null ? downloadhistory.length === 0 ? <div>No data</div> : null : null
                        }

                    </div>
                </section>
            </div>
        )
    }
}
