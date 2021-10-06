import PropTypes from 'prop-types';
import React, {
  PureComponent,
} from 'react';
import './styles.module.scss';

class CovidCounter extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      covidData: [],
    };
  }

  componentDidMount () {
    const covidResponse = fetch('https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=CA')
      .then((r) => {
        return r.json();
      })
      .then((r) => {
        return r.locations;
      })
      .then((r) => {
        return r.map((x) => {
          return {province: x.province,
            ...x.latest};
        });
      })
      .catch((err) => {
        return console.error(`COVID ERROR: ${JSON.stringify(err)}`);
      });

    Promise.resolve(covidResponse).then((values) => {
      this.setState({
        covidData: values,
      });
    });
  }

  render () {
    return (
      <>
        <h1>COVID DASHBOARD for Canada</h1>
        <table>
          <thead>
            <tr>
              { this.state.covidData.length !== 0 ?
                Object.keys(this.state.covidData[0]).map((title) => {
                  return <th key='title'>{title}</th>;
                }) :
                <th>Retrieving Data</th>}
            </tr>
          </thead>
          <tbody>
            {
              this.state.covidData.map((c) => {
                return (
                  <tr>
                    {
                      Object.values(c).map((value) => {
                        return (
                          <td key='value'>{value}</td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan='100%'>
                source: <a href='https://systems.jhu.edu/research/public-health/ncov/' rel='noreferrer' target='_blank'>Johns Hopkins University</a>
              </td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  }
}

CovidCounter.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default CovidCounter;
