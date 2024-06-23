var mouseState = "select"
var dragcontrols;

// select mode
function mouseSelectMode() {
  mouseState = "select"
  scalewindow.style.visibility = "hidden";
  $(".mouseSelectBtn").addClass('tbtnactive');
  $(".mouseMoveBtn").removeClass('tbtnactive');
  $(".mouseDelBtn").removeClass('tbtnactive');
  $(".mouseScaleBtn").removeClass('tbtnactive');
  if (dragcontrols) {
    dragcontrols.dispose();
  }
  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  if (!isMac) {
    if (controls.enableRotate) {
      helpoverlay.innerHTML = "<kbd>左键</kbd> = 选择 / <kbd>中键</kbd> = 旋转 / <kbd>右键</kbd> = 移动 / <kbd>Wheel</kbd> = 缩放 / <kbd>Ctrl</kbd> = 多选 / <kbd>Del</kbd> = 删除所选"
    } else {
      helpoverlay.innerHTML = "<kbd>左键</kbd> = 选择 / <kbd>右键</kbd> = 移动 / <kbd>Wheel</kbd> = 缩放 / <kbd>Ctrl</kbd> = 多选 / <kbd>Del</kbd> = 删除所选"
    }
  } else {
    if (controls.enableRotate) {
      helpoverlay.innerHTML = "<kbd>左键</kbd> = 选择 / <kbd>中键</kbd> = 旋转 / <kbd>右键</kbd> = 移动 / <kbd>Wheel</kbd> = 缩放 / <kbd>Ctrl</kbd> = 多选 / <kbd>Del</kbd> = 删除所选"
    } else {
      helpoverlay.innerHTML = "<kbd>Ctrl</kbd> = 多选 / <kbd>Del</kbd> = 删除所选"
    }
  }

};

// move mode
function mouseMoveMode() {
  mouseState = "move"
  scalewindow.style.visibility = "hidden";
  $(".mouseSelectBtn").removeClass('tbtnactive');
  $(".mouseMoveBtn").addClass('tbtnactive');
  $(".mouseDelBtn").removeClass('tbtnactive');
  $(".mouseScaleBtn").removeClass('tbtnactive');
  // deselectAllObjects()
  var documents2 = scene.getObjectByName("Documents");
  dragcontrols = new THREE.DragControls(objectsInScene, camera, renderer.domElement);
  helpoverlay.innerHTML = "<kbd>鼠标左键拖动</kbd> = 选择要移动的文档 / <kbd>Ctrl+鼠标左键拖动</kbd> = 选择要移动的实体 / <kbd>Del</kbd> = 删除所选"
};

// delete mode
function mouseEraseMode() {
  mouseState = "delete"
  scalewindow.style.visibility = "hidden";
  $(".mouseSelectBtn").removeClass('tbtnactive');
  $(".mouseMoveBtn").removeClass('tbtnactive');
  $(".mouseDelBtn").addClass('tbtnactive');
  $(".mouseScaleBtn").removeClass('tbtnactive');
  deselectAllObjects()
  $('#renderArea').css('cursor', '');
  if (dragcontrols) {
    dragcontrols.dispose();
  }
  helpoverlay.innerHTML = "<kbd>左键点击</kbd> = 删除实体 / <kbd>Ctrl + 左键点击</kbd> = 删除整个文档 / <kbd>Del</kbd> = 删除所选"
};

// scale mode
function mouseScaleMode() {
  mouseState = "scale"
  if (dragcontrols) {
    dragcontrols.dispose();
  }
  $(".mouseSelectBtn").removeClass('tbtnactive');
  $(".mouseMoveBtn").removeClass('tbtnactive');
  $(".mouseDelBtn").removeClass('tbtnactive');
  $(".mouseScaleBtn").addClass('tbtnactive');
  deselectAllObjects()
  helpoverlay.innerHTML = "<kbd>左键点击</kbd> = 选择要缩放的实体"
};

function initMouseMode() {
  scalewindow.style.visibility = "hidden";
};

function setOpacity(array, opacity) {
  for (i = 0; i < array.length; i++) {
    var object = toolpathsInScene[i]
    object.traverse(function(child) {
      var depth = 0;
      if (child.userData.camZDepth) {
        depth = child.userData.camZDepth - child.userData.camZStart
      }
      if (child.userData.inflated) {
        if (child.userData.inflated.userData.pretty) {
          var pretty = child.userData.inflated.userData.pretty
          pretty.traverse(function(child) {
            if (child.material && child.type == "Mesh") {
              // child.material.opacity = opacity / depth;
              child.material.opacity = opacity / depth + 0.2;
            } else if (child.material && child.type == "Line") {
              // child.material.opacity = (opacity / depth )+0.25;
              child.material.opacity = (opacity / depth) + 0.5;
            }
          });
        }
      }
    });
  }
}

function deselectAllObjects() {
  for (i = 0; i < objectsInScene.length; i++) {
    var object = objectsInScene[i]
    object.traverse(function(child) {
      if (child.type == "Line" && child.userData.selected) {
        child.userData.selected = false;
      }
    });
  }
}

function deleteSelectedObjects() {
  for (i = 0; i < objectsInScene.length; i++) {
    var object = objectsInScene[i]
    var todelete = []
    object.traverse(function(child) {
      if (child.userData.selected && child.userData.link) {
        todelete.push(child)
      }
    });
    for (j = 0; j < todelete.length; j++) {
      object.remove(todelete[j])
    }
  }
  fillTree();
}

function updateCloneMoves() {
  for (i = 0; i < toolpathsInScene.length; i++) {
    var object = toolpathsInScene[i]
    object.traverse(function(child) {

    });
  }
}

// ------------------------------------------------------------------------------

function getSelectedObjects(){
  let selected = [];

  for (i = 0; i < objectsInScene.length; i++) {
    var object = objectsInScene[i]
    object.traverse(function(child) {
      if (child.userData.selected && child.userData.link) {
        selected.push(child)
      }
    });
  }

  return selected;
}
