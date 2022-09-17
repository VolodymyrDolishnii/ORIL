import React, { useEffect, useState } from "react";
import { Graph } from '../../types/graph';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from "react-router-dom";
import moment from 'moment';
import { getGraphData } from '../../api/GraphData';
import { Loader } from '../Loader/Loader';

interface ICustomToolip {
    active: boolean;
    payload: any;
}

export const GraphPage: React.FC = () => {

    const [graphData, setGraphData] = useState<Graph[]>([]);
    const [period, setPeriod] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [medium, setMedium] = useState(0);
    const [total, setTotal] = useState(0);
    const [isCalculating, setIsCalculating] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        if (id) {
            getGraphData(id)
                .then(response => setGraphData(response.data))
                .catch(() => setIsError(true))
                .finally(() => setIsLoading(false))
        }
    }, [id]);

    const sortedData = (array: Graph[]) => {
        const newList = array.sort((a, b) => {
            return +moment(a.date) - +moment(b.date);
        });

        newList.map(graph => {
            graph.date = String(graph.date)
                .slice(0, 10)
                .replace('-', '.')
                .replace('-', '.');

            return 0;
        })

        if (period === 0) {
            return newList;
        }

        return newList.slice(graphData.length - period, graphData.length);
    };

    const onlyNumbersArray = (array: Graph[], period: number) => {
        let arrayByPeriod = [];

        if (period !== 0) {
            arrayByPeriod = array.slice(graphData.length - period, graphData.length);
        } else {
            arrayByPeriod = array;
        }

        const newArray = arrayByPeriod.filter(item => {
            return Number(item.curency);
        }
        )

        return newArray;
    };


    const getTotal = (array: Graph[]) => {
        let result = 0;

        for (const item of array) {
            result += Number(item.curency);
        }

        return Math.trunc(result);
    }



    const getMax = (array: Graph[]) => {
        let result = 0;

        for (const item of array) {
            if (Number(item.curency) > result) {
                result = Number(item.curency);
            }
        }

        return +result.toFixed(2);
    }

    const getMin = (array: Graph[]) => {
        let result = 100;

        for (const item of array) {
            if (Number(item.curency) < result) {
                result = Number(item.curency);
            }
        }

        return +result.toFixed(2);
    }

    const getMedium = (total: number, length: number) => {
        return +(total / length).toFixed(2);
    }

    useEffect(() => {
        setTotal(getTotal(onlyNumbersArray(graphData, period)));
        setMin(getMin(onlyNumbersArray(graphData, period)));
        setMedium(getMedium(total, onlyNumbersArray(graphData, period).length));
        setMax(getMax(onlyNumbersArray(graphData, period)));

        setTimeout(() => {
            setIsCalculating(false);
        }, 1500);
    }, [period, total, graphData]);

    const CustomTooltip = ({ active, payload }: ICustomToolip) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                    border: "2px solid #007AFF",
                }}
                >
                    <p className="label">{`${String(payload[0].value) === 'null' ? 'No data' : payload[0].value }`}</p>
                </div>
            );
        }

        return null;
    }

    return (
        <>
            {isError
                ? 'Something went wrong'
                : (
                    <div className="Graph">
                        <div className="top">
                            <h1 className="top__header">Revenue</h1>
                            <div className="top__buttons">
                                <button
                                    className="top__buttons-1"
                                    onClick={() => setPeriod(14)}
                                    style={period === 14 ? { "fontWeight": 700 } : { "fontWeight": 400 }}
                                >
                                    Week
                                </button>
                                <button
                                    className="top__buttons-2"
                                    onClick={() => setPeriod(56)}
                                    style={period === 56 ? { "fontWeight": 700 } : { "fontWeight": 400 }}
                                >
                                    Month
                                </button>
                                <button
                                    className="top__buttons-3"
                                    onClick={() => setPeriod(520)}
                                    style={period === 520 ? { "fontWeight": 700 } : { "fontWeight": 400 }}
                                >
                                    Year
                                </button>
                            </div>
                        </div>
                        {!isLoading
                            ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart
                                        width={1000}
                                        height={200}
                                        data={sortedData(graphData)}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="55%" stopColor="#007AFF" stopOpacity={0.5} />
                                                <stop offset="100%" stopColor="#007AFF" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid />
                                        <XAxis dataKey={"date"} style={{ "fontSize": "12px" }} />
                                        <YAxis domain={[0, 1000]} unit="$" />
                                        <Tooltip content={<CustomTooltip active={true} payload={undefined} />} />
                                        <Area connectNulls type='monotone' dataKey="curency" stroke="#007AFF" fill="url(#colorView)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )
                            : (
                                <Loader />
                            )}

                        {isCalculating === true
                            ? <Loader />
                            : (
                                <>
                                    <div className="stats">
                                        <div className="graphInfo__item">
                                            <h1 className="graphInfo__header">Total</h1>
                                            <h1 className="graphInfo__mainValue">{`$${total}`}</h1>
                                        </div>

                                        <div className="stats__other">
                                            <div className="graphInfo__item">
                                                <h1 className="graphInfo__header">Min</h1>
                                                <h1 className="graphInfo__value">{`$${min}`}</h1>
                                            </div>

                                            <div className="graphInfo__item">
                                                <h1 className="graphInfo__header">Medium</h1>
                                                <h1 className="graphInfo__value">{`$${medium}`}</h1>
                                            </div>

                                            <div className="graphInfo__item">
                                                <h1 className="graphInfo__header">Max</h1>
                                                <h1 className="graphInfo__value">{`$${max}`}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                )}

        </>
    )
}