import MyMarkup from '@/js/MyMarkup';
class Button {
  constructor(viewer) {
    this.viewer = viewer;
    this.myBtnGroup = new Autodesk.Viewing.UI.ControlGroup("bimbdip_add2DPointGroup");;
    this.markup3DBtn = null;
  }

  createMarkupBtn = () => {
    this.markup3DBtn = new Autodesk.Viewing.UI.Button("markup3DBtn");
    this.markup3DBtn.setIcon("fa");
    this.markup3DBtn.setIcon("fa-star");
    this.markup3DBtn.setToolTip('3D标注');
    this.markup3DBtn.onClick = () =>　{
      const myMarkup = new MyMarkup(this.viewer);
      myMarkup.init();
    }
  }

  addControl = () => {
    this.myBtnGroup.addControl(this.markup3DBtn);
    this.viewer.toolbar.addControl(this.myBtnGroup);
  }

  init() {
    this.createMarkupBtn();
    this.addControl();
  }
}

export default Button;