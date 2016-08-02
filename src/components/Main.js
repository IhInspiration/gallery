require('normalize.css/normalize.css');
require('styles/App.scss');

var React = require('react');
var ReactDOM = require('react-dom');

//获取图片相关数据
var imageDatas = require('../data/imageData.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function (imageDatasArr){
  for(var i = 0, j = imageDatasArr.length; i < j; i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass({

  /**
   * imgFigure的点击函数
   * @param e
     */
  handleClick: function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },

  render: function(){

    var styleObj = {};

    //如果props属性中指定位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate){
      ['-moz-', '-ms-', '-webkit-', ''].forEach(function(value){
        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));

      //styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }

    var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
                <p>
                  {this.props.data.desc}
                </p>
            </div>
          </figcaption>
      </figure>
    );
  }
});

//获取区间内随机值
function getRangeRandom(low, high){
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30度之间任意正负值
function get30DegRandom(){
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

//控制组件
var ControllerUnit = React.createClass({
  handleClick: function(e){

    e.preventDefault();
    e.stopPropagation();
  },
  render: function(){
    return(
      <span className="controller-unit" onClick={this.handleClick}></span>
    );
  }
});

var GalleryComponent = React.createClass({
    Constant:{
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange:{
        x: [0, 0],
        topY: [0, 0]
      }
    },

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {function} 这是一个闭包，其内return一个真正待被执行的函数
   */
  inverse: function(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });

    }.bind(this);
  },
  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
    rearrange: function(centerIndex){
      var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,

          imgsArrangeTopArr = [],
          topImgNum = Math.ceil(Math.random() * 2),
          topImgSpliceIndex = 0,  //标记布局在上面图片是从哪块取出
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

          //首先居中centerIndex的图片,居中图片不旋转
          imgsArrangeCenterArr[0] = {
            pos : centerPos,
            rotate : 0,
            isCenter: true
          };

          //取出要布局上侧图片信息
          topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

          //布局上侧图片
          imgsArrangeTopArr.forEach(function(value, index){
            imgsArrangeTopArr[index] = {
              pos: {
               top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
               left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            }
          });

          //布局左右图片
          for(var i = 0, j = imgsArrangeArr.length, k = j /2; i < j; i++){
            var hPosRangeLORX = null;//左或者右布局范围

            //前半部分布局左边，右半部分布局右边
            if(i < k){
              hPosRangeLORX = hPosRangeLeftSecX;
            }else{
              hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos : {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            }
          }
          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

          this.setState({
            imgsArrangeArr: imgsArrangeArr
          });
    },

  /**
   * 利用 rearrange函数,居中对应index的图片
   * @param index
   * @returns {function(this:GalleryComponent)}
     */
    center: function(index){
      return function(){
        this.rearrange(index);
      }.bind(this);
    },

    getInitialState: function(){
      return{
        imgsArrangeArr: [
          //{
          //  pos: {
          //    left: '0',
          //    top: '0'
          //  },
          //  rotate: 0,  //旋转角度
          //  isInverse: false,  //图片正反面
          //  isCenter: false    //图片是否居中
          //}
        ]
      };
    },

    //组件加载以后，为每张图片计算其位置的范围
    componentDidMount: function(){
      //首先获取舞台大小
      var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);
      //获取一个imageFigure的大小
      var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

      //计算中心图片位置
      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      };

      //计算左右区域图片排布位置取值范围
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;

      //计算上部区域图片排布位置取值范围
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;

      this.rearrange(0);
    },
    render: function(){

      var controllerUnits = [],
          imgFigures = [];

      imageDatas.forEach(function(value, index){
        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos: {
              left: "0",
              top: "0"
            },
            rotate: 0,
            isInverse: false,
            isCenter: false
          }
        }

        imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
        center={this.center(index)}/>);

        controllerUnits.push(<ControllerUnit />);

      }.bind(this));



      return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
    );
    }
  });

GalleryComponent.defaultProps = {
};

export default GalleryComponent;
