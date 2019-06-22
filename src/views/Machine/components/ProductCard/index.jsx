import React, { Component, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Typography, Divider } from '@material-ui/core';
import {
  AccessTime as AccessTimeIcon,
  GetApp as GetAppIcon
} from '@material-ui/icons';
import { Paper } from 'components';
import styles from './styles';
import Foto from "../../../../assets/machine.png";
import { Link, NavLink } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { appSettings } from '../../../../utils/settings';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr/dist/browser/signalr';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  buttonStop:{
    margin: theme.spacing(1),
    backgroundColor:'#DC143C',
    '&hover':{
      backgroundColor:'#B22222'
    }
  }
}));

const ProductCard = (props) => {

  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [sensoren, setSensoren] = React.useState({
    sensoren: [],
  });
  const [sensorTypes, setSensorenTypes] = React.useState({
    sensorTypes: [],
  });
  const [generatedData, setGeneratedData] = React.useState([]);
  const clx = useStyles();
  const [simulatieStatus, setSimulatieStatus] = React.useState(false);
  const connection = new HubConnectionBuilder()
    .withUrl(`http://localhost:5000/sensors`)
    .configureLogging(LogLevel.Information)
    .build();

  React.useEffect(() => {
    let didCancel = false;
    async function getSensorTypes() {
      try {
        const result = await axios.get(`${appSettings.apiBaseUrl}/devices/${props.id}?includes=Sensors`, {
          headers: {
            "Authorization": "Bearer " + appSettings.token
          }
        });
        const result2 = await axios.get(`${appSettings.apiBaseUrl}/types`, {
          headers: {
            "Authorization": "Bearer " + appSettings.token
          }
        });
        const xyz = result2.data;
        const sensorTypes = xyz.filter(s => s.category === 'SensorDataType');
        const alleSensoren = result.data.sensors;
        if (!didCancel) {
          alleSensoren.map(sensor => {
            setSensoren(sensoren => ({
              sensoren: [...sensoren.sensoren, sensor]
            }));
          });
          sensorTypes.map(sensor => {
            setSensorenTypes(sensorTypes => ({
              sensorTypes: [...sensorTypes.sensorTypes, sensor]
            }));
          })
        }
      } catch (error) {
        if (!didCancel) {
          console.log(error);
        }
      }

    }
    getSensorTypes();
    return () => {
      didCancel = true;
    };
  }, [generatedData]);


 
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [values, setValues] = React.useState({
    hardwareId: ""
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { classes, className } = props;
  const rootClassName = classNames(classes.root, className);
  return (
    <Fragment>
      <Paper className={rootClassName} onClick={handleOpen}>
        <div className={classes.imageWrapper}>
          <img
            alt="Product"
            className={classes.image}
            src={Foto}
          />
        </div>
        <div className={classes.details}>
          <Typography
            className={classes.title}
            variant="h4"
          >
            {props.title}
          </Typography>
          <Typography
            className={classes.description}
            variant="body1"
          >
            {props.description}
          </Typography>
        </div>
      </Paper>
      
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h2" id="modal-title" className={classes.machineTitel}>
            Machine informatie
          </Typography>
          {sensorTypes.sensorTypes.length <= 0 ? "Aan het laden" : ""}
          {sensoren.sensoren.map(({ hardwareId, dataTypeId }) => {
            return (
              <div>
                <div className={classes.sensorveld}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Sensor naam"
                    value={hardwareId}
                  />
                </div>
                <div className={classes.sensorveld2}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Sensor type"
                  value={sensorTypes.sensorTypes.filter((sensorType) => sensorType.id === dataTypeId).map(x => x.name)}
                  classes={classes.sensorveld}
                />
                </div>
                
              </div>
            );
          })}
        </div>
      </Modal>
    </Fragment>
  );

}

ProductCard.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCard);
