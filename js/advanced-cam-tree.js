// Handles the Toolpaths / Operations tree
function toggleToolpathVisibility(i, bool) {
  toolpathsInScene[i].userData.visible = bool
  fillTree();
  makeGcode();
}

// move toolpath order up/down
var moveOp = function(index, delta) {
  storeUndo(true)
  var array = toolpathsInScene;
  // var index = array.indexOf(element);
  var newIndex = index + delta;
  if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
  var indexes = [index, newIndex].sort(); //Sort the indixes
  array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
};

function fillTree() {
  // $('#filetreeheader').empty();
  $('#filetree').empty();
  // $('#toolpathtreeheader').empty();
  $('#toolpathtree').empty();
  $('#toolpathsmenu').empty();


  // Default Menu
  var menuitem = `<li><a  href="#" onclick="addJob(-1);"><span class="fa fa-fw fa-plus"></span>创建新操作...</a></li>`;
  $('#toolpathsmenu').append(menuitem);

  clearSceneFlag = true;

  filldoctree();

  if (toolpathsInScene.length > 0) {

    $('#generatetpgcode').prop('disabled', false);
    $("#generatetpgcode").addClass('success');

    var table = `<table class="jobsetuptable" style="width: 100%" id="toolpathstable">`
    $('#toolpathtree').append(table)

    for (i = 0; i < toolpathsInScene.length; i++) {
      if (toolpathsInScene[i].type != "Mesh") {

        var operation;
        if (toolpathsInScene[i].userData.camOperation) {
          operation = toolpathsInScene[i].userData.camOperation
        } else {
          operation = "not configured <i class='fas fa-times fa-fw fg-red'></i>"
        }

        var toolp = `<tr class="jobsetupfile" id="toolpathrow` + i + `">
                <td>
                  <table>
                    <tr>
                    <td>
                    <h6 style="margin: 0px 0px;"><small>
                    刀具路径： <b><span contenteditable="true" data-id="` + i + `">` + toolpathsInScene[i].name + `</span></b> [` + operation + `]`
        if (!toolpathsInScene[i].userData.visible) {
          toolp += " (hidden) "
        }
        toolp += `</small></h6>
                    </td>
                    </tr>
                    <tr>
                    <td>
                    <div class="toolbar mb-0">
                    `

        toolp += `<button style="width: 60px;" class="tool-button primary" data-tooltip="tooltip" data-placement="bottom" title="Configure toolpath" onclick="setupJob(` + i + `);"><i class="fas fa-sliders-h"></i> Edit</button>`

        toolp += `</div><div class="toolbar ml-1 mb-0">`

        if (i > 0) {
          toolp += `<button class="tool-button success" data-tooltip="tooltip" data-placement="bottom" title="Move up" onclick="moveOp(` + i + `, -1); fillTree();"><i class="fa fa-arrow-up fa-fw" aria-hidden="true"></i></button>`
        } else {
          toolp += `<button class="tool-button success disabled" data-tooltip="tooltip" data-placement="bottom" title="Move up" onclick="moveOp(` + i + `, -1); fillTree();"><i class="fa fa-arrow-up fa-fw" aria-hidden="true"></i></button>`
        }

        if (i < toolpathsInScene.length - 1) {
          toolp += `<button class="tool-button success" data-tooltip="tooltip" data-placement="bottom" title="Move down" onclick="moveOp(` + i + `, 1); fillTree();"><i class="fa fa-arrow-down fa-fw" aria-hidden="true"></i></button>`
        } else {
          toolp += `<button class="tool-button success  disabled" data-tooltip="tooltip" data-placement="bottom" title="Move down" onclick="moveOp(` + i + `, 1); fillTree();"><i class="fa fa-arrow-down fa-fw" aria-hidden="true"></i></button>`
        }

        toolp += `</div><div class="toolbar ml-1 mb-0">`

        toolp += `<button class="tool-button secondary" data-tooltip="tooltip" data-placement="bottom" title="Reselect toolpaths" onclick="setSelectionFromToolPath(` + i + `)"><i class="far fa-object-group fa-fw"></i></button>`

        toolp += `</div><div class="toolbar ml-1 mb-0">`


        if (toolpathsInScene[i].userData.visible) {
          toolp += `<button class="tool-button warning" data-tooltip="tooltip" data-placement="bottom" title="Hide toolpath and exclude from GCODE generation" onclick="toggleToolpathVisibility(` + i + `, false);"><i class="fa fa-fw fa-eye-slash" aria-hidden="true"></i></button>`
        } else {
          toolp += `<button class="tool-button alert" data-tooltip="tooltip" data-placement="bottom" title="Show toolpath and include in GCODE generation" onclick="toggleToolpathVisibility(` + i + `, true);"><i class="fa fa-fw fa-eye" aria-hidden="true"></i></button>`
        }

        toolp += `<button class="tool-button alert" data-tooltip="tooltip" data-placement="bottom" title="Delete toolpath" onclick="storeUndo(); toolpathsInScene.splice('` + i + `', 1); fillTree();"><i class="fa fa-times fa-fw" aria-hidden="true"></i></button>`

        toolp += `</div>`

        toolp += `
            <span class="tally alert" style="display: none; margin-top: 6px;" id="toolpathSpinner` + i + `"><i class="fas fa-spinner fa-pulse"></i><small> calculating...</small></span>
                    </ul>
                    </td>
                    </tr>

                  </table>
                </td>
                </tr>
                `
      }
      $('#toolpathstable').append(toolp);

      // append toolpath to menu
      var string = `将选择添加到: ` + toolpathsInScene[i].name + `: ` + operation
      if (string.length > 48) {
        string = string.substring(0, 48) + "..."
      }
      var menuitem = `<li><a  href="#" onclick="addJob(` + i + `)">` + string + `</a></li>`;
      $('#toolpathsmenu').append(menuitem);


      // append removal toolpath to menu
      var string = `删除选择从: ` + toolpathsInScene[i].name + `: ` + operation
      if (string.length > 48) {
        string = string.substring(0, 48) + "..."
      }
      var menuitem = `<li><a  href="#" onclick="remJob(` + i + `)">` + string + `</a></li>`;
      $('#toolpathsmenu').append(menuitem);

    }

  } else {
    var instructions = `<p class="text-secondary text-center mt-3">请通过在查看器中单击它们或使用上面的文档树来选择一些矢量。按Ctrl选择多个，按Ctrl+A选择全部，等等。<br>添加到工具路径使用 <kbd class="bg-openbuilds"> <i class="fa fa-plus" aria-hidden="true"></i> 创建路径</kbd> 按钮</p>`
    $('#toolpathtree').append(instructions);
    $('#generatetpgcode').prop('disabled', true);
    $("#generatetpgcode").removeClass('success');

  } // End of if (toolpathsInScene.length > 0)

  var tableend = `
    </table>
    `

  $('#toolpathstable').append(tableend)

  // Register event to Edit Toolpath Name inplace
  $('#toolpathstable .entity-job').on('input', function() {
    var $this = $(this);
    var data = $this.data();
    toolpathsInScene[data.id].name = $this.text();
  });
}