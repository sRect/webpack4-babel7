import {
  html,
  render
} from 'lit-html';
import MyTween from '@/js/tween_test';

class ModelAnimation {
  constructor(viewer) {
    this.viewer = viewer;
    this.state = null;
  }

  static stateRecordArr = [];

  get currentState() {
    return this.viewer.getState();
  }

  static recordState() { // 记录state
    let state = this.viewer.getState();
    this.stateRecordArr.push(state);
  }

  static clearState () { // 清空记录
    this.stateRecordArr.length = 0;
  }

  static playRecordState() { // 播放记录
    // const _this = this;
    if (!this.stateRecordArr) return; 
    // let tween = new TWEEN.Tween({ ...endState});
    console.log(this.stateRecordArr);
    let myTween = new MyTween(this.viewer, this.stateRecordArr);
    myTween.palyStateRecord()
    // this.stateRecordArr.reduceRight((a, b) => {
    //   let aViewport = a && a.viewport;
    //   let bViewport = b && b.viewport;
    //   new TWEEN.Tween({ target, eye, up } = aViewport).to(
    //     { target, eye, up } = bViewport,
    //     1000
    //   ) // 在1s内移动至 (300, 200)
    //     .easing(TWEEN.Easing.Quadratic.Out) // 使用缓动功能使的动画更加平滑
    //     .onUpdate(function () {
    //       // console.log("=================");
    //       _this.viewer.restoreState({ target, eye, up } = bViewport);
    //     })
    //     .start(); // 立即开始 tween
    // })
  }

  static openDialog = () => {
    let template = html`
      <div class="recordWrap">
        <button class="recordWrapBtn" id="recordBtn">记录当前视点</button> <br>
        <button class="recordWrapBtn" id="playBtn">播放</button> <br>
        <button class="recordWrapBtn" id="clearBtn">清除记录</button>
      </div>
    `;

    render(template, document.getElementById("stateRecordWrap"));
  }

  static closeDialog = () => {
    let stateRecordWrap = document.querySelector("#stateRecordWrap");
    stateRecordWrap && stateRecordWrap.parentNode.removeChild(stateRecordWrap);
  }

  static initStateRecordWrap(viewer) {
    this.viewer = viewer;

    if (!document.querySelector("#stateRecordWrap")) {
      let stateRecordWrap = document.createElement('div');
      stateRecordWrap.id = "stateRecordWrap";
      stateRecordWrap.className = "stateRecordWrap";

      document.body.appendChild(stateRecordWrap);
    }
  }

  init() {
    this.state = this.viewer.getState();
  }
}

export default ModelAnimation;


// var box = document.createElement("div");
// box.style.setProperty("background-color", "red");
// box.style.setProperty("width", "100px");
// box.style.setProperty("height", "100px");
// box.style.setProperty("position", "absolute");
// box.style.setProperty("z-index", "999999");
// document.body.appendChild(box);

// // 设置循环动画
// function animate(time) {
//   requestAnimationFrame(animate);
//   TWEEN.update(time);
// }
// requestAnimationFrame(animate);

// var coords = {
//   x: 0,
//   y: 0
// }; // 起始点 (0, 0)
// var tween = new TWEEN.Tween(coords) // 创建一个新的tween用来改变 'coords'
//   .to(
//     {
//       x: 300,
//       y: 200
//     },
//     1000
//   ) // 在1s内移动至 (300, 200)
//   .easing(TWEEN.Easing.Quadratic.Out) // 使用缓动功能使的动画更加平滑
//   .onUpdate(function () {
//     // 在 tween.js 更新 'coords' 后调用
//     // 将 'box' 移动到 'coords' 所描述的位置，配合 CSS 过渡
//     box.style.setProperty(
//       "transform",
//       "translate(" + coords.x + "px, " + coords.y + "px)",
//     );
//     box.style.setProperty("width", "200px");
//   })
//   .start(); // 立即开始 tween

if (module.hot) {
  module.hot.accept();
}
