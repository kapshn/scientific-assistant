import Vue from 'vue';
import App from './App';

/*
new Vue({
  el: '#app',
  render: h => h(App)
});*/

window.onload = function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', "https://www.googleapis.com/drive/v3/files?q='appDataFolder'+in+parents&spaces=appDataFolder");
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
          console.log(xhr.response); // Retrieve uploaded file ID.
      };
      xhr.send();

    });


    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {

      			//var encoder = new mxCodec();
      			//var node = encoder.encode(graph.getModel());
      			//mxUtils.popup(mxUtils.getPrettyXml(node), true);

            /*var encoder = new mxCodec();
            var result = encoder.encode(graph.getModel());
            var xml = mxUtils.getXml(result);

            //var fileContent = mxUtils.getPrettyXml(node); // As a sample, upload a text file.
            var fileContent = xml;
            var file = new Blob([fileContent], { type: 'text/xml' });
            var metadata = {
                'name': document.getElementById('test').value, // Filename at Google Drive
                'mimeType': 'text/xml', // mimeType at Google Drive
                'parents': ['appDataFolder'], // Folder ID at Google Drive (remove it if want upload to root folder)
            };

            var form = new FormData();

            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            var xhr = new XMLHttpRequest();
            xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.responseType = 'json';
            xhr.onload = () => {
                alert(xhr.response.id); // Retrieve uploaded file ID.
            };
            xhr.send(form);*/

						/*var xhr = new XMLHttpRequest();
						xhr.open('get', 'https://www.googleapis.com/drive/v3/files/appDataFolder');
						xhr.setRequestHeader('Authorization', 'Bearer ' + token);
						xhr.responseType = 'json';
						xhr.onload = () => {
								console.log(xhr.response); // Retrieve uploaded file ID.
						};
						xhr.send();*/

						const selectedFile = document.getElementById('test').files[0];
						var file = new Blob([selectedFile], { type: selectedFile.type });
						/*var metadata = {
								'name': selectedFile.name, // Filename at Google Drive
								'mimeType': selectedFile.type, // mimeType at Google Drive
								'parents': ['19YHOHgkRJuYIvCNleGtwculaA_rnnQb7'], // Folder ID at Google Drive (remove it if want upload to root folder)
						};*/

            var metadata = {
                'name': selectedFile.name, // Filename at Google Drive
                'mimeType': selectedFile.type, // mimeType at Google Drive
                'parents': ['appDataFolder'], // Folder ID at Google Drive (remove it if want upload to root folder)
            };

						var form = new FormData();

						form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
						form.append('file', file);

						var xhr = new XMLHttpRequest();
						xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
						xhr.setRequestHeader('Authorization', 'Bearer ' + token);
						xhr.responseType = 'json';
						xhr.onload = () => {
								alert(xhr.response.id); // Retrieve uploaded file ID.
						};
						xhr.send(form);
						//console.log(fileType);

        });
    });

		// Defines an icon for creating new connections in the connection handler.
		// This will automatically disable the highlighting of the source vertex.
		mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);

		// Checks if browser is supported
		if (!mxClient.isBrowserSupported())
		{
			// Displays an error message if the browser is
			// not supported.
			mxUtils.error('Browser is not supported!', 200, false);
		}
		else
		{
			// Creates the div for the toolbar
			var tbContainer = document.createElement('div');
			tbContainer.style.position = 'absolute';
			tbContainer.style.overflow = 'hidden';
			tbContainer.style.padding = '2px';
			tbContainer.style.left = '0px';
			tbContainer.style.top = '26px';
			tbContainer.style.width = '24px';
			tbContainer.style.bottom = '0px';

			document.body.appendChild(tbContainer);

			// Creates new toolbar without event processing
			var toolbar = new mxToolbar(tbContainer);
			toolbar.enabled = false

			// Creates the div for the graph
			var container = document.createElement('div');
			container.style.position = 'absolute';
			container.style.overflow = 'hidden';
			container.style.left = '24px';
			container.style.top = '26px';
			container.style.right = '0px';
			container.style.bottom = '0px';
			container.style.background = 'url("editors/images/grid.gif")';

			document.body.appendChild(container);

			// Workaround for Internet Explorer ignoring certain styles
			if (mxClient.IS_QUIRKS)
			{
				document.body.style.overflow = 'hidden';
				new mxDivResizer(tbContainer);
				new mxDivResizer(container);
			}

			// Creates the model and the graph inside the container
			// using the fastest rendering available on the browser
			var model = new mxGraphModel();
			var graph = new mxGraph(container, model);
			graph.dropEnabled = true;

      var xml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" parent="1"/><mxCell id="3" parent="1"/><mxCell id="4" parent="1"/><mxCell id="5" parent="1"/><mxCell id="6" style="" parent="1" vertex="1"><mxGeometry x="380" y="240" width="100" height="40" as="geometry"/></mxCell><mxCell id="7" style="shape=triangle" parent="1" vertex="1"><mxGeometry x="280" y="70" width="40" height="40" as="geometry"/></mxCell><mxCell id="8" style="shape=actor" parent="1" vertex="1"><mxGeometry x="330" y="340" width="30" height="40" as="geometry"/></mxCell><mxCell id="9" style="shape=ellipse" parent="1" vertex="1"><mxGeometry x="590" y="160" width="40" height="40" as="geometry"/></mxCell><mxCell id="10" parent="1" source="7" target="6" edge="1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="11" parent="1" source="6" target="9" edge="1"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';

      var doc = mxUtils.parseXml(xml);
      var codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());

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



			function mxVertexToolHandler(state)
			{
				mxVertexHandler.apply(this, arguments);
			};

			mxVertexToolHandler.prototype = new mxVertexHandler();
			mxVertexToolHandler.prototype.constructor = mxVertexToolHandler;

			mxVertexToolHandler.prototype.domNode = null;

			mxVertexToolHandler.prototype.init = function()
			{
				mxVertexHandler.prototype.init.apply(this, arguments);

				// In this example we force the use of DIVs for images in IE. This
				// handles transparency in PNG images properly in IE and fixes the
				// problem that IE routes all mouse events for a gesture via the
				// initial IMG node, which means the target vertices
				this.domNode = document.createElement('div');
				this.domNode.style.position = 'absolute';
				this.domNode.style.whiteSpace = 'nowrap';

				// Workaround for event redirection via image tag in quirks and IE8
				function createImage(src)
				{
					if (mxClient.IS_IE && !mxClient.IS_SVG)
					{
						var img = document.createElement('div');
						img.style.backgroundImage = 'url(' + src + ')';
						img.style.backgroundPosition = 'center';
						img.style.backgroundRepeat = 'no-repeat';
						img.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';

						return img;
					}
					else
					{
						return mxUtils.createImage(src);
					}
				};

				// Delete
				var img = createImage('images/delete2.png');
				img.setAttribute('title', 'Delete');
				img.style.cursor = 'pointer';
				img.style.width = '16px';
				img.style.height = '16px';
				mxEvent.addGestureListeners(img,
					mxUtils.bind(this, function(evt)
					{
						// Disables dragging the image
						mxEvent.consume(evt);
					})
				);
				mxEvent.addListener(img, 'click',
					mxUtils.bind(this, function(evt)
					{
						this.graph.removeCells([this.state.cell]);
						mxEvent.consume(evt);
					})
				);
				this.domNode.appendChild(img);

				// Size
				var img = createImage('images/fit_to_size.png');
				img.setAttribute('title', 'Resize');
				img.style.cursor = 'se-resize';
				img.style.width = '16px';
				img.style.height = '16px';
				mxEvent.addGestureListeners(img,
					mxUtils.bind(this, function(evt)
					{
						this.start(mxEvent.getClientX(evt), mxEvent.getClientY(evt), 7);
						this.graph.isMouseDown = true;
						this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
						mxEvent.consume(evt);
					})
				);
				this.domNode.appendChild(img);

				// Move
				var img = createImage('images/plus.png');
				img.setAttribute('title', 'Move');
				img.style.cursor = 'move';
				img.style.width = '16px';
				img.style.height = '16px';
				mxEvent.addGestureListeners(img,
					mxUtils.bind(this, function(evt)
					{
						this.graph.graphHandler.start(this.state.cell,
							mxEvent.getClientX(evt), mxEvent.getClientY(evt));
						this.graph.graphHandler.cellWasClicked = true;
						this.graph.isMouseDown = true;
						this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
						mxEvent.consume(evt);
					})
				);
				this.domNode.appendChild(img);

				// Connect
				var img = createImage('images/check.png');
				img.setAttribute('title', 'Connect');
				img.style.cursor = 'pointer';
				img.style.width = '16px';
				img.style.height = '16px';
				mxEvent.addGestureListeners(img,
					mxUtils.bind(this, function(evt)
					{
						var pt = mxUtils.convertPoint(this.graph.container,
								mxEvent.getClientX(evt), mxEvent.getClientY(evt));
						this.graph.connectionHandler.start(this.state, pt.x, pt.y);
						this.graph.isMouseDown = true;
						this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
						mxEvent.consume(evt);
					})
				);
				this.domNode.appendChild(img);

				this.graph.container.appendChild(this.domNode);
				this.redrawTools();
			};

			mxVertexToolHandler.prototype.redraw = function()
			{
				mxVertexHandler.prototype.redraw.apply(this);
				this.redrawTools();
			};

			mxVertexToolHandler.prototype.redrawTools = function()
			{
				if (this.state != null && this.domNode != null)
				{
					var dy = (mxClient.IS_VML && document.compatMode == 'CSS1Compat') ? 20 : 4;
					this.domNode.style.left = (this.state.x + this.state.width - 56) + 'px';
					this.domNode.style.top = (this.state.y + this.state.height + dy) + 'px';
				}
			};

			mxVertexToolHandler.prototype.destroy = function(sender, me)
			{
				mxVertexHandler.prototype.destroy.apply(this, arguments);

				if (this.domNode != null)
				{
					this.domNode.parentNode.removeChild(this.domNode);
					this.domNode = null;
				}
			};






			// Enables new connections in the graph
			graph.setConnectable(true);
			graph.setMultigraph(false);

			// Stops editing on enter or escape keypress
			var keyHandler = new mxKeyHandler(graph);
			var rubberband = new mxRubberband(graph);

			var deleteImage = new mxImage('icons/icon_48.png', 20, 20);

			var addVertex = function(icon, w, h, style)
			{
				var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
				vertex.setVertex(true);

				addToolbarItem(graph, toolbar, vertex, icon);
			};

			addVertex('editors/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
			addVertex('editors/images/rectangle.gif', 100, 40, '');
			addVertex('editors/images/rounded.gif', 100, 40, 'shape=rounded');
			addVertex('editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
			addVertex('editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
			addVertex('editors/images/triangle.gif', 40, 40, 'shape=triangle');
			addVertex('editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
			addVertex('editors/images/actor.gif', 30, 40, 'shape=actor');
			toolbar.addLine();

			/*document.body.appendChild(mxUtils.button('View XML', function()
			{
				var encoder = new mxCodec();
				var node = encoder.encode(graph.getModel());
				mxUtils.popup(mxUtils.getPrettyXml(node), true);
			}));*/


		}

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

};
