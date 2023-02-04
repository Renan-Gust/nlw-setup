import { useEffect, useState } from "react"
import dayjs from "dayjs"

import { api } from "../lib/axios"

import { generateDatesFromYearsBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearsBeginning()

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

export function SummaryTable() {
    const [summary, setSummary] = useState<Summary>([])

    useEffect(() => {
        api.get('/summary').then(response => setSummary(response.data))
    }, [])

    return(
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, index) => (
                    <div 
                        className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center" 
                        key={index}
                    >
                        {weekDay}
                    </div>
                ))}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map(date => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day')
                    })

                    return(
                        <HabitDay 
                            key={date.toString()}
                            amount={dayInSummary?.amount}
                            defaultCompleted={dayInSummary?.completed}
                            date={date}
                        />
                    )
                })}

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-50 cursor-not-allowed" key={index} />
                ))}
            </div>
        </div>
    )
}