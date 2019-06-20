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
      const simulaties = await axios.get("http://localhost:5000/api/SimulationsAPI/1");
      const { products, productsTotal } = await getProducts(limit);
      console.log(simulaties.data);
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

  componentWillMount() {
    this.signal = true;
    const { limit } = this.state;
    this.getProducts(limit);
  }

  componentWillUnmount() {
    this.signal = false;
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
              <ProductCard id={product.key} name={product.productieStraat} datum={product.datum}/>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <DashboardLayout title="Simulaties">
        <div className={classes.root}>
          <ProductsToolbar />
          <div className={classes.content}>{this.renderProducts()}</div>
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
