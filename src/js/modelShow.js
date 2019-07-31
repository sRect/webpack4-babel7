let path = './static/44b3520e-50e6-426b-a189-2b3a6ddad229/3d.svf';

const docs = [{
  "path": path,
  "name": "Scene"
}];

const options = {
  'docid': docs[0].path,
  env: 'Local'
};

function modelShow(callback) {
  let oViewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById("app"), {}); // With toolbar
  Autodesk.Viewing.Initializer(options, function () {
    oViewer.initialize();
    oViewer.load(options.docid);
    oViewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
      callback(oViewer)
    });
  });
}

export default modelShow;