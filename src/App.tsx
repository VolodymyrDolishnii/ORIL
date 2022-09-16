import React, { useEffect, useState, useMemo } from 'react';
import './App.scss';
import { Item } from './types/item';
import { getItems } from './api/items';
import { ItemsList } from './components/ItemsList/ItemsList';
import { FilterType } from './utils/FilterType'
import moment from 'moment';
import { GraphPage } from './components/Graph';
import { Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [reverseSort, setReverseSort] = useState(false)
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);

    getItems()
      .then(response => setItems(response))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }, []);


  const sortBy = (filter: FilterType) => {
    const newList = [...items];
    if (filter === FilterType.State && reverseSort === false) {
      newList.sort((a, b) => +a.isActive - +b.isActive);
    }
    if (filter === FilterType.Date && reverseSort === false) {
      newList.sort((a, b) => +moment(a.date) - +moment(b.date));
    }
    if (filter === FilterType.Name && reverseSort === false) {
      newList.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filter === FilterType.State && reverseSort === true) {
      newList.sort((a, b) => +b.isActive - +a.isActive);
    }
    if (filter === FilterType.Date && reverseSort === true) {
      newList.sort((a, b) => +moment(b.date) - +moment(a.date));
    }
    if (filter === FilterType.Name && reverseSort === true) {
      newList.sort((a, b) => b.name.localeCompare(a.name));
    }

    setReverseSort(!reverseSort);
    setItems(newList);
  }


  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const checkQuery = item.name.toLowerCase().includes(query.toLowerCase());

      return checkQuery;
    });
  }, [items, query]);

  return (
    <>
      <div className="container">
        {isError
          ? 'Something'
          : (
            <>
              <Routes>
                <Route path='/oril' element={
                  <ItemsList
                    items={filteredItems}
                    sortBy={sortBy}
                    query={query}
                    setQuery={setQuery}
                    isLoading={isLoading}
                  />
                }>

                </Route>

                <Route path='/oril/:id' element={<GraphPage />}>
                </Route>
              </Routes>

            </>
          )
        }
      </div>
    </>
  );
}
export default App;
