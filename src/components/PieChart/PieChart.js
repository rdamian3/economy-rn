import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import './PieChart.scss';

class PieChart extends Component {
  render() {
    const { movs } = this.props;
    if (Object.entries(movs).length === 0 && movs.constructor === Object) {
      return <div className="pie-no-movements">Aún no hay movimientos...</div>;
    }
    const options = {
      labels: Object.keys(movs),
      legend: {
        show: false
      },
      chart: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
          animateGradually: {
            enabled: true,
            delay: 0
          },
          dynamicAnimation: {
            enabled: true,
            speed: 2350
          }
        }
      }
    };
    const series = Object.values(movs).map(num => Math.abs(num));

    return (
      <div className="Piechart">
        <Chart options={options} series={series} type="pie" />
        <span>Movimientos</span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { movs: state.filteredMovements };
};

export default connect(mapStateToProps)(PieChart);
