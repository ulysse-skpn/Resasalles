import React from "react"
// import moment from "moment"
import moment from 'moment/min/moment-with-locales'

import "./calendar.css"
import chevron_left from "./chevron-double-left.svg"
import chevron_right from "./chevron-double-right.svg"

moment.locale("fr",{
    months : 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
    monthsShort : 'Janv_févr_Mars_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc'.split('_'),
    weekdays : 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
    weekdaysShort : 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
})

export default class Calendar extends React.Component 
{

    weekdayshort = moment.weekdaysShort()

    state = 
    {
        showYearTable: false,
        showMonthTable: false,
        showDateTable: true,
        dateObject: moment(),
        allmonths: moment.months(),
        selectedDay: null
    }

    daysInMonth = () => {
        return this.state.dateObject.daysInMonth()
    }

    year = () => {
        return this.state.dateObject.format("Y")
    }

    currentDay = () => {
        return this.state.dateObject.format("D")
    }

    firstDayOfMonth = () => {
        const dateObject = this.state.dateObject
        const firstDay = moment(dateObject).startOf("month").format("d")
        return firstDay
    }

    month = () => {
        return this.state.dateObject.format("MMMM")
    }

    showMonth = () => {
        this.setState({
            showMonthTable: !this.state.showMonthTable,
            showDateTable: !this.state.showDateTable
        })
    }

    setMonth = (month) => {
        const monthNo = this.state.allmonths.indexOf(month)
        let dateObject = Object.assign({}, this.state.dateObject)
        dateObject = moment(dateObject).set("month", monthNo)
        this.setState({
            dateObject: dateObject,
            showMonthTable: !this.state.showMonthTable,
            showDateTable: !this.state.showDateTable
        })
    }

    MonthList = (props) => {
        const months = []
        props.data.map((data) => {
            return months.push(
                <td key={data} className="calendar-month" onClick={() => { this.setMonth(data) }}>
                    <span>{data}</span>
                </td>
            )
        })

        const rows = []
        let cells = []

        months.forEach((row, i) => {
            if (i % 3 !== 0 || i === 0) 
            {
                cells.push(row)
            } 
            else 
            {
                rows.push(cells)
                cells = []
                cells.push(row)
            }
        })

        rows.push(cells)

        const monthlist = rows.map((d, i) => {
            return <tr>{d}</tr>
        })

        return (
            <table className="calendar-month table table-bordered">
                <thead className="text-center font-weight-bold">
                    <tr>
                        <th colSpan="4">Choix du mois</th>
                    </tr>
                </thead>
                <tbody>{monthlist}</tbody>
            </table>
        )
    }

    showYearTable = () => {
        this.setState({
            showYearTable: !this.state.showYearTable,
            showDateTable: !this.state.showDateTable
        })
    }

    onPrev = () => {
        let curr = ""
        if (this.state.showYearTable === true) curr = "year"
        else curr = "month"

        this.setState({
            dateObject: this.state.dateObject.subtract(1, curr)
        })
    }

    onNext = () => {
        let curr = ""
        if (this.state.showYearTable === true) curr = "year"
        else curr = "month"

        this.setState({
            dateObject: this.state.dateObject.add(1, curr)
        })
    }

    setYear = (year) => {
        let dateObject = Object.assign({}, this.state.dateObject)
        dateObject = moment(dateObject).set("year", year)
        this.setState({
            dateObject: dateObject,
            showMonthTable: !this.state.showMonthTable,
            showYearTable: !this.state.showYearTable
        })
    }

    onYearChange = (e) => {
        this.setYear(e.target.value)
    }

    getDates(startDate, stopDate) 
    {
        const dateArray = []
        let currentDate = moment(startDate)
        const _stopDate_ = moment(stopDate)

        while (currentDate <= _stopDate_) 
        {
            dateArray.push(moment(currentDate).format("YYYY"))
            currentDate = moment(currentDate).add(1, "year")
        }

        return dateArray
    }

    YearTable = (props) => {
        const months = []
        const nextten = moment().set("year", props).add(12 , "year").format("Y")

        const tenyear = this.getDates(props, nextten)

        tenyear.map((data) => {
            months.push(
                <td key={data} className="calendar-month" onClick={() => { this.setYear(data) }}>
                    <span>{data}</span>
                </td>
            )
        })

        const rows = []
        let cells = []

        months.forEach((row, i) => {
            if (i % 3 !== 0 || i === 0) 
            {
                cells.push(row)
            } 
            else 
            {
                rows.push(cells)
                cells = []
                cells.push(row)
            }
        })

        rows.push(cells)

        const yearlist = rows.map((d, i) => {
            return <tr>{d}</tr>
        })

        return (
            <table className="calendar-year table table-bordered">
                <thead className="text-center font-weight-bold">
                    <tr>
                        <th colSpan="4">Choix de l'année</th>
                    </tr>
                </thead>
                <tbody>{yearlist}</tbody>
            </table>
        )
    }

    onDayClick = (e, d) => {
        this.setState({selectedDay: d})
    }

    render() 
    {
        const weekdayshortname = this.weekdayshort.map((day) => {
            return <th key={day}>{day}</th>
        })

        const blanks = [];

        for (let i = 0 ; i < this.firstDayOfMonth(); i++) 
        {
            blanks.push(<td className="calendar-day empty">{""}</td>)
        }

        const daysInMonth = []

        for (let d = 1 ; d <= this.daysInMonth(); d++) 
        {
            let currentDay = d === this.currentDay() ? "Aujourd'hui" : ""
            daysInMonth.push(
                <td key={d} className={`calendar-day ${currentDay}`}>
                    <span onClick={(e) => { this.onDayClick(e, d) }}>{d}</span>
                </td>
            )
        }

        const totalSlots = [...blanks, ...daysInMonth]
        const rows = []
        let cells = []

        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) 
            {
                cells.push(row)
            } 
            else 
            {
                rows.push(cells)
                cells = []
                cells.push(row)
            }
            if (i === totalSlots.length - 1) 
            {
                rows.push(cells)
            }
        })

        const daysinmonth = rows.map((d, i) => {
            return <tr>{d}</tr>
        })

        return (
            <div className="container-fluid calendar-wrapper">
                <div className="calendar-nav d-flex justify-content-evenly">
                    <span onClick={() => { this.onPrev() }} className="calendar-button button-prev">
                        <img src={chevron_left} alt="précédent"/>
                    </span>
                    {!this.state.showMonthTable && (
                        <span onClick={() => { this.showMonth() }} className="calendar-label">
                            {this.month()}
                        </span>
                    )}
                    <span className="calendar-label" onClick={() => this.showYearTable()}>
                        {this.year()}
                    </span>
                    <span onClick={() => { this.onNext() }} className="calendar-button button-next">
                        <img src={chevron_right} alt="suivant"/>
                    </span>
                </div>

                <div className="calendar-date">
                    {this.state.showYearTable && <this.YearTable props={this.year()} />}
                    {this.state.showMonthTable && (<this.MonthList data={moment.months()} />)}
                </div>

                {this.state.showDateTable && (
                    <div className="calendar-date">
                        <table className="calendar-day table table-bordered">
                            <thead className="text-center font-weight-bold">
                                <tr>{weekdayshortname}</tr>
                            </thead>
                            <tbody>{daysinmonth}</tbody>
                        </table>
                    </div>
                )}
            </div>
        )
    }
}
