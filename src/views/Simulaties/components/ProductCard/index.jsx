import React, { Component } from 'react';
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
import Foto from "../../../../assets/simulatie.png";
import { Link, NavLink } from 'react-router-dom';

class ProductCard extends Component {
  render() {
    const { classes, className} = this.props;
    const rootClassName = classNames(classes.root, className);
    const linkTo = `/simulaties/info/${this.props.id}`;

    return (
      <Link to={linkTo}>
      <Paper className={rootClassName}>
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
           Simulatie van:  {this.props.name}
          </Typography>
          <Typography
            className={classes.description}
            variant="body1"
          >
           Datum:  {this.props.datum}
          </Typography>
        </div>
      </Paper>
      </Link>
    );
  }
}

ProductCard.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCard);
