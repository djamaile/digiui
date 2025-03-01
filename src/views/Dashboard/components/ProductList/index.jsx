import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Shared services
import { getProducts } from 'services/product';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  IconButton,
  Typography,
  CircularProgress
} from '@material-ui/core';
import Foto from "../../../../assets/fabriekstockfoto.png";

// Material icons
import {
  ArrowRight as ArrowRightIcon,
  MoreVert as MoreVertIcon
} from '@material-ui/icons';
import {appSettings} from '../../../../utils/settings';
import axios from 'axios';
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

class ProductList extends Component {
  signal = true;

  state = {
    isLoading: false,
    limit: 4,
    products: [],
    productsTotal: 0,
    error: null,
    productiestraat: []
  };

  async getProducts() {
    try {
      this.setState({ isLoading: true });
      const result = await axios.get(`${appSettings.apiBaseUrl}/spaces?includes=Description`, {
        headers: {
          "Authorization": "Bearer " + appSettings.token
        }
      });

      const spaces = result.data;
      
      const { limit } = this.state;
      const { products, productsTotal } = await getProducts(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          products,
          productsTotal,
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

    this.getProducts();
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
        <Typography variant="h6">There are no products available</Typography>
      );
    }

    console.log();
    const slices = this.state.productiestraat.splice(0,4);
    return (
      <Fragment>
        {slices.map((product, i) => (
          <div
            className={classes.product}
            key={i}
          >
            <div className={classes.productImageWrapper}>
              <img
                alt="Product Name"
                className={classes.productImage}
                src={Foto}
              />
            </div>
            <div className={classes.productDetails}>
              <Link to="#">
                <Typography
                  className={classes.productTitle}
                  variant="h5"
                >
                  {product.name}
                </Typography>
              </Link>
              <Typography
                className={classes.productTimestamp}
                variant="body2"
              >
              </Typography>
            </div>
            <div>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </Fragment>
    );
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const { productsTotal } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader noDivider>
          <PortletLabel
            subtitle={`4 in totaal`}
            title="Recente productiestraten"
          />
        </PortletHeader>
        <PortletContent className={classes.portletContent}>
          {this.renderProducts()}
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            size="small"
            variant="text"
          >
            Overzicht <ArrowRightIcon />
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

ProductList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductList);
