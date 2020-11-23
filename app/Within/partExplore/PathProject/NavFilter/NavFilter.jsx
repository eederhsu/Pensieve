import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToTop} from '../../../../Components/Svg/SvgArrow.jsx';
import SvgFilterNode from '../../../../Components/Svg/SvgFilter_Node.jsx';
import SvgArrowStick from '../../../../Components/Svg/SvgArrowStick.jsx';
import SvgNetGlobe from '../../../../Components/Svg/SvgIcon_NetGlobe.jsx';
import {
  domain
} from '../../../../../config/services.js';

class NavFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onArrow: false,
      onFilterNode: false,
      onNodeLink: false,
      onSetlink: false
    };
    this._handleClick_filter = this._handleClick_filter.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
    this._handleEnter_Setlink = this._handleEnter_Setlink.bind(this);
    this._handleLeave_Setlink = this._handleLeave_Setlink.bind(this);
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
    this._handleLeave_CloseArrow = this._handleLeave_CloseArrow.bind(this);
    this._handleEnter_CloseArrow = this._handleEnter_CloseArrow.bind(this);
    this._handleClick_filterClose = this._handleClick_filterClose.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_resetLink(){
    let linkObj = {
      pathname: this.props.location.pathname,
      search: '',
      state: {from: this.props.location}
    };

    return (
      <Link
        to={linkObj}
        className={classnames(
          'plainLinkButton', styles.linkBlock,
           styles.boxSvgArrow)}
        onMouseEnter={this._handleEnter_CloseArrow}
        onMouseLeave={this._handleLeave_CloseArrow}>
        <SvgArrowToTop
          mouseOn={this.state.onArrow}
          customStyles={{fillColorMouseOn: '#ff8168', fillColor: '#a3a3a3'}}/>
      </Link>
    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;

    return (
      <div className={styles.comNavFilter}>
        <div
          className={classnames(
            styles.boxRowInfo)}>
          <div
            className={classnames(styles.boxProjectInfo)}>
            {
              ("description" in this.props.projectInfo) &&
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {this.props.projectInfo.description}
              </span>
            }
            {
              ("webLink" in this.props.projectInfo && !!this.props.projectInfo.webLink) &&
              <div
                className={classnames(styles.boxProjectInfoAlias)}>
                <a
                  href={domain.protocol + "://" + this.props.projectInfo.webLink}
                  target={"_blank"}
                  className={classnames(
                    "plainLinkButton", styles.linkSetlink)}
                  onMouseEnter={this._handleEnter_Setlink}
                  onMouseLeave={this._handleLeave_Setlink}>
                  <div
                    className={classnames(styles.boxSvgNetGlobe)}>
                    <SvgNetGlobe/>
                  </div>
                  <span
                    className={classnames(
                      "fontContentPlain", "weightBold", "colorDescripBlack",
                      styles.spanLinkSetlink,
                      { [styles.spanLinkSetlinkMouse]: this.state.onSetlink }
                    )}>
                    {this.props.projectInfo.webLink}
                  </span>
                </a>
              </div>
            }
          </div>
          <div
            className={classnames(styles.boxFilter)}>
            {
              this.props.viewFilter &&
              <div
                onClick={this._handleClick_filterClose}>
                {
                  <div
                    className={classnames(styles.boxSvgArrowStick)}
                    onMouseEnter={this._handleEnter_FilterNode}
                    onMouseLeave={this._handleLeave_FilterNode}>
                    <SvgArrowStick
                      customstyle={this.state.onFilterNode ? (
                        {
                          cls1: "{fill:none;stroke:#ff8168;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                          cls2: "{fill:#ff8168}"
                        }
                      ): (
                        {
                          cls1: "{fill:none;stroke:rgb(69, 135, 160);stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                          cls2: "{fill:rgb(69, 135, 160)}"
                        }
                      )}/>
                  </div>
                }
              </div>
            }
            {
              !this.props.viewFilter &&
              <div
                className={classnames(styles.boxIconsFilter)}>
                <Link
                  to={"/cosmic/explore/path/" + this.props.projectPath}
                  className={classnames('plainLinkButton', styles.boxIconFilterNode)}
                  onClick={this._handleClick_filter}
                  onMouseEnter={this._handleEnter_FilterNode}
                  onMouseLeave={this._handleLeave_FilterNode}>
                  <SvgFilterNode
                    customstyle={this.state.onFilterNode ? "{fill: #ff8168;}" : "{fill: rgb(69, 135, 160);}"}/>
                </Link>
              </div>
            }
          </div>
        </div>
        {
          !!this.filterNode ? (
            <div
              className={classnames(
                styles.boxRowFilterMargin, styles.boxRowFilterNodeFlex)}>
              <div>
                <span
                  className={classnames(
                    styles.spanFilterCross,
                    "fontContent", "weightBold", "lineHeight15", "colorAssistGold")}>
                    {"X "}
                  </span>
                <Link
                  nodeid={this.filterNode}
                  to={"/cosmic/explore/node?nodeid=" + this.filterNode}
                  className={classnames('plainLinkButton')}
                  style={{ display: 'inline-block' }}
                  onMouseEnter={this._handleEnter_NodeLink}
                  onMouseLeave={this._handleLeave_NodeLink}>
                  {(this.filterNode in this.props.nounsBasic) &&
                    <span
                      className={classnames(
                        "fontNodesEqual", "weightBold", "colorEditBlack",
                        styles.spanLinkNode,
                        { [styles.spanLinkNodeMouse]: this.state.onNodeLink == this.filterNode }
                      )}>
                    {this.props.nounsBasic[this.filterNode].name}</span>
                  }
                </Link>
              </div>
              {this._render_resetLink()}
            </div>
          ) : (
            this.props.viewFilter &&
            <div
              className={classnames(styles.boxRowFilterMargin)}>
              <span
                className={classnames(
                  styles.spanFilterCross,
                  "fontContent", "weightBold", "lineHeight15", "colorEditBlack")}>
                  {"X "}
              </span>
              <div
                className={classnames(
                  styles.boxInputLine,
                  "fontContent", "lineHeight15", "colorWhiteGrey")}>
                <span>{this.props.i18nUIString.catalog['hint_PathProject_FilterNode']}</span>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  _handleClick_filter(event){
    if(!this.filterNode){ // currently 'null', no param 'filterNode'
      event.preventDefault();
      event.stopPropagation();
    }

    this.props._set_viewFilter('filter')
  }

  _handleClick_filterClose(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_viewFilter(null)
  }

  _handleEnter_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: true
      }
    })
  }

  _handleLeave_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: false
      }
    })
  }

  _handleEnter_Setlink(e){
    this.setState((prevState, props)=>{
      return {
        onSetlink: true
      }
    })
  }

  _handleLeave_Setlink(e){
    this.setState((prevState, props)=>{
      return {
        onSetlink: false
      }
    })
  }

  _handleEnter_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: true
      }
    })
  }

  _handleLeave_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: false
      }
    })
  }

  _handleEnter_NodeLink(e) {
    let targetNode = e.currentTarget.getAttribute('nodeid');
    this.setState({ onNodeLink: targetNode })
  }

  _handleLeave_NodeLink(e) {
    this.setState({ onNodeLink: false })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavFilter));