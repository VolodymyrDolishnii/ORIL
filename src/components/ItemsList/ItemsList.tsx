import React from "react";
import { Item } from '../../types/item'
import { FilterType } from '../../utils/FilterType';
import { Loader } from '../Loader/Loader'
import { useNavigate } from 'react-router-dom'

type Props = {
    items: Item[];
    sortBy: (filter: FilterType) => void;
    query: string;
    setQuery: (variable: string) => void;
    isLoading: boolean;
};

export const ItemsList: React.FC<Props> = ({ items, sortBy, query, setQuery, isLoading }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="List">
                <div className="inputField">
                    <input
                        className="input is-normal input2"
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => {
                            const { value } = event.target;

                            setQuery(value);
                        }}
                    />
                </div>
                {isLoading === true
                    ? <Loader />
                    : (
                        <table
                            className="table is-fullwidth is-striped is-hoverable"
                        >
                            <thead>
                                <tr>
                                    <th>
                                        <button
                                            className="button is-white"
                                            onClick={() => sortBy(FilterType.Name)}
                                        >
                                            Name
                                        </button>
                                    </th>
                                    <th className="table__date">
                                        <button
                                            className="button is-white"
                                            onClick={() => sortBy(FilterType.Date)}
                                        >
                                            Date
                                        </button>
                                    </th>
                                    <th className="table__state">
                                        <button
                                            className="button is-white"
                                            onClick={() => sortBy(FilterType.State)}
                                        >
                                            State
                                        </button>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map(item => (
                                    <tr
                                        key={item._id}
                                        onClick={() => navigate(`/oril/${item.id}`)}
                                    >
                                        <td>{item.name}</td>
                                        <td>{String(item.date)
                                            .slice(0, 10)
                                            .replace('-', '.')
                                            .replace('-', '.')}
                                        </td>
                                        {item.isActive === true
                                            ? (<td style={{ "color": "green" }}>Active</td>)
                                            : (<td style={{ "color": "red" }}>Disable</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>
        </>
    )
}