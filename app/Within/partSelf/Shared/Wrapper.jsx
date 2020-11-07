import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import NavFilter from './NavFilter/NavFilter.jsx';
import TitleShareds from './TitleShareds/TitleShareds.jsx';
import NodesFilter from '../../../Components/NodesFilter/NodesFilter.jsx';
import {
  axios_visit_GET_last,
  axios_visit_Index,
  _axios_get_Basic,
  _axios_get_filterFirstUnits
} from './utils.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  setWithinFlag
} from "../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
      viewFilter: false,
      filterStart: null,
      usedNodes: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_viewFilter = this._set_viewFilter.bind(this);
    this._set_filterBasic = this._set_filterBasic.bind(this);
    this._createdRespond = this._createdRespond.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.lastParam != prevProps.lastParam){
      this._set_filterBasic();
    }
  }

  componentDidMount(){
    const self = this;
    this.setState({axios: true});

    this._set_filterBasic();
    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
      });
      axios_visit_Index(this.axiosSource.token);
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comSelfWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>
            <TitleShareds/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <NavFilter
              {...this.props}
              viewFilter={this.state.viewFilter}
              _set_viewFilter={this._set_viewFilter}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            { // render NodesFilter only after the filterStart was fetched
              (this.state.viewFilter && !!this.state.filterStart) ? (
                <NodesFilter
                  nodePageify={false}
                  startListify={true}
                  startList={this.state.usedNodes}
                  startNode={this.state.filterStart}
                  _handle_nodeClick={this._set_viewFilter}
                  _get_firstUnitsList={(nodesList)=>{
                    // return a promise() to NodesFilter
                    let paramsObj = (this.props.lastParam == "pathProject") ? ({
                      depth: 'first', nodesList: nodesList, pathName: this.props.match.params['pathName']
                    }): ({depth: 'first', nodesList: nodesList})
                    return _axios_get_Basic(this.axiosSource.token, {
                      url: (this.props.lastParam == "pathProject") ? '/router/paths/accumulated/nodes': '/router/shareds/accumulated/nodes',
                      params: paramsObj
                    })
                  }}/>
              ):(
                <Feed {...this.props}/>
              )
            }
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {
              this._render_FooterHint()
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {this._createdRespond}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _set_filterBasic(){
    const self = this;
    this.setState({axios: true});

    let promiseFirst = ()=>{
      if(this.props.lastParam=="pathProject"){
        return _axios_get_Basic(this.axiosSource.token, {
          params: {pathName: this.props.userInfo.pathName}, url: '/router/paths/basic'
        })
        .then((resObj)=>{
          this.setState((prevState, props)=>{
            return {
              filterStart: resObj.main.nodeStart,
            };
          });
          return; // to next after f()
        });
      }
      else{
        this.setState((prevState, props)=>{
          return {
            filterStart: this.props.belongsByType[this.props.belongsByType.setTypesList[0]], //could be 'undefined', 'null', or a node
          };
        });
        return Promise.resolve();
      }
    };

    promiseFirst()
    .then(()=>{
      let usedNodesObj = {
        url: (this.props.lastParam == "pathProject" ? '/router/paths/nodes/assigned': '/router/shareds/nodes/assigned'),
        params: (this.props.lastParam == "pathProject" ? {pathProject: this.props.userInfo.pathName} : {})
      };
      return _axios_get_Basic(this.axiosSource.token, getObj);
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          usedNodes: resObj.main.nodesList
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _createdRespond(){
    this.props._set_WithinFlag(true, "chainFetRespond");
  }

  _set_viewFilter(view){
    this.setState({
      viewFilter: !!view ? view : false
    })
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _set_WithinFlag: (bool, flag) => {dispatch(setWithinFlag(bool, flag)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
