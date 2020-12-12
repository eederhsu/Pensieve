import React from 'react';
import {
  Link,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import Nav from './Nav/Nav.jsx';
import TitleUser from './TitleUser/TitleUser.jsx';
import {
  _axios_get_projectBasic,
  _axios_get_projectNodes,
  _axios_get_projectLayerFirstUnits
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import NodesFilter from '../../../Components/NodesFilter/NodesFilter.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      pathName: false,
      projectName: '',
      filterStart: null,
      projectInfo: {},
      usedNodes: [],
      redirectFilter: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_viewFilter = this._set_viewFilter.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_projectBasic = this._set_projectBasic.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if( (this.state.redirectFilter == prevState.redirectFilter)	&& this.state.redirectFilter){ // if just redirect to or from Filter
      this.setState({
	      redirectFilter: false
      });
    };
    if(this.props.match.params['pathName'] != prevProps.match.params['pathName']){
      this._set_projectBasic();
    };
  }

  componentDidMount(){
    this._set_projectBasic();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    if(this.state.redirectFilter){
	    /*
	      Notice!, this is not a good method.
	      we should redirect only when close from NodesFilter, a general component.
	      any other path, passed from Nav, should be dealted with insde the Nav.
		    */
        let toSearch = new URLSearchParams(this.props.location.search);
        if(this.state.redirectFilter == "filter"){
          toSearch.append("_filter_nodes", true);
        } else toSearch.delete("_filter_nodes");

        return <Redirect
          to={{
            pathname: this.props.location.pathname,
            search: toSearch.toString(),
            state: {from: this.props.location}
          }}/>;
    };
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.userId = urlParams.get('userId');
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;
    if(urlParams.has('_filter_nodes')){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return(
      <div>
        <div
          className={classnames(styles.comPathProject)}>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxTitle)}>
              <TitleUser
                userId = {this.userId}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRowNav)}>
            <Nav
              {...this.props}
              _set_viewFilter={this._set_viewFilter}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <Content/>
            { // render NodesFilter only after the filterStart was fetched
              (this.viewFilter && !!this.state.filterStart) ? (
                <div
                  className={classnames(styles.boxNodesFilter)}>
                  <NodesFilter
                    nodePageify={true}
                    startListify={true}
                    startList={this.state.usedNodes}
                    startNode={this.state.filterStart}
                    _handle_nodeClick={this._set_viewFilter}
                    _get_firstUnitsList={(nodesList)=>{
                      // return a promise() to NodesFilter
                      return _axios_get_projectLayerFirstUnits(this.axiosSource.token, {
                        nodesList: nodesList, pathName: this.props.match.params['pathName']
                      })
                    }}/>
                  <div className={classnames(styles.boxFooter)}/>
                </div>
              ):(
                <div
                  className={classnames(styles.boxFeed)}>
                  <Feed {...this.props}/>
                </div>
              )
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            // PathProject allow no token browse, so we have to use different Unit for both condition
            return (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
              <UnitUnsign
                {...props}
                _refer_von_unit={this.props._refer_to}/>
            ):(
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _set_viewFilter(view){
    this.setState({
	    redirectFilter: !!view ? view : true // currently, always redirect it triggered
    })
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _set_projectBasic(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectBasic(this.axiosSource.token, this.props.match.params['pathName'])
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          pathName: resObj.main.pathName,
          projectName: resObj.main.name,
          filterStart: resObj.main.nodeStart,
          projectInfo: resObj.main.otherInfo
        };
      });

      return _axios_get_projectNodes(this.axiosSource.token, this.props.match.params['pathName']);
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

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));