import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import "../css/calender.css"
import firebase from "../../database/firebase"
const db = firebase.firestore()
export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem("userid"),
            remainters: null
        }
    }
    componentDidMount = () => {
        const { userid } = this.state
        db.collection("remainder-ppt").get().then((snap) => {
            const data = []
            snap.forEach((doc) => {
                if (doc.data() !== undefined && doc.data().userid === userid) {
                    const dates = doc.data().remainder
                    const datesplid = dates.split("-")
                    data.push({
                        date: `${datesplid[2]}-${datesplid[1].length === 1 ? `0${datesplid[1]}` : datesplid[1]}-${datesplid[0]}`,
                        title: doc.data().category
                    })
                }
            })
            this.setState({
                remainters: data
            })
        })
    }
    render() {
        const { remainters } = this.state
        return (
            <div className="container" style={{ width: "50%", height: "50%" }}>
                <FullCalendar id="calenderfull"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={
                        remainters != null ? remainters : null
                    }

                />
            </div>
        )
    }
}
