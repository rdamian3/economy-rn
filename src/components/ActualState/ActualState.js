import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './ActualState.scss';

class ActualState extends Component {
  render() {
    const { total, monthBalance } = this.props;

    return (
      <div className="ActualState">
        {total !== 0 ? (
          <div className="body">
            <div className="global">
              <div className="title">Tu balance global</div>
              <span
                className={'total ' + (total >= 0 ? 'possitive' : 'negative')}
              >
                $ {total}
              </span>
            </div>
            <div className="month">
              <div className="title">Tu balance de éste mes:</div>
              <span className="subtitle">
                {moment()
                  .locale('es')
                  .format('MMMM')}
              </span>
              <span
                className={
                  'monthly ' + (monthBalance >= 0 ? 'possitive' : 'negative')
                }
              >
                $ {monthBalance}
              </span>
            </div>
          </div>
        ) : (
          <div className="no-movements">
            <span>
              Aún no hay movimientos. Anímate y empieza a agregar algunos!
            </span>
            <Link to={'/list'} className="start">
              Comenzar!
            </Link>
          </div>
        )}

        <div className="foot-text" />
      </div>
    );
  }
}

const mapStateToProps = ({ movements, total }) => {
  const monthBalance = movements
    .map(el => {
      return { amount: el.amount, month: moment(el.date).format('M') };
    })
    .filter(el => {
      return el.month === moment().format('M');
    })
    .reduce((acc, current) => {
      return acc + current.amount;
    }, 0);

  return {
    total,
    monthBalance
  };
};

export default connect(mapStateToProps)(ActualState);
