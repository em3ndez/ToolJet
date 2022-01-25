import 'codemirror/theme/duotone-light.css';

import React from 'react';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { isEmpty, defaults } from 'lodash';
import Tabs from './Tabs';

import { changeOption } from '../utils';
import { CodeHinter } from '../../../CodeBuilder/CodeHinter';
import { BaseUrl } from './BaseUrl';

class Restapi extends React.Component {
  constructor(props) {
    super(props);
    const options = defaults({ ...props.options }, { headers: [], url_params: [], body: [] });
    this.state = {
      options,
    };
  }

  componentDidMount() {
    try {
      if (isEmpty(this.state.options['headers'])) {
        this.addNewKeyValuePair('headers');
      }
      setTimeout(() => {
        if (isEmpty(this.state.options['url_params'])) {
          this.addNewKeyValuePair('url_params');
        }
      }, 1000);
      setTimeout(() => {
        if (isEmpty(this.state.options['body'])) {
          this.addNewKeyValuePair('body');
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  addNewKeyValuePair = (option) => {
    console.log('addNewKeyValuePair', option);
    const { options } = this.state;
    const newOptions = { ...options, [option]: [...options[option], ['', '']] };

    this.setState({ options: newOptions }, () => {
      this.props.optionsChanged(newOptions);
    });
  };

  removeKeyValuePair = (option, index) => {
    const { options } = this.state;
    options[option].splice(index, 1);

    this.setState({ options }, () => {
      this.props.optionsChanged(options);
    });
  };

  keyValuePairValueChanged = (value, keyIndex, option, index) => {
    const { options } = this.state;

    options[option][index][keyIndex] = value;

    this.setState({ options }, () => {
      this.props.optionsChanged(options);
    });
  };

  handleChange = (key, keyIndex, idx) => (value) => {
    if (this.state.options[key].length - 1 === idx) this.addNewKeyValuePair(key);
    this.keyValuePairValueChanged(value, keyIndex, key, idx);
  };

  render() {
    const { options } = this.state;
    const dataSourceURL = this.props.selectedDataSource?.options?.url?.value;
    const queryName = this.props.queryName;

    return (
      <div>
        <div className="row mt-2" style={{ height: 'fit-content' }}>
          <div className="col-auto rest-methods-options" style={{ width: '90px' }}>
            <SelectSearch
              options={[
                { name: 'GET', value: 'get' },
                { name: 'POST', value: 'post' },
                { name: 'PUT', value: 'put' },
                { name: 'PATCH', value: 'patch' },
                { name: 'DELETE', value: 'delete' },
              ]}
              value={options.method === '' ? 'get' : options.method}
              search={false}
              closeOnSelect={true}
              onChange={(value) => {
                changeOption(this, 'method', value);
              }}
              filterOptions={fuzzySearch}
              placeholder="Method"
            />
          </div>

          <div className="col field mx-3" style={{ display: 'flex' }}>
            {dataSourceURL && (
              <BaseUrl theme={this.props.darkMode ? 'monokai' : 'default'} dataSourceURL={dataSourceURL} />
            )}
            <div className="col-4 rest-methods-field">
              <CodeHinter
                currentState={this.props.currentState}
                initialValue={options.url}
                theme={this.props.darkMode ? 'monokai' : 'default'}
                onChange={(value) => {
                  changeOption(this, 'url', value);
                }}
                placeholder="Enter request URL"
                componentName={`${queryName}::url`}
                mode="javascript"
                lineNumbers={false}
                height={'28px'}
              />
            </div>
          </div>
        </div>

        <div className={`query-pane-restapi-tabs mt-3 ${this.props.darkMode ? 'dark' : ''}`}>
          <Tabs
            theme={this.props.darkMode ? 'monokai' : 'default'}
            options={this.state.options}
            currentState={this.props.currentState}
            onChange={this.handleChange}
            removeKeyValuePair={this.removeKeyValuePair}
            addNewKeyValuePair={this.addNewKeyValuePair}
            darkMode={this.props.darkMode}
            componentName={queryName}
          />
        </div>
      </div>
    );
  }
}

export { Restapi };

/**
 *   <div className={`alert alert-component ${darkMode && 'dark'}`} role="alert">
          <div className="d-flex">
            <div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.75 0C7.82164 0 5.93657 0.571828 4.33319 1.64317C2.72982 2.71451 1.48013 4.23726 0.742179 6.01884C0.00422452 7.80042 -0.188858 9.76082 0.187348 11.6521C0.563554 13.5434 1.49215 15.2807 2.85571 16.6443C4.21928 18.0079 5.95656 18.9365 7.84787 19.3127C9.73919 19.6889 11.6996 19.4958 13.4812 18.7578C15.2627 18.0199 16.7855 16.7702 17.8568 15.1668C18.9282 13.5634 19.5 11.6784 19.5 9.75C19.497 7.16506 18.4688 4.68684 16.641 2.85901C14.8132 1.03118 12.3349 0.00298763 9.75 0ZM9.74991 4.5C9.97241 4.5 10.1899 4.56598 10.3749 4.6896C10.5599 4.81321 10.7041 4.98891 10.7893 5.19448C10.8744 5.40005 10.8967 5.62625 10.8533 5.84448C10.8099 6.06271 10.7027 6.26316 10.5454 6.4205C10.3881 6.57783 10.1876 6.68498 9.96939 6.72838C9.75116 6.77179 9.52496 6.74951 9.31939 6.66436C9.11382 6.57922 8.93812 6.43502 8.81451 6.25002C8.69089 6.06501 8.62491 5.8475 8.62491 5.625C8.62491 5.47726 8.65401 5.33097 8.71055 5.19448C8.76708 5.05799 8.84995 4.93397 8.95442 4.8295C9.05888 4.72504 9.1829 4.64217 9.31939 4.58563C9.45589 4.5291 9.60218 4.5 9.74991 4.5H9.74991ZM10.5 15H9.75C9.6515 15.0001 9.55394 14.9807 9.46292 14.943C9.37191 14.9054 9.2892 14.8501 9.21955 14.7805C9.14989 14.7108 9.09465 14.6281 9.05698 14.5371C9.01931 14.4461 8.99995 14.3485 9 14.25V9.75C8.80109 9.75 8.61033 9.67098 8.46967 9.53033C8.32902 9.38968 8.25 9.19891 8.25 9C8.25 8.80109 8.32902 8.61032 8.46967 8.46967C8.61033 8.32902 8.80109 8.25 9 8.25H9.75C9.84851 8.24994 9.94606 8.2693 10.0371 8.30697C10.1281 8.34465 10.2108 8.39989 10.2805 8.46954C10.3501 8.5392 10.4054 8.6219 10.443 8.71292C10.4807 8.80394 10.5001 8.90149 10.5 9V13.5C10.6989 13.5 10.8897 13.579 11.0303 13.7197C11.171 13.8603 11.25 14.0511 11.25 14.25C11.25 14.4489 11.171 14.6397 11.0303 14.7803C10.8897 14.921 10.6989 15 10.5 15Z"
                  fill="#292D37"
                />
              </svg>
            </div>
            <div className="mx-1">
              Transformations can be used to transform the results of queries. All the app variables are accessible from
              transformers and supports JS libraries such as Lodash & Moment.{' '}
              <a href="https://docs.tooljet.io/docs/tutorial/transformations" target="_blank" rel="noreferrer">
                Read documentation
              </a>
              .
            </div>
          </div>
        </div>
 */
