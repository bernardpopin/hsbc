import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { doApiGet } from './api';

const App = () => {
  
  // first task //

  const timezonesUrl = 'v2.1/list-time-zone?key=XWSLLPX5RMIZ&format=json&zone=Europe/*';
  const timePrefixUrl = 'v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=';
  const timeInterval = 5000;
  const [timezonesDataState, setTimezonesDataState] = useState(undefined);
  const [selectedZoneState, setSelectedZoneState] = useState(undefined);
  const [timeState, setTimeState] = useState(undefined);

  const fetchTimezonesData = useCallback(() => {
    doApiGet(timezonesUrl).then(data => {
      const timezonesData = data.zones.map(zone => {
        zone.value = zone.zoneName;
        zone.label = zone.countryName;
        return zone;
      });
      setTimezonesDataState(timezonesData);
      console.log('TimezonesData', timezonesData)
    });
  }, []);

  const fetchTimeData = zoneUrl => {
    doApiGet(zoneUrl).then(data => {
      setTimeState(data.formatted);
      console.log('TimeData', data)
    });
  };

  useEffect(() => {
    if (!timezonesDataState) {
      fetchTimezonesData();
    }
    if (selectedZoneState) {
      const interval = setInterval(() => {
        fetchTimeData(`${timePrefixUrl}${selectedZoneState.value}`);
      }, timeInterval);
      return () => clearInterval(interval);
    }
  }, [timezonesDataState, fetchTimezonesData, selectedZoneState]);

  const handleChange = selectedZoneState => {
    setSelectedZoneState(selectedZoneState);
    fetchTimeData(`${timePrefixUrl}${selectedZoneState.value}`);
    console.log(`Timezone selected`, selectedZoneState);
  };

  // end //

  // second task //

  const add = (a, b) => a + b;

  const once = fn => {
    let executed = false;
    return (...args) => {
      if (!executed) {
        executed = true;
        return fn.apply(this, args);
      }
    }
  }

  const onceAdd = once(add);

  console.log('onceAdd(1, 2)', onceAdd(1, 2));
  console.log('onceAdd(2, 2)', onceAdd(2, 2));

  // end //

  return (
    <div className="App">
      {timeState}
      <Select
        value={selectedZoneState}
        onChange={handleChange}
        options={timezonesDataState}
      />
    </div>
  );
}

export default App;
