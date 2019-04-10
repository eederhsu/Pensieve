import React from 'react';

export default class ImgPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_ImgPreview_preview = this._handleClick_ImgPreview_preview.bind(this);
    this.style={
      Com_div_ImgPreview_ImgPreview: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundSize: 'cover',
        boxShadow: '-0.1rem 0.1rem 0.4rem 0',
        borderRadius: '0.5vw',
        overflow: 'hidden',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_ImgPreview_preview(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_ImgPreview_preview(this.props.blockName);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={Object.assign({}, this.style.Com_div_ImgPreview_ImgPreview, {backgroundImage: 'url('+this.props.previewSrc+')'})}
        onClick={this._handleClick_ImgPreview_preview}>
      </div>
    )
  }
}
