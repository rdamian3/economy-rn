import React from 'react';
import ActualState from '../../components/ActualState/ActualState';
import PieChart from '../../components/PieChart/PieChart';
import './Dashboard.scss';

function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="card">
        <ActualState />
      </div>
      <div className="card">
        <PieChart />
      </div>
      <div className="card">Card3</div>
      <div className="card">Card4</div>
    </div>
  );
}

export default Dashboard;
