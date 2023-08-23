'use client'
import React, {useEffect, useState} from 'react';
import s from './Schedule.module.scss';
import ScheduleFiltersCards from "@/components/Schedule/Schedule-filters-cards";
import {IScheduleFiltersCardsProps} from "@/types/types";
import classNames from "classnames";

const Schedule = (props: {langIvrit: boolean}) => {
    const [address, setAddress] = useState('')
    const [frequencyType, setFrequencyType] = useState<string | null>(null)
    const [allergyType, setAllergyType] = useState<string | null>(null)
    const [cleaningType, setCleaningType] = useState<string | null>(null)
    const [cleaningCardVisibility, setCleaningCardVisibility] = useState<boolean>(false)
    const [day, setDay] = useState<null | string>(null)
    const [time, setTime] = useState<null | string>(null)
    const [searchButton, setSearchButton] = useState(false)

    useEffect(() => {
        frequencyType === 'one_time' ? setCleaningCardVisibility(true) : setCleaningCardVisibility(false)
    }, [frequencyType, allergyType, cleaningType])

    const allergyChoose = (allergyTypeChoose: string | null) => {
        if ((allergyType === 'cat' && allergyTypeChoose === 'dog') || (allergyType === 'dog' && allergyTypeChoose === 'cat')) {
            setAllergyType('dog_and_cat');
        }
        else if (allergyType === 'dog_and_cat' && allergyTypeChoose === 'dog') {
            setAllergyType('cat');
        }
        else if (allergyType === 'dog_and_cat' && allergyTypeChoose === 'cat') {
            setAllergyType('dog');
        }
        else setAllergyType(allergyTypeChoose);
    }

    const buttonsData: IScheduleFiltersCardsProps[] = [
        {
            type: 'frequency',
            buttons: [
                {
                    type: 'one_time',
                    text: 'one-time'
                },
                {
                    type: 'fortnightly',
                    text: 'fortnightly'
                },
                {
                    type: 'every_week',
                    text: 'every week'
                },
            ],
            stateChoose: frequencyType,
            stateChooseChanger: setFrequencyType
        },
        {
            type: 'allergy',
            buttons: [
                {
                    type: 'none',
                    text: 'none'
                },
                {
                    type: 'cat',
                    text: 'cat'
                },
                {
                    type: 'dog',
                    text: 'dog'
                },
            ],
            stateChoose: allergyType,
            stateChooseChanger: allergyChoose
        },
        {
            type: 'cleaning',
            buttons: [
                {
                    type: 'regular_cleaning',
                    text: 'regular cleaning'
                },
                {
                    type: 'window_cleaning',
                    text: 'window cleaning'
                },
                {
                    type: 'after_repairing',
                    text: 'after repairing'
                },
                {
                    type: 'after_relocation',
                    text: 'after relocation'
                },
            ],
            stateChoose: cleaningType,
            stateChooseChanger: setCleaningType,
            cleaningCardVisibility: cleaningCardVisibility
        }
    ]

    const filtersCardsRender = (buttonsData: IScheduleFiltersCardsProps[]) => {
        return buttonsData.map((el, id) => <ScheduleFiltersCards key={id} cardsData={el}/>)
    }

    const weekDayChoose = (value: string) => {
        if (value === day) {
            setDay(null)
        }
        else {
            setDay(value)
        }
    }

    const weekDaysRender = () => {
        let weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

        let date = new Date()

        let nowDay = date.getDate();
        let nowMonth = date.getMonth();
        let nowYear = date.getFullYear();

        let days = [];

        for (let day = nowDay; day < nowDay + 7; day++) {
            let todayWeekDay = new Date (nowYear, nowMonth, day).getDay()
            days.push({weekDay: weekDays[todayWeekDay], day: day.toString()})
        }

        return days.map((el, id) => (
                <button key={id} className={classNames({[s.day]: true, [s.choose]: el.day === day})} onClick={() => weekDayChoose(el.day)}>
                    <p className={s.text}>{el.weekDay}</p>
                    <p className={s.text}>{el.day}</p>
                </button>
            )
        )
    }

    const timeChoose = (value: string) => {
        if (value === time) {
            setTime(null)
        }
        else {
            setTime(value)
        }
    }

    const timeRender = () => {
        let times = []

        for (let i = 8; i < 23; i++) {
            times.push(i.toString())
        }

        return times.map((el, id) => <button key={id} className={classNames({[s.time]: true, [s.choose]: el === time})} onClick={() => timeChoose(el)}>{el}</button>)
    }

    useEffect(() => {
        if(frequencyType && allergyType && !cleaningCardVisibility && address) {
            setSearchButton(true)
        }
        else if (cleaningCardVisibility && cleaningType && allergyType && address) {
            setSearchButton(true)
        }
        else {setSearchButton(false)}

    }, [searchButton, frequencyType, allergyType, cleaningCardVisibility, cleaningType, address])

    return (
        <div className={s.schedule}>
            <div className={s.filters}>
                <label className={s.label_address}>
                    <p className={s.label_text}>Address</p>
                    <div className={s.input_layout}>
                        <input type="text" className={s.input_address} value={address} onChange={(e) => {setAddress(e.target.value)}}/>
                    </div>
                </label>
                <div className={s.radio_button_section}>
                    {filtersCardsRender(buttonsData)}
                </div>
                <button className={classNames({[s.button_search]: true, [s.active]: searchButton})} onClick={() => {alert('search')}} disabled={!searchButton}>search</button>
            </div>
            <div className={s.week_schedule}>
                <h2 className={s.title}>Schedule</h2>
                <div className={s.days}>
                    {weekDaysRender()}
                </div>
                <div className={s.times}>
                    {timeRender()}
                </div>
            </div>
        </div>
    );
};

export default Schedule;