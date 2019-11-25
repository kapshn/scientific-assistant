import Vue from 'vue';
import App from './App';
import ModalWindow from './components/ModalWindow.vue';
import TextIcon from 'vue-material-design-icons/ScriptTextOutline.vue';
import BoldIcon from 'vue-material-design-icons/FormatBold.vue';
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue';
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue';
import FolderOpenIcon from 'vue-material-design-icons/FolderOpen.vue';
import SaveIcon from 'vue-material-design-icons/ContentSaveOutline.vue';
import UndoIcon from 'vue-material-design-icons/Undo.vue';
import RedoIcon from 'vue-material-design-icons/Redo.vue';

Vue.component('ModalWindow', ModalWindow);
Vue.component('TextIcon', TextIcon);
Vue.component('BoldIcon', BoldIcon);
Vue.component('ItalicIcon', ItalicIcon);
Vue.component('UnderlineIcon', UnderlineIcon);
Vue.component('FolderOpenIcon', FolderOpenIcon);
Vue.component('SaveIcon', SaveIcon);
Vue.component('UndoIcon', UndoIcon);
Vue.component('RedoIcon', RedoIcon);

let context;
let fileId;
let docId;
let tempCell = null;
let tempGraph = null;

export default {
  data () {
    return {
      editingWindowVisibility: false,
      uploadFileWindowVisibility: false,
      uploadFileButtonVisibility: false,
    }
  },
  props: ['id', 'name', 'docId','folderId'],
  mounted: function() {
    fileId = this.id;
    docId = this.docId;
    context = this;
    getXML(this);
  },
  methods: {
    CloseModal: function() { closeModal(this); },
    SetModalWindowMark: function() { setModalWindowMark(this); },
    SelectFile: function(file) {
      selectFile(file,this)
    }
  },
}

function selectFile(file,t) {
  if (tempCell != null && tempGraph != null)
  {
    tempGraph.getModel().beginUpdate();
    try
    {
      let edit = new mxCellAttributeChange(tempCell, 'document', file.id);
      let edit2 = new mxCellAttributeChange(tempCell, 'name', file.name);
      tempGraph.getModel().execute(edit);
      tempGraph.getModel().execute(edit2);
    }
    finally
    {
      tempGraph.getModel().endUpdate();
    }

    // Update cell size
    tempGraph.getModel().beginUpdate();
    try
    {
      let geo = tempGraph.model.getGeometry(tempCell);
      geo = geo.clone();
      geo.width = tempGraph.view.getState(tempCell).text.value.offsetWidth;
      geo.height = tempGraph.view.getState(tempCell).text.value.offsetHeight;
      tempGraph.resizeCell(tempCell, geo);
    }
    finally
    {
      tempGraph.getModel().endUpdate();
    }

    tempCell = null;
    tempGraph = null;
  }

  t.editingWindowVisibility = false;
  t.uploadFileWindowVisibility = false;
}

function closeModal(t) {
  t.editingWindowVisibility = false;
  t.uploadFileWindowVisibility = false;
  t.uploadFileButtonVisibility = false;
}

function setModalWindowMark(t) {
  t.editingWindowVisibility = true;
}

function getXML(t) {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let xmlBody;

      let xhr = new XMLHttpRequest();
      xhr.open('get', 'https://www.googleapis.com/drive/v3/files/'+ fileId + '?alt=media');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = () => {
        xmlBody = xhr.responseText;
        launchEditor(xmlBody);
      };
      xhr.send();
  });
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
    // Remove old listeners for keybinds if needed
    mxEvent.removeAllListeners(document.documentElement);

    let editor = new mxEditor();
    launchGraph(editor, document.getElementById('graphContainer'));

    let doc = mxUtils.parseXml(xmlBody);
    let codec = new mxCodec(doc);
    codec.decode(doc.documentElement, editor.graph.getModel());

    launchUndoManager(editor);

    launchKeyHandler(editor);

    launchToolbar(editor);

    launchPropertiesPanel(editor.graph);

    calcMargins();
  }
}

function launchGraph(editor, graphContainer)
{
  editor.graph = new mxGraph(graphContainer);

  let graph = editor.graph; // for convenient use

  mxConnectionHandler.prototype.connectImage = new mxImage('../images/connector.gif', 16, 16); // Set connection image
  graph.setConnectable(true);
  graph.setMultigraph(false);

  // Configures the graph contains to resize and
  // add a border at the bottom, right
  graph.setResizeContainer(true);
  // Calculate window size
  let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
  let toolbarHeight = document.getElementsByClassName('toolbar')[0].offsetHeight;
  let summaryHeight = headerHeight + toolbarHeight;
  graph.minimumContainerSize = new mxRectangle(0, 0, window.innerWidth, window.innerHeight - summaryHeight );
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
  let style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;

  // Makes the shadow styles
  // mxConstants.SHADOWCOLOR = '#C0C0C0';
  mxConstants.SHADOW_OFFSET_X = 2;
  mxConstants.SHADOW_OFFSET_Y = 2;
  mxConstants.SHADOW_OPACITY = 0.4;

  // Overrides method to drawing notes using HTML
  graph.setHtmlLabels(true);

  graph.getLabel = function(cell)
  {
    if(cell.isVertex())
    {
      let body = document.createElement('tbody');
      let table = document.createElement('table');

      table.style.padding = '20px';
      table.style.paddingBottom = '10px';
      table.style.paddingTop = '10px';
      table.style.color = '#000000';

      //РІРµСЂСЃС‚РєР° С‚РµРєСЃС‚РѕРІРѕР№ Р·Р°РјРµС‚РєРё
      if (cell.getAttribute('type') == 'text') {
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        td.style.textAlign = 'left';
        //td.style.fontSize = '14px';

        mxUtils.write(td, cell.getAttribute('text', ''));
        tr.appendChild(td);
        body.appendChild(tr);
      }

      //РІРµСЂСЃС‚РєР° СЃСЃС‹Р»РєРё
      if (cell.getAttribute('type') == 'link') {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let img = document.createElement('img');
        img.src = '../images/link-variant.png';
        td1.appendChild(img);

        //var td2 = document.createElement('td');
        td2.style.textAlign = 'center';
        //td2.style.fontSize = '14px';

        mxUtils.write(td2, cell.getAttribute('name', ''));
        td2.onclick = function() {
          window.open(cell.getAttribute('link', ''));
        };

        tr.appendChild(td1);
        tr.appendChild(td2);
        body.appendChild(tr);
      }

      //РІРµСЂСЃС‚РєР° РґРѕРєСѓРјРµРЅС‚Р°
      if (cell.getAttribute('type') == 'document') {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let img = document.createElement('img');
        img.src = '../images/file-document-outline.png';
        td1.appendChild(img);

        let td2 = document.createElement('td');
        td2.style.textAlign = 'top';
        //td2.style.fontSize = '14px';


        mxUtils.write(td2, cell.getAttribute('name', ''));
        td2.onclick = function() {
          window.open('https://drive.google.com/open?id=' + cell.getAttribute('document', ''));
        };

        tr.appendChild(td1);
        tr.appendChild(td2);
        body.appendChild(tr);
      }

      //РІРµСЂСЃС‚РєР° С†РёС‚Р°С‚С‹
      if (cell.getAttribute('type') == 'citation') {
        let tr1 = document.createElement('tr');

        let td11 = document.createElement('td');
        td11.style.paddingRight = '5px';
        let img1 = document.createElement('img');
        img1.src = '../images/format-quote-close.png';
        td11.appendChild(img1);

        let td12 = document.createElement('td');
        td12.style.textAlign = 'top';
        //td12.style.fontSize = '14px';

        td12.style.paddingLeft = '5px';
        td12.style.borderLeft = '2px solid #ccc';
        td12.style.borderLeftStyle = 'height=\'30%\'';


        mxUtils.write(td12, cell.getAttribute('citation', ''));

        tr1.appendChild(td11);
        tr1.appendChild(td12);

        let tr2 = document.createElement('tr');

        let td21 = document.createElement('td');
        let img2 = document.createElement('img');
        img2.src = '../images/file-document-outline.png';
        td21.appendChild(img2);

        let td22 = document.createElement('td');
        td22.style.textAlign = 'top';
        //td22.style.fontSize = '14px';

        mxUtils.write(td22, cell.getAttribute('name', ''));
        td22.onclick = function() {
          window.open('https://drive.google.com/open?id=' + cell.getAttribute('document', ''));
        };

        tr2.appendChild(td21);
        tr2.appendChild(td22);

        body.appendChild(tr1);
        body.appendChild(tr2);
      }

      table.appendChild(body);

      return table;
    }
  };
}

function launchUndoManager(editor)
{
  editor.installUndoHandler(editor.graph);

  let undoButton = document.getElementById('undoButton');
  undoButton.addEventListener('click', function () {
    editor.undo();
  });

  let redoButton = document.getElementById('redoButton');
  redoButton.addEventListener('click', function () {
    editor.redo();
  });
}

function launchKeyHandler(editor)
{
  let keyHandler = new mxDefaultKeyHandler(editor);
  keyHandler.bindAction(46, 'delete');
  keyHandler.bindAction(90, 'undo', true);
  keyHandler.bindAction(89, 'redo', true);
}

function launchToolbar(editor)
{
  launchSaveButton(editor.graph);
  launchNoteToolbar(editor.graph, document.getElementById("noteToolbar"));
  launchFontToolbar(editor.graph);
  launchShowTextButton();
}

function launchSaveButton(graph)
{
  let saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getXml(result);

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
}

function launchNoteToolbar(graph, noteToolbar)
{
  let toolbar = new mxToolbar(noteToolbar);
  toolbar.enabled = false;

  graph.dropEnabled = true;

  // Matches DnD inside the graph
  mxDragSource.prototype.getDropTarget = function(graph, x, y)
  {
    let cell = graph.getCellAt(x, y);

    if (!graph.isValidDropTarget(cell))
    {
      cell = null;
    }

    return cell;
  };

  addTextNote(graph, toolbar, '../images/alpha-t-box-outline-24px.png', 100, 40, '');
  addLinkNote(graph, toolbar, '../images/link-box-variant-outline-24px.png', 100, 40, '');
  addDocumentNote(graph, toolbar, '../images/file-document-outline-24px.png', 100, 40, '');
  addCitationNote(graph, toolbar, '../images/comment-quote-outline-24px.png', 100, 40, '');
}

function addTextNote(graph, toolbar, icon, w, h, style)
{
  let doc = mxUtils.createXmlDocument();
  let note = doc.createElement('Note');
  note.setAttribute('type', 'text');
  note.setAttribute('text', '');

  style = 'fillColor=#fef3b3;strokeColor=#d9d9d9;shadow=1;fontSize=14;';

  let vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addLinkNote(graph, toolbar, icon, w, h, style)
{
  let doc = mxUtils.createXmlDocument();
  let note = doc.createElement('Note');
  note.setAttribute('type', 'link');
  note.setAttribute('link', '');
  note.setAttribute('name', '');

  style = 'fillColor=#ffffff;strokeColor=#d9d9d9;shadow=1;fontSize=14;';

  let vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addDocumentNote(graph, toolbar, icon, w, h, style)
{
  let doc = mxUtils.createXmlDocument();
  let note = doc.createElement('Note');
  note.setAttribute('type', 'document');
  note.setAttribute('document', '');
  note.setAttribute('name', '');

  style = 'fillColor=#ffffff;strokeColor=#d9d9d9;shadow=1;fontSize=14;';

  let vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addCitationNote(graph, toolbar, icon, w, h, style)
{
  let doc = mxUtils.createXmlDocument();
  let note = doc.createElement('Note');
  note.setAttribute('type', 'citation');
  note.setAttribute('document', '');
  note.setAttribute('name', '');
  note.setAttribute('citation', '');

  style = 'fillColor=#ffffff;strokeColor=#d9d9d9;shadow=1;fontSize=14;';

  let vertex = new mxCell(note, new mxGeometry(0, 0, w, h), style);
  vertex.setVertex(true);

  addToolbarItem(graph, toolbar, vertex, icon);
}

function addToolbarItem(graph, toolbar, prototype, image)
{
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  let funct = function(graph, evt, cell)
  {
    graph.stopEditing(false);

    let pt = graph.getPointForEvent(evt);
    let vertex = graph.getModel().cloneCell(prototype);
    vertex.geometry.x = pt.x;
    vertex.geometry.y = pt.y;

    graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
  }

  // Creates the image which is used as the drag icon (preview)
  let img = toolbar.addMode(null, image, funct);
  mxUtils.makeDraggable(img, graph, funct);

  // Customize images for notes in toolbar
  let icons = document.getElementsByClassName("mxToolbarMode");
  for (let i = 0; i < icons.length; i++) {
    icons[i].style.width = '30px';
    icons[i].style.height = '30px';
  }
}

function launchFontToolbar(graph)
{
  // Font style
  let boldButton = document.getElementById('boldButton');
  let italicButton = document.getElementById('italicButton');
  let underlineButton = document.getElementById('underlineButton');

  // mxConstants.FONT_BOLD = 1
  // mxConstants.FONT_ITALIC = 2
  // mxConstants.FONT_UNDERLINE = 4

  boldButton.addEventListener('click', function(){
    // All cells
    //let cells = graph.getChildVertices(graph.getDefaultParent());

    let selectedCell = graph.getSelectionCell();
    let curFontStyle = graph.getCellStyle(selectedCell)['fontStyle'];

    if((curFontStyle == 1) || (curFontStyle == 3) || (curFontStyle == 5) || (curFontStyle == 7))
    {
      graph.setCellStyles('fontStyle', curFontStyle - mxConstants.FONT_BOLD);
    }
    else
    {
      if (curFontStyle)
      {
        graph.setCellStyles('fontStyle', curFontStyle + mxConstants.FONT_BOLD); // 1
      }
      else
      {
        graph.setCellStyles('fontStyle', mxConstants.FONT_BOLD); // 1
      }
    }
    graph.refresh();
  });

  italicButton.addEventListener('click', function(){
    let selectedCell = graph.getSelectionCell();
    let curFontStyle = graph.getCellStyle(selectedCell)['fontStyle'];

    if((curFontStyle == 2) || (curFontStyle == 3) || (curFontStyle == 6) || (curFontStyle == 7))
    {
      graph.setCellStyles('fontStyle', curFontStyle - mxConstants.FONT_ITALIC);
    }
    else
    {
      if (curFontStyle)
      {
        graph.setCellStyles('fontStyle', curFontStyle + mxConstants.FONT_ITALIC); // 2
      }
      else
      {
        graph.setCellStyles('fontStyle', mxConstants.FONT_ITALIC); // 2
      }
    }
    graph.refresh();
  });

  underlineButton.addEventListener('click', function(){
    let selectedCell = graph.getSelectionCell();
    let curFontStyle = graph.getCellStyle(selectedCell)['fontStyle'];

    if((curFontStyle == 4) || (curFontStyle == 5) || (curFontStyle == 6) || (curFontStyle == 7))
    {
      graph.setCellStyles('fontStyle', curFontStyle - mxConstants.FONT_UNDERLINE);
    }
    else
    {
      if (curFontStyle)
      {
        graph.setCellStyles('fontStyle', curFontStyle + mxConstants.FONT_UNDERLINE); // 4
      }
      else
      {
        graph.setCellStyles('fontStyle', mxConstants.FONT_UNDERLINE); // 4
      }
    }
    graph.refresh();
  });

  // Font size
  let fontSizeSelect = document.getElementById("fontSizeSelect");
  fontSizeSelect.addEventListener("change", function(){
    graph.setCellStyles('fontSize', fontSizeSelect.value);
    graph.refresh();
  });

  // Font family
  let fontFamilySelect = document.getElementById("fontFamilySelect");
  fontFamilySelect.addEventListener("change", function(){
    graph.setCellStyles('fontFamily', fontFamilySelect.value);
    graph.refresh();
  });
}

function launchShowTextButton()
{
  let showTextButton = document.getElementById('showTextButton');
  showTextButton.addEventListener('click', function () {

    let googleDocIframe = document.getElementById('googleDocIframe');
    let editorContainer = document.getElementsByClassName('editor')[0];
    let toolbar = document.getElementById('toolbar');

    let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
    let tempHeight = window.innerHeight - headerHeight;

    if (googleDocIframe)
    {
      if (googleDocIframe.style.display == 'block')
      {
        googleDocIframe.style.display = 'none';
        editorContainer.style.display = 'block';
        toolbar.style.display = 'flex';

      }
      else
      {
        googleDocIframe.style.display = 'block';
        editorContainer.style.display = 'none';
        toolbar.style.display = 'none';
      }
    }
    else
    {
      googleDocIframe = document.createElement("iframe");
      let src = 'https://docs.google.com/document/d/' + docId + '/edit';
      googleDocIframe.setAttribute("src", src);
      googleDocIframe.id = 'googleDocIframe';
      googleDocIframe.style.width = "100%";
      googleDocIframe.style.display = 'block';
      googleDocIframe.style.marginTop = headerHeight + 'px';
      googleDocIframe.style.height = tempHeight.toString() + 'px';

      document.getElementById('app').appendChild(googleDocIframe);

      editorContainer.style.display = 'none';
      toolbar.style.display = 'none';
    }
  });
}

function launchPropertiesPanel(graph)
{
  // Implements a properties panel that uses
  // mxCellAttributeChange to change properties
  graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
  {
    // Updates the properties panel
    selectionChanged(graph, null);
  });

  // Open properties panel on doubleclick
  graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {

    let cell = evt.getProperty("cell"); // cell may be null
    if (cell != null) {

      graph.setSelectionCell(cell);
      setModalWindowMark(context);

      let timerId = setInterval(function() {

        if (context.editingWindowVisibility == true)
        {
          selectionChanged(graph, cell);
          clearInterval(timerId);
        }
      }, 100);
    }
    evt.consume();
  });
}

function selectionChanged(graph, cell)
{
  let div = document.getElementById('properties');

  // Forces focusout in IE
  graph.container.focus();

  if (cell == null || cell.isEdge())
  {
    //mxUtils.writeln(div, 'Nothing selected.');
  }
  else
  {
    // Clears the DIV the non-DOM way
    div.innerHTML = '';

    // Writes the title
    // var center = document.createElement('center');
    // mxUtils.writeln(center, cell.value.nodeName + ' (' + cell.id + ')');
    // div.appendChild(center);
    // mxUtils.br(div);

    // Creates the form from the attributes of the user object
    let form = new mxForm();

    let attrs = cell.value.attributes;

    for (let i = 0; i < attrs.length; i++)
    {
      // Creates the textfield for the given property.
      createTextField(graph, form, cell, attrs[i]);
    }

    div.appendChild(form.getTable());
    mxUtils.br(div);

    // Show file button
    if(cell.hasAttribute('document'))
    {
      context.uploadFileButtonVisibility = true;
      tempCell = cell;
      tempGraph = graph;
    }
  }
}

function createTextField(graph, form, cell, attribute)
{
  let input;
  if (attribute.nodeName == 'document' || attribute.nodeName == 'type')
  {
    return;
  } else if (attribute.nodeName == 'text' || attribute.nodeName == 'citation')
  {
    input = form.addTextarea(translateFieldName(attribute.nodeName) + ':', attribute.nodeValue);
  } else
  {
    input = form.addText(translateFieldName(attribute.nodeName) + ':', attribute.nodeValue);
  }

  let applyHandler = function()
  {
    let newValue = input.value || '';
    let oldValue = cell.getAttribute(attribute.nodeName, '');

    if (newValue != oldValue)
    {
      graph.getModel().beginUpdate();
      try
      {
        let edit = new mxCellAttributeChange(cell, attribute.nodeName, newValue);
        graph.getModel().execute(edit);
        //graph.updateCellSize(cell);
      }
      finally
      {
        graph.getModel().endUpdate();
      }

      // Update cell size
      graph.getModel().beginUpdate();
      try
      {
        let geo = graph.model.getGeometry(cell);
        geo = geo.clone();
        geo.width = graph.view.getState(cell).text.value.offsetWidth;
        geo.height = graph.view.getState(cell).text.value.offsetHeight;
        graph.resizeCell(cell, geo);
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

function translateFieldName(fieldName)
{
  let translatedFieldName;
  switch(fieldName)
  {
    case 'text':
      translatedFieldName = 'Текст';
      break;
    case 'link':
      translatedFieldName = 'Ссылка';
      break;
    case 'name':
      translatedFieldName = 'Название';
      break;
    case 'citation':
      translatedFieldName = 'Цитата';
      break;
  }
  return translatedFieldName;
}

function calcMargins() {
  let header = document.getElementsByClassName('header')[0];
  let toolbar = document.getElementById('toolbar');
  let editor = document.getElementsByClassName('editor')[0];
  editor.style.marginTop = header.offsetHeight + toolbar.offsetHeight + 'px';
}
