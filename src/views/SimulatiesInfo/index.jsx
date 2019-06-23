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
import Loader from '../../components/DisplayMode/';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';


const token = appSettings.token;
class ProductList extends Component {
  signal = true;
  state = {
    isLoading: false,
    limit: 6,
    products: [],
    productsTotal: 0,
    error: null,
    simulaties: [],
    checked: false
  };

  async getProducts(limit) {
    try {
      this.setState({ isLoading: true });
      const simulaties = await axios.get(`http://localhost:5000/api/SensorDataAPI/${this.props.match.params.id}`);
      const { products, productsTotal } = await getProducts(limit);
      const data = simulaties.data;
      if (this.signal) {
        this.setState({
          isLoading: false,
          products,
          productsTotal,
          limit,
          simulaties: simulaties.data
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

  componentWillUpdate(prevProps) {
    if (this.props.simulaties !== prevProps.simulaties) {
      this.fetchData(this.props.simulaties);
    }
  }

  componentWillMount() {
    this.signal = true;
    const { limit } = this.state;
    this.intervalId = setInterval(() => this.getProducts(limit), 500);
    this.getProducts(limit);
  }

  componentWillUnmount() {
    this.signal = false;
    clearInterval(this.intervalId);
  }

  handleChangeShow = () =>  {
    this.setState((state, props) => {
      return {checked:!state.checked}
    });
  }


  renderProducts() {
    const { classes } = this.props;
    const { isLoading, simulaties } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (simulaties === 0) {
      return (
        <Typography variant="h6">Nog geen simulaties</Typography>
      );
    }

    return (
      <Grid
        container
        spacing={3}
      >
        {simulaties.map(product => (
          <Grid
            item
            key={product.key}
            lg={4}
            md={6}
            xs={12}
          >
            <Link to="#">
              <ProductCard name={product.productieStraat} datum={product.datum} />
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }




  render() {
    const { classes } = this.props;
    const sensorValues = this.state.simulaties.map(x => x.value);
    const slicedArray = sensorValues.slice(0, 80);
    const data = slicedArray.map(sensorValue => ({ sensorValue }));
    console.log(data);
    return (
      <DashboardLayout title="Generated data">

        <div className={classes.root}>
          {this.state.simulaties.length === 0 ?
            <div className={classes.progressWrapper}><CircularProgress /></div>
            :
            <div>
              <LineChart width={600} height={200} data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line connectNulls={true} type='monotone' dataKey='sensorValue' stroke='#8884d8' fill='#8884d8' />
              </LineChart>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleChangeShow}>
                Ruwe data
              </Button>
              <Collapse in={this.state.checked}>
                {this.state.simulaties.map(sd => {
                  return (
                    <div className={classes.sensorBlok}>
                      <p>machinenaam: {sd.sensor.machineNaam}</p>
                      <p>sensornaam: {sd.sensor.hardwareId}</p>
                      <p>sensor value: {sd.value}</p>
                    </div>
                  );
                })}
              </Collapse>

            </div>
          }
        </div>

      </DashboardLayout>
    );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductList);
