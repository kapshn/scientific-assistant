import Vue from 'vue';
import App from './App';

export default {
  data () {
    return {}
  },
  props: ['id'], 
  mounted: function() {
    fileId = this.id;
    getXML(this);
  }
}

var fileId;

function getXML(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let xmlBody;

      var xhr = new XMLHttpRequest();
      xhr.open('get', 'https://www.googleapis.com/drive/v3/files/'+ t.id + '?alt=media');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      // xhr.setRequestHeader('Accept', 'text/xml');
      // xhr.setRequestHeader('Content-Type', 'text/xml');
      xhr.onload = () => {
        xmlBody = xhr.responseText;
        launchEditor(xmlBody);
      };
      xhr.send();
  });
}

function launchSaveButton(graph)
{
  var saveButton = document.createElement("button");
  saveButton.id = "saveButton";
  saveButton.textContent = "Сохранить";
  saveButton.addEventListener('click', function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {

      var encoder = new mxCodec();
      var result = encoder.encode(graph.getModel());
      var xml = mxUtils.getXml(result);
  
      let file = new Blob([xml], { type: 'text/xml' });
  
      let form = new FormData();
  
      form.append('file', file);
  
      let xhr = new XMLHttpRequest();
      xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', 'text/xml');
      xhr.responseType = 'json';
      xhr.onload = () => {
        //console.log(xhr.response);
      };  
      xhr.send(file);
  
      });
  });

  document.getElementById('main-div').appendChild(saveButton);
}

function launchEditor(xmlBody)
{
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported())
  {
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else
  {
    var editor = new mxEditor();
    launchGraph(editor, document.getElementById('graphContainer'));

    var doc = mxUtils.parseXml(xmlBody);
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, editor.graph.getModel());

    launchUndoManager(editor);

    launchKeyHandler(editor);

    launchSaveButton(editor.graph);
  }
}

function launchGraph(editor, graphContainer)
{
  editor.graph = new mxGraph(graphContainer);
  var graph = editor.graph; // for convenient use 

  mxConnectionHandler.prototype.connectImage = new mxImage('../images/connector.gif', 16, 16); // Set connection image
  graph.setConnectable(true);
  graph.setMultigraph(false);

  // Configures the graph contains to resize and
  // add a border at the bottom, right
  graph.setResizeContainer(true);
  graph.minimumContainerSize = new mxRectangle(0, 0, 500, 380);
  graph.setBorder(60);

  // Enables rubberband selection
  new mxRubberband(graph);

  // Overrides method to disallow edge label editing
  graph.isCellEditable = function(cell)
  {
    return !this.getModel().isEdge(cell);
  };

  // Overrides method to disallow vertex label editing
  graph.isCellEditable = function(cell)
  {
    return !this.getModel().isVertex(cell);
  };

  // Set style to edges
  var style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;

  // Overrides method to drawing notes using HTML
  graph.htmlLabels = true;
  graph.getLabel = function(cell)
  {
    if(cell.isVertex())
    {
      var body = document.createElement('tbody');
      var table = document.createElement('table');
      table.style.height = '100%';
      table.style.width = '100%';
      
      var attrs = cell.value.attributes;
      for (var i = 0; i < attrs.length; i++)
      {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.style.textAlign = 'center';
        td.style.fontSize = '12px';
        td.style.color = '#774400';
        mxUtils.write(td, attrs[i].value);
        tr.appendChild(td);
        body.appendChild(tr);
      }    
      table.appendChild(body);
      
      return table;
    }
  };

  launchToolbar(graph, document.getElementById("toolbarContainer"));

  launchPropertiesPanel(graph);
}

function launchToolbar(graph, toolbarContainer)
{
  var toolbar = new mxToolbar(toolbarContainer);
  toolbar.enabled = false;

  graph.dropEnabled = true;

  // Matches DnD inside the graph
  mxDragSource.prototype.getDropTarget = function(graph, x, y)
  {
    var cell = graph.getCellAt(x, y);
    
    if (!graph.isValidDropTarget(cell))
    {
      cell = null;
    }
    
    return cell;
  };

  addVertex1(graph, toolbar, '../images/from-mx-graph/rectangle.gif', 100, 40, '');
  addVertex2(graph, toolbar, '../images/from-mx-graph/rectangle.gif', 100, 40, '');
  addVertex3(graph, toolbar, '../images/from-mx-graph/rectangle.gif', 100, 40, '');
  addVertex4(graph, toolbar, '../images/from-mx-graph/rectangle.gif', 100, 40, '');
}

