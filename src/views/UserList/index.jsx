import React from 'react';
import { appSettings } from "../../utils/settings";
import { Dashboard as DashboardLayout } from 'layouts';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
    float: 'left'
  },
  input: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 500,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


const UserList = (props) => {
  const [values, setValues] = React.useState({
    spaceNaam: "",
    spaceDescription: "",
    spaceId: "",
    deviceNaam: "",
    deviceFriendlyname: "",
    deviceDescription: "",
    deviceHardwareID: "",
    sensorHardwareID: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [sensordId, setSensordId] = React.useState(25);
  const [sensoren, setSensoren] = React.useState({
    sensoren: []
  });

  const inputLabel = 10;
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const classes = useStyles();

  React.useEffect(() => {
    let didCancel = false;
    async function getSensorTypes() {
      try {
        const result = await axios.get(`${appSettings.apiBaseUrl}/types`, {
          headers: {
            "Authorization": "Bearer " + appSettings.token
          }
        });
        const alleSensoren = result.data;
        const sensorTypes = alleSensoren.filter(s => s.category === 'SensorDataType');
        console.log(sensorTypes);
        if (!didCancel) {
          sensorTypes.map(sensor => {
            setSensoren(sensoren => ({
              sensoren: [...sensoren.sensoren, sensor]
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
  }, []);

  const createSpace = async (name, description) => {
    console.log("probeer space te maken");
    const space = {
      "name": name,
      "parentSpaceId": "09ce9588-9751-4066-bcdf-1474713a8d28",
      "description": description,
      "typeId": 14
    };

    const result = await axios.post(`${appSettings.apiBaseUrl}/spaces`, space, {
      headers: {
        "Authorization": "Bearer " + appSettings.token
      }
    }).then(res => {
      return res;
    })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

    return result;
  };


  const createDevice = async (name, friendlyName, description, spaceId, hardwareId) => {
    console.log("probeer device aan te maken")

    const device = {
      name,
      friendlyName,
      description,
      "typeId": 2,
      spaceId,
      hardwareId
    }

    const result = await axios.post(`${appSettings.apiBaseUrl}/devices`, device, {
      headers: {
        "Authorization": "Bearer " + appSettings.token
      }
    }).then(res => {
      return res;
    })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

    return result;
  };

  const createSensor = async (deviceId, spaceId, dataType, hardwareId) => {
    console.log("probeer sensor aan te maken")

    const sensor = {
      deviceId,
      "pollRate": 0,
      spaceId,
      "portTypeId": 8,
      "dataUnitTypeId": 7,
      "typeId": 9,
      dataType,
      "dataSubtypeId": 5,
      hardwareId,
    };

    const result = await axios.post(`${appSettings.apiBaseUrl}/sensors`, sensor, {
      headers: {
        "Authorization": "Bearer " + appSettings.token
      }
    }).then(res => {
      return res;
    }).catch(err => {
      console.log(err);
    });

    return result;
  };

  const createProductieStraat = async (spaceName, description, deviceName, friendlyName, deviceDescription, hardwareId, dataTypeId, sensorhardwareId) => {
    setSuccess(false);
    setLoading(true);
    const spaceAanmaken = await createSpace(spaceName, description);
    const deviceAanmaken = await createDevice(deviceName, friendlyName, deviceDescription, spaceAanmaken.data, hardwareId);
    const sensorAanmaken = await createSensor(deviceAanmaken.data, spaceAanmaken.data, dataTypeId, sensorhardwareId)
    console.log("SPACE ID: " + spaceAanmaken.data);
    console.log("DEVICE ID: " + deviceAanmaken.data);
    console.log("SENSOR ID: " + sensorAanmaken.data);
    setLoading(false);
  };


  const handleSensor = (event) => {
    setSensordId(event.target.value);
  }

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });


  return (
    <DashboardLayout title="Productiestraat toevoegen">
      <CssBaseline />
      <Container fixed>
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Productiestraat naam"
                  value={values.spaceNaam}
                  onChange={handleChange('spaceNaam')}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Productiestraat Beschrijving"
                  value={values.spaceDescription}
                  onChange={handleChange('spaceDescription')}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Machine merk"
                  value={values.deviceNaam}
                  onChange={handleChange('deviceNaam')}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Machine Beschrijving"
                  value={values.deviceDescription}
                  onChange={handleChange('deviceDescription')}
                />
              </Grid>
              <Grid item xs={12} sm={1}>

              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Machine Naam"
                  value={values.deviceFriendlyname}
                  onChange={handleChange('deviceFriendlyname')}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Machine ReferentieId"
                  value={values.deviceHardwareID}
                  onChange={handleChange('deviceHardwareID')}
                />
              </Grid>
              <Grid item xs={12} sm={10} lg={10} md={10}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel htmlFor="outlined-age-simple">
                    Soort Sensor
                  </InputLabel>
                  <Select
                    value={sensordId}
                    onChange={handleSensor}
                    input={<OutlinedInput labelWidth="120" id="outlined-age-simple" />}
                  >
                    {sensoren.sensoren.map(sensor =>
                      (
                        <MenuItem key={sensor.name} value={sensor.name}>
                          {sensor.name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Sensor Referentie ID"
                  value={values.sensorHardwareID}
                  onChange={handleChange('sensorHardwareID')}
                />
              </Grid>
              
              <Grid item xs={12} sm={1}>

              </Grid>
            </Grid>
          </form>
          <div className={classes.wrapper}>
            <Button variant="contained" color="primary" className={buttonClassname} disabled={loading} onClick={() => createProductieStraat(values.spaceNaam, values.spaceDescription, values.deviceNaam, values.deviceFriendlyname, values.deviceDescription, values.deviceHardwareID, sensordId, values.sensorHardwareID)}>
              Verzend
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}

export default UserList;
