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
import Loader from '../../components/DisplayMode/'

const token = appSettings.token;
class ProductList extends Component {
  signal = true;
  state = {
    isLoading: false,
    limit: 6,
    products: [],
    productsTotal: 0,
    error: null,
    simulaties: []
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

  componentWillUpdate(prevProps){
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

    console.log(simulaties);
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
              <ProductCard name={product.productieStraat} datum={product.datum}/>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.simulaties.length);


    return (
      <DashboardLayout title="Generated data">
        <div className={classes.root}>
          {this.state.simulaties.length === 0 ? 
           <div className={classes.progressWrapper}><CircularProgress/></div> 
          :
          <div>
            {this.state.simulaties.map(sd => {
            return(
              <div className={classes.sensorBlok}>
                <p>machinenaam: {sd.sensor.machineNaam}</p>
                <p>sensornaam: {sd.sensor.hardwareId}</p>
                <p>sensor value: {sd.value}</p>
              </div>
            );
          })}
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
