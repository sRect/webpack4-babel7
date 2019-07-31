import nanoid from 'nanoid';
import {
  html,
  render
} from 'lit-html';
import Toolkit from '@/js/Viewer.Toolkit';
import { debounce } from 'lodash';

class MyMarkup {
  constructor(viewer) {
    this.viewer = viewer;
    this.offsetLeft = viewer.container.offsetLeft || 0;
    this.offsetTop = viewer.container.offsetTop || 0;
    this.startPoint = {};
  }

  initMarkupWrap() {
    let myMarkupWrap = document.createElement('div');
    myMarkupWrap.id = "myMarkupWrap";

    this.viewer.container.appendChild(myMarkupWrap);
  }

  // 监听click
  listenModelClick = e => {
    return new Promise((resolve, reject) => {
      let clientX = e.clientX,
        clientY = e.clientY;
      
      let hitTest = this.viewer.clientToWorld(clientX, clientY, true);
      if (hitTest) {
        resolve(hitTest);
      }
      reject(null);
    })
  }

  // 绘制icon
  _drawPushpin = async (str, hitTest) => {
    let screenpoint = this.viewer.worldToClient(new THREE.Vector3(
      hitTest.point.x,
      hitTest.point.y,
      hitTest.point.z));
    return html `
      <span 
        class="myMarkup" 
        data-nanoid="${nanoid()}" 
        data-hittestpoint="${JSON.stringify(hitTest.point)}" 
        style="left:${screenpoint.x}px; top: ${screenpoint.y}px;">
        ${str}
      </span>
    `
  }

  // 创建标记
  createMarkup = async () => {
    try {
      let [error, hitTest] = await this.listenModelClick(event)
        .then(data => [null, data])
        .catch(error => [error, null]);
      
        if (hitTest) {
          let template = await this._drawPushpin('hello', hitTest);
          render(template, document.querySelector("#myMarkupWrap"));

          this.viewer.container.removeEventListener('click', this.createMarkup, false);
        }
    }catch(error) {
      console.log(error);
    }
  }

  getModifiedWorldBoundingBox(fragIds, fragList) {
    const fragbBox = new THREE.Box3()
    const nodebBox = new THREE.Box3()

    fragIds.forEach(function (fragId) {
      fragList.getWorldBounds(fragId, fragbBox)
      nodebBox.union(fragbBox)
    })

    return nodebBox;
  }

  async getComponentBoundingBox(model, dbId) {
    const fragIds = await Toolkit.getFragIds(model, dbId);
    const fragList = model.getFragmentList();

    return this.getModifiedWorldBoundingBox(fragIds, fragList);
  }

   // 递归获取根节点
  checkMenuDbid(dbid, dbidResult, it) {
    if (it.getChildCount(dbid) > 0) {
      it.enumNodeChildren(dbid, function (childId) {
        var num = it.nodeAccess.getNumChildren(childId);
        if (num <= 0) {
          dbidResult.push(childId);
        }
      }, true);
    } else {
      dbidResult.push(dbid);
    }

    return dbidResult;
  }

  // normalize
  normalize = (t) => {
    var e = this.viewer.navigation.getScreenViewport(),
      n = {
        x: (t.x - e.left) / e.width,
        y: (t.y - e.top) / e.height
      };
    return n
  }

  // getHitData
  getHitData = (t, e) => {
    e = 1 - e,
      t = 2 * t - 1,
      e = 2 * e - 1;
    var n = new THREE.Vector3(t, e, 1),
      r = this.viewer.impl.hitTestViewport(n, !1);
    return r ? r : null
  }

  // checkOcclusion
  checkOcclusion = (startPoint, worldPoint) => {
    let t = this.normalize({
        x: startPoint.x + this.offsetLeft,
        y: startPoint.y + this.offsetTop
      }),
      e = this.getHitData(t.x, t.y);

    if (e) {
      // if (e.dbId)
      //   return !0;
      // var n = this.pinMarker.getWorldPoint()
      var n = worldPoint,
        r = {
          x: e.intersectPoint.x - n.x,
          y: e.intersectPoint.y - n.y,
          z: e.intersectPoint.z - n.z
        },
        i = r.x * r.x + r.y * r.y + r.z * r.z;
      if (i > 25)
        return !0
    }
    return !1
  }

  // 获取视点内所有构件
  async getCurrentViewpointAllDbids() {
    return new Promise((resolve, reject) => {
      let frustum = new THREE.Frustum();
      let camera = this.viewer.impl.camera;
      let model = this.viewer.impl.model;
      let cameraViewProjectionMatrix = new THREE.Matrix4();

      camera.matrixWorldInverse.getInverse(camera.matrixWorld);
      cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromMatrix(cameraViewProjectionMatrix);

      let rootID = model.getRootId();
      let it = model.getInstanceTree();
      let dbidArrayToSelect = [];

      if (it) {
        let allDbidArr = [];
        allDbidArr = this.checkMenuDbid(rootID, [], it);

        if (allDbidArr.length) {
          allDbidArr.forEach(async dbid => {
            let box = await this.getComponentBoundingBox(model, dbid);

            if (frustum.intersectsBox(box)) {
              dbidArrayToSelect.push(dbid);
            }
          })
        }

        resolve(dbidArrayToSelect)
      } else {
        reject([]);
      }
    })
    
  }

  // 相机change
  handleCameraChange = debounce(async (e) => {
    let myMarkupWrap = this.viewer.container.querySelector("#myMarkupWrap");
    let markupList = myMarkupWrap.querySelectorAll(".myMarkup");

    [...markupList].forEach(el => {
      let pushpinModelPt = JSON.parse(el.dataset.hittestpoint);
      let screenpoint = this.viewer.worldToClient(new THREE.Vector3(
        pushpinModelPt.x,
        pushpinModelPt.y,
        pushpinModelPt.z));

      el.style.left = screenpoint.x + 'px';
      el.style.top = screenpoint.y + 'px';

      var checkOcclusion = this.checkOcclusion(screenpoint, pushpinModelPt);
      el.style.display = checkOcclusion ? 'none' :'block';
    })
  }, 20)

  init() {
    this.initMarkupWrap();
    this.viewer.container.addEventListener('click', this.createMarkup, false);
    this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.handleCameraChange);
  }
}

export default MyMarkup;