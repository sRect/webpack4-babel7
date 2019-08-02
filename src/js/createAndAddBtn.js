import MyMarkup from '@/js/MyMarkup';
import ModelAnimation from '@/js/ModelAnimation';
class Button {
  constructor(viewer) {
    this.viewer = viewer;
    this.myBtnGroup = new Autodesk.Viewing.UI.ControlGroup("bimbdip_add2DPointGroup");;
    this.markup3DBtn = null;
    this.recordStateBtn = null;
  }

  createMarkupBtn = () => {
    this.markup3DBtn = new Autodesk.Viewing.UI.Button("markup3DBtn");
    this.markup3DBtn.setIcon("fa-star");
    this.markup3DBtn.setToolTip('3D标注');
    this.markup3DBtn.onClick = () =>　{
      let state = this.markup3DBtn.getState();
      if (state === 0) {
        this.markup3DBtn.setState(1);
      } else if (state === 1) {
        this.markup3DBtn.setState(0);

        const myMarkup = new MyMarkup(this.viewer);
        myMarkup.init();
      }
    }
  }

  createRecordStateBtn = () => {
    this.recordStateBtn = new Autodesk.Viewing.UI.Button("recordStateBtn");
    this.recordStateBtn.setIcon("fa-tachometer");
    this.recordStateBtn.setToolTip('记录视点');
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

          recordBtn.addEventListener('click', ModelAnimation.recordState.bind(ModelAnimation));
          playBtn.addEventListener('click', ModelAnimation.playRecordState.bind(ModelAnimation));
          clearBtn.addEventListener('click', ModelAnimation.clearState.bind(ModelAnimation));
        }
      }
    }
  }

  addControl = () => {
    this.myBtnGroup.addControl(this.markup3DBtn);
    this.myBtnGroup.addControl(this.recordStateBtn);

    this.viewer.toolbar.addControl(this.myBtnGroup);
  }

  init() {
    this.createMarkupBtn();
    this.createRecordStateBtn();
    this.addControl();
  }
}

export default Button;