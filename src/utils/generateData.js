import React from 'react';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr/dist/browser/signalr';

export function connectToSocket(sensors, simulation) {
  const connection = new HubConnectionBuilder()
  .withUrl(`http://localhost:5000/sensors`)
  .configureLogging(LogLevel.Information)
  .build();

  connection.on('Status', (data) => {
    console.log(data);
  });

  connection.on('SensorData', (data) => {
    console.log(data);
  });

  connection.start()
    .then(() => connection.invoke('SubscribeSensorData', sensors, simulation))
    .catch(() => {
      // console.log(error);
  });

}