function addVertex1(graph, toolbar, icon, w, h, style)
{
  var doc = mxUtils.createXmlDocument();
  var note = doc.createElement('Note');
  note.setAttribute('text', '');

  var vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addVertex2(graph, toolbar, icon, w, h, style)
{
  var doc = mxUtils.createXmlDocument();
  var note = doc.createElement('Note');
  note.setAttribute('link', '');

  var vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addVertex3(graph, toolbar, icon, w, h, style)
{
  var doc = mxUtils.createXmlDocument();
  var note = doc.createElement('Note');
  note.setAttribute('document', '');
  note.setAttribute('name', '');

  var vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addVertex4(graph, toolbar, icon, w, h, style)
{
  var doc = mxUtils.createXmlDocument();
  var note = doc.createElement('Note');
  note.setAttribute('document', '');
  note.setAttribute('name', '');
  note.setAttribute('citation', '');

  var vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addToolbarItem(graph, toolbar, prototype, image)
{
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  var funct = function(graph, evt, cell)
  {
    graph.stopEditing(false);

    var pt = graph.getPointForEvent(evt);
    var vertex = graph.getModel().cloneCell(prototype);
    vertex.geometry.x = pt.x;
    vertex.geometry.y = pt.y;
    
    graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
  }

  // Creates the image which is used as the drag icon (preview)
  var img = toolbar.addMode(null, image, funct);
  mxUtils.makeDraggable(img, graph, funct);
}

function launchPropertiesPanel(graph)
{
  // Implements a properties panel that uses
  // mxCellAttributeChange to change properties
  graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
  {
    // Updates the properties panel
    selectionChanged(graph);
  });
}

function selectionChanged(graph)
{
  var div = document.getElementById('properties');

  // Forces focusout in IE
  graph.container.focus();

  // Clears the DIV the non-DOM way
  div.innerHTML = '';

  // Gets the selection cell
  var cell = graph.getSelectionCell();

  if (cell == null || cell.isEdge())
  {
    mxUtils.writeln(div, 'Nothing selected.');
  }
  else
  {
    // Writes the title
    var center = document.createElement('center');
    mxUtils.writeln(center, cell.value.nodeName + ' (' + cell.id + ')');
    div.appendChild(center);
    mxUtils.br(div);

    // Creates the form from the attributes of the user object
    var form = new mxForm();

    var attrs = cell.value.attributes;
    
    for (var i = 0; i < attrs.length; i++)
    {
      // Creates the textfield for the given property.
      createTextField(graph, form, cell, attrs[i]);
    }

    div.appendChild(form.getTable());
    mxUtils.br(div);

    //HERE
    if (cell.value.hasAttribute('document'))
    {
      var input = document.createElement("input");
      input.type = "file";
      input.id = "fileInput";
      div.appendChild(input);

      var uploadButton = document.createElement("button");
      uploadButton.id = "uploadButton";
      uploadButton.textContent = "Загрузить";
      uploadButton.addEventListener('click', function () {
        uploadFile(graph, cell);
      });
      div.appendChild(uploadButton);
    }
    //HERE
  }
}

function createTextField(graph, form, cell, attribute)
{
  var input = form.addText(attribute.nodeName + ':', attribute.nodeValue);

  var applyHandler = function()
  {
    var newValue = input.value || '';
    var oldValue = cell.getAttribute(attribute.nodeName, '');

    if (newValue != oldValue)
    {
      graph.getModel().beginUpdate();        
      try
      {
        var edit = new mxCellAttributeChange(cell, attribute.nodeName, newValue);
        graph.getModel().execute(edit);
        graph.updateCellSize(cell);
      }
      finally
      {
        graph.getModel().endUpdate();
      }
    }
  }; 

  mxEvent.addListener(input, 'keypress', function (evt)
  {
    // Needs to take shift into account for textareas
    if (evt.keyCode == /*enter*/13 &&
      !mxEvent.isShiftDown(evt))
    {
      input.blur();
    }
  });

  if (mxClient.IS_IE)
  {
    mxEvent.addListener(input, 'focusout', applyHandler);
  }
  else
  {
    // Note: Known problem is the blurring of fields in
    // Firefox by changing the selection, in which case
    // no event is fired in FF and the change is lost.
    // As a workaround you should use a local variable
    // that stores the focused field and invoke blur
    // explicitely where we do the graph.focus above.
    mxEvent.addListener(input, 'blur', applyHandler);
  }
}

function launchUndoManager(editor)
{
  editor.installUndoHandler(editor.graph);

  document.getElementById('main-div').appendChild(mxUtils.button('Undo', function()
  {
    editor.undo();
  }));
  
  document.getElementById('main-div').appendChild(mxUtils.button('Redo', function()
  {
    editor.redo();
  }));
}

function launchKeyHandler(editor)
{
  var keyHandler = new mxDefaultKeyHandler(editor);
  keyHandler.bindAction(46, 'delete');
  keyHandler.bindAction(90, 'undo', true);
  keyHandler.bindAction(89, 'redo', true);
}

function uploadFile(graph, cell)
{
  chrome.identity.getAuthToken({ interactive: true }, function (token)
  {
    const selectedFile = document.getElementById('fileInput').files[0];
    var file = new Blob([selectedFile], { type: selectedFile.type });
    var metadata = {
      'name': selectedFile.name, // Filename at Google Drive
      'mimeType': selectedFile.type, // mimeType at Google Drive
      'parents': ['1eV6Os10CnWAR8FLB8z1Rsp1cu9JqgR2u'],
    };

    var form = new FormData();

    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.responseType = 'json';
    xhr.onload = () => {

      graph.getModel().beginUpdate();        
      try
      {
        var edit = new mxCellAttributeChange(cell, 'document', xhr.response.id);
        graph.getModel().execute(edit);
        graph.updateCellSize(cell);
      }
      finally
      {
        graph.getModel().endUpdate();
      }

    };
    xhr.send(form);
  });
}
