import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { GrDocumentPdf, GrPrint } from 'react-icons/gr';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { RiErrorWarningFill } from 'react-icons/ri';
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
  console.log('onceAdd(3, 2)', onceAdd(3, 2));

  // end //

  // third task below Select + App.css //

  return (
    <div className="App">
      {timeState}
      <Select
        value={selectedZoneState}
        onChange={handleChange}
        options={timezonesDataState}
      />
      <div className="Tab">
        <div className="Request">
          <div className="RequestTitle">
            <h3>Cancel / recall payment, GBP 1,000.00</h3>
            <div className="RequestSubtitle">1234567890123456 (GB), KUIML Business Company</div>
          </div>
          <div className="RequestActions">
            <div className="RequestAction">
              <GrDocumentPdf />
            </div>
            <div className="RequestAction">
              <GrPrint />
            </div>
            <div className="RequestActionButton Inverse">Reject</div>
            <div className="RequestActionButton">Authorise</div>
          </div>
        </div>
        <div className="RequestDetails">
          <div className="RequestDetailsContainer">
            <div className="RequestDetail">
              <div className="RequestDetailHeader">
                Request reference
              </div>
              SET29383ABCH
            </div>
            <div className="RequestDetail">
              <div className="RequestDetailHeader">
                Category
              </div>
              Payment
            </div>
            <div className="RequestDetail">
              <div className="RequestDetailHeader">
                Request status
              </div>
              <RiErrorWarningFill /> Pending authorisation
            </div>
          </div>
          <div className="FullDetails">
            Full details <MdKeyboardArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
