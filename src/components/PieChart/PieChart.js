import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import './PieChart.scss';

const PieChart = (props) => {
  const { movements } = props;
  if (Object.entries(movements).length === 0 && movements.constructor === Object) {
    return <div className="pie-no-movements">Aún no hay movimientos...</div>;
  }
  const options = {
    labels: Object.keys(movements),
    legend: {
      show: false,
    },
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 0,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 2350,
        },
      },
    },
  };
  const series = Object.values(movements).map(num => Math.abs(num));

  return (
    <div className="Piechart">
      <Chart options={options} series={series} type="pie" />
      <span>Movimientos</span>
    </div>
  );
};

PieChart.propTypes = {
  movements: PropTypes.shape(PropTypes.shape).isRequired,
};

const mapStateToProps = state => ({ movements: state.filteredMovements });

export default connect(mapStateToProps)(PieChart);
