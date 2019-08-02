# 用tween.js库实现相机视角平滑运动
___

![avatar](https://img.shields.io/badge/Node-v10.15.0-blue.svg) ![avatar](https://img.shields.io/badge/npm-v6.1.0-blue.svg) ![avatar](https://img.shields.io/badge/webpack-v4.35.0-blue.svg) ![avatar](https://img.shields.io/badge/forge-v6.4.0-blue.svg) ![avatar](https://img.shields.io/badge/@tweenjs/tween.js-v17.4.0-blue.svg)

> TweenJS Javascript库支持渐变的数字对象属性&CSS样式属性,并允许您链接补间动画和行动结合起来,创造出复杂的序列

## 预览
![avatar](https://i.loli.net/2019/08/02/5d43fdd26149c20031.gif)

## 项目目录
```
├── dist
├── index.html
├── jsconfig.json
├── LICENCE
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── src
|  ├── css
|  ├── index.js
|  └── js
├── static
|  ├── 44b3520e-50e6-426b-a189-2b3a6ddad229
|  └── forge6.4
└── webpack.config.js
```

## 使用
```bash
npm install
npm start
// or
npm run build
```

## 核心代码
+ tween_test.js
```javascript
import TWEEN from '@tweenjs/tween.js';

class MyTween {
  constructor(viewer, stateRecordArr) {
    this.targetTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };
    this.posTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };
    this.upTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };

    this.targetTweenDuration = 2500;
    this.posTweenDuration = 2500;
    this.upTweenDuration = 2500;
    this.viewer = viewer;
    this.animate = true;
    this.stateRecordArr = stateRecordArr || []; // 存放state的数组
  }

  tweenCameraTo = ({ viewport: { target, eye, up } } = state, immediate) => {
    if (target && eye && up) {
      let targetEnd = new THREE.Vector3(target[0], target[1], target[2]);
      let posEnd = new THREE.Vector3(eye[0], eye[1], eye[2]);
      let upEnd = new THREE.Vector3(up[0], up[1], up[2]);

      let nav = this.viewer.navigation;
      let copyTarget = new THREE.Vector3().copy(nav.getTarget());
      let copyPos = new THREE.Vector3().copy(nav.getPosition());
      let copyUp = new THREE.Vector3().copy(nav.getCameraUpVector());

      let targetTween = this.createTween({
        easing: this.targetTweenEasing.id,
        onUpdate: (v) => {
          nav.setTarget(v)
        },
        duration: immediate ? 0 : this.targetTweenDuration,
        object: copyTarget,
        to: targetEnd
      });
      let posTween = this.createTween({
        easing: this.posTweenEasing.id,
        onUpdate: (v) => {
          nav.setPosition(v)
        },
        duration: immediate ? 0 : this.posTweenDuration,
        object: copyPos,
        to: posEnd
      });
      let upTween = this.createTween({
        easing: this.upTweenEasing.id,
        onUpdate: (v) => {
          nav.setCameraUpVector(v)
        },
        duration: immediate ? 0 : this.upTweenDuration,
        object: copyUp,
        to: upEnd
      });

      Promise.all([targetTween, posTween, upTween]).then(() => this.animate = false);

      this.runAnimation(true);
    }
  }

  runAnimation = start => {
    if (start || this.animate) {
      if (!this.animate) {
        window.cancelAnimationFrame(this.runAnimation);
        return;
      }
      window.requestAnimationFrame(this.runAnimation);
      console.log("TWEEN.update")
      TWEEN.update();
    }
  }

  createTween = (params) => {
    return new Promise((resolve) => {
      new TWEEN.Tween(params.object)
        .to(params.to, params.duration)
        .onComplete(() => resolve())
        .onUpdate(params.onUpdate)
        .easing(params.easing)
        .start()
    })
  }

  palyStateRecord() { // 进行视点播放
    this && this.stateRecordArr.length && this.stateRecordArr.reverse().forEach(state => this.tweenCameraTo(state, false));
  }
}

export default MyTween;
```

+ modelAnimation.js
```javascript
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

  static recordState() { // 记录state
    let state = this.viewer.getState();
    this.stateRecordArr.push(state);
  }

  static clearState () { // 清空state
    this.stateRecordArr.length = 0;
  }

  static playRecordState() { // 播放记录
    if (!this.stateRecordArr) return; 
    console.log(this.stateRecordArr);
    let myTween = new MyTween(this.viewer, this.stateRecordArr);
    myTween.palyStateRecord()
  }

  ...

  init() {
    this.state = this.viewer.getState();
  }
}

export default ModelAnimation;
```
+ createAndAddBtn.js
```javascript
import ModelAnimation from '@/js/ModelAnimation';
...
this.recordStateBtn.onClick = (e) => {
  let state = this.recordStateBtn.getState();
  if (state === 0) {
    this.recordStateBtn.setState(1);
    ModelAnimation.clearState.bind(ModelAnimation);
    ModelAnimation.closeDialog();
  } else if (state === 1) {
    this.recordStateBtn.setState(0);
    ModelAnimation.initStateRecordWrap(this.viewer);
    ModelAnimation.openDialog();

    let stateRecordWrap = document.querySelector('#stateRecordWrap');
    if (stateRecordWrap) {
      let recordBtn = stateRecordWrap.querySelector('#recordBtn');
      let playBtn = stateRecordWrap.querySelector('#playBtn');
      let clearBtn = stateRecordWrap.querySelector('#clearBtn');

      recordBtn.addEventListener('click', ModelAnimation.recordState.bind(ModelAnimation)); // 记录视点
      playBtn.addEventListener('click', ModelAnimation.playRecordState.bind(ModelAnimation)); // 播放记录
      clearBtn.addEventListener('click', ModelAnimation.clearState.bind(ModelAnimation)); // 清空视点
    }
  }
}
...
```

## 参考资料
+ [Smooth Camera Transitions in the Forge Viewer](https://forge.autodesk.com/blog/smooth-camera-transitions-forge-viewer)
+ [视角（相机）的平滑操作说明文档](http://192.168.5.3/xwiki/bin/view/%E7%A0%94%E5%8F%91%E4%B8%AD%E5%BF%83/004-%E7%A0%94%E5%8F%91/004.01-%E6%A8%A1%E5%9E%8B/004.01.02%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/004.01.02.01%E4%B8%93%E4%B8%9A%E7%89%88/%E8%A7%86%E8%A7%92%EF%BC%88%E7%9B%B8%E6%9C%BA%EF%BC%89%E7%9A%84%E5%B9%B3%E6%BB%91%E6%93%8D%E4%BD%9C%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3/)
+ [tween.js](https://github.com/tweenjs/tween.js)
