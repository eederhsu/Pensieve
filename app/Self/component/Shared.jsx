import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import CreateShare from '../../Component/CreateShare.jsx';
import Unit from '../../Component/Unit.jsx';
import SvgCreate from '../../Component/SvgCreate.jsx';
import NailShared from '../../Component/Nails/NailShared.jsx';
//ModalBox used some unstable method, considering updating some day.
import ModalBox from '../../Component/ModalBox.jsx';
import {handleNounsList} from "../../redux/actions/general.js";
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._axios_nails_shareds = this._axios_nails_shareds.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Shared_top_: {
        width: '100%',
        height: '11vh',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2vh 0',
        margin: '2vh 0'
      },
      selfCom_Shared_top_CreateShare_: {
        display: 'inline-block',
        width: '18%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 4%',
        float: 'right'
      },
      selfCom_Shared_nails_: {
        width: '100%',
        position: "relative",
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _axios_nails_shareds(){
    const self = this;
    this.setState({axios: true});
    axios.get('/router/actions/shareds', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })

      self.props._submit_NounsList_new(resObj.main.nounsListMix);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          return null
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }

  _submit_Share_New(dataObj){
    this._axios_nails_shareds();
  }

  componentDidMount(){
    this._axios_nails_shareds();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasic[dataKey];
      return(
        <NailShared
          {...self.props}
          key={'key_Shared_nails_'+index}
          sharedId={dataKey}
          unitBasic={dataValue}
          marksBasic={self.state.marksBasic}/>
      )
    })

    // temp layout, waterfall style someday by setting transform value, following the blueprint
    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={this.style.selfCom_Shared_top_}>
          <div
            style={this.style.selfCom_Shared_top_CreateShare_}>
            <SvgCreate/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_leaveSelf}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {shares}
        </div>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_NounsList_new: (arr)=>{dispatch(handleNounsList(arr));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Shared));
