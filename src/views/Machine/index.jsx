import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  IconButton,
  CircularProgress,
  Grid,
  Typography
} from '@material-ui/core';
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';
import { Dashboard as DashboardLayout } from 'layouts';
import { getProducts } from 'services/product';
import { ProductsToolbar, ProductCard } from './components';
import styles from './styles';
import axios from "axios";
import { appSettings } from "../../utils/settings";
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr/dist/browser/signalr';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const token = appSettings.token;
const connection = new HubConnectionBuilder()
  .withUrl(`http://localhost:5000/sensors`)
  .configureLogging(LogLevel.Information)
  .build();

class ProductList extends Component {
  
  signal = true;
  state = {
    isLoading: false,
    limit: 6,
    products: [],
    productsTotal: 0,
    error: null,
    productiestraat: [],
    simulatieStatus: false,
    onderwaarde: 0,
    bovenwaarde: 0,
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  async getProducts(limit) {
    try {
      this.setState({ isLoading: true });

      const result = await axios.get(`${appSettings.apiBaseUrl}/spaces/${this.props.match.params.id}?includes=Devices,DevicesSensors,SensorsTypes`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      const spaces = [result.data];
      console.log(spaces);
      const { products, productsTotal } = await getProducts(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          products,
          productsTotal,
          limit,
          productiestraat: spaces
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  componentWillMount() {
    this.signal = true;

    const { limit } = this.state;

    this.getProducts(limit);
  }

  componentWillUnmount() {
    this.signal = false;
  }

  submitData = () => {
    this.setState({ simulatieStatus: true })
    const sensors = [
      {
        "DataType": "Temperature",
        "HardwareId": "daniyal_sensor_2389",
        "MachineNaam": "daniyal machine"
      },
      {
        "DataType": "Temperature",
        "HardwareId": "djamaile_sensor_2380",
        "MachineNaam": "djamaile machine"
      }
    ];

    const simulation = {
      "ProductieStraat": this.state.productiestraat.name,
      "KlantId": "1",
      "Bovenwaarde": this.state.bovenwaarde,
      "Onderwaarde": this.state.onderwaarde
    }

    this.connectToSocket(sensors, simulation, null);
  };

  connectToSocket = (sensors, simulation, status) => {


    if (status === 'stop') {
      connection.stop();
      this.setState({ simulatieStatus: false })
    }

    connection.on('Status', (data) => {
      console.log(data);
    });


    connection.on('SensorData', (data) => {
      console.log(data);
    });


    connection.start()
      .then(() => connection.invoke('SubscribeSensorData', sensors, simulation))
      .catch(() => {
      });
  }


  renderProducts() {
    const { classes } = this.props;
    const { isLoading, products } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <Typography variant="h6">Nog geen productiestraat aangemaakt</Typography>
      );
    }

    return (
      <Grid
        container
        spacing={3}
      >
        {this.state.productiestraat.map(x => (
          x.devices.map(d => (
            <Grid
              item
              key={d.id}
              lg={4}
              md={6}
              xs={12}
            >
              <Link to="#">
                <ProductCard id={d.id} description={d.name} title={d.friendlyName} />
              </Link>
            </Grid>
          ))
        ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Machine's">
        <div className={classes.root}>
          <ProductsToolbar />
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="outlined-name"
              name="onderwaarde"
              label="onderwaarde"
              className={classes.textField}
              value={this.state.onderwaarde}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-name"
              name="bovenwaarde"
              label="bovenwaarde"
              className={classes.textField}
              value={this.state.bovenwaarde}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
          </form>
          <div className={classes.content}>{this.renderProducts()}</div>
          {this.state.simulatieStatus === false ?
            <Button variant="contained" className={classes.button} color="primary" onClick={() => this.submitData()}>
              Simulatie starten
            </Button>
            :
            <Button variant="contained" className={classes.buttonStop} color="secondary" onClick={() => this.connectToSocket(null, null, 'stop')}>
              Simulatie stoppen
            </Button>
          }
          <div className={classes.pagination}>
            <Typography variant="caption">1-6 of 20</Typography>
            <IconButton>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductList);
