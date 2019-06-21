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
import {appSettings} from "../../utils/settings";

const token = appSettings.token;
class ProductList extends Component {
  signal = true;
  state = {
    isLoading: false,
    limit: 6,
    products: [],
    productsTotal: 0,
    error: null, 
    productiestraat: []
  };

  async getProducts(limit) {
    try {
      this.setState({ isLoading: true });

      const result = await axios.get(`${appSettings.apiBaseUrl}/spaces?includes=Description&$orderby=Name`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      const spaces = result.data;
      
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
        {this.state.productiestraat.map(product => (
          <Grid
            item
            key={product.id}
            lg={4}
            md={6}
            xs={12}
          >
            <Link to="#">
              <ProductCard id={product.id} description={product.description} title={product.name}/>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.productiestraat);
    return (
      <DashboardLayout title="Productiestraten">
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
