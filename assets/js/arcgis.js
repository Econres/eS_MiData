

require([
    "esri/views/SceneView",
    "esri/WebScene",
    "esri/webscene/Slide",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/query",
    "dojo/dom",
    "dojo/domReady!"
    
    
], function (
    SceneView, WebScene,Slide, Expand, LayerList, BasemapGallery, domConstruct, domClass, on, query,dom
     
     //
) {
    var scene = new WebScene({
        portalItem: { // autocasts as new PortalItem()
            id: "4f0ceee8812946378ae1de8491520595"
        }
    });


    var view = new SceneView({
        map: scene,
        container: "viewDiv",
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false
          }
        }

    });

    // LayerList
    var layerList = new LayerList({
        container: document.createElement("div"),
        view: view
    });
    var layerListExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
        view: view,
        content: layerList.domNode
    });

    var basemapGallery = new BasemapGallery({
        container: document.createElement("div"),
        view: view
    });
    
    var baseMapExpand = new Expand({
        expandIconClass: "esri-icon-basemap", 
        view: view,
        content: basemapGallery.domNode
    });
    
    var slidesExpand = new Expand({
        expandIconClass: "esri-icon-collection",
       
        view: view,
        content: slidesDiv
    });

    view.ui.add(layerListExpand, "top-left");
    view.ui.add(baseMapExpand, "top-left");
    view.ui.add(slidesExpand, "bottom-left");
    
   
    
    slidesExpand.expanded = false;

      /*********************************************************************
       * Function to create the UI for a slide by creating DOM nodes and
       * adding them to the slidesDiv container.
       *********************************************************************/
      function createSlideUI(slide, placement) {
        /*********************************************************************
         * Create a new <div> element which contains all the slide information.
         * Store a reference to the created DOM node so we can use it to place
         * other DOM nodes and connect events.
         *********************************************************************/
        var slideElement = domConstruct.create("div", {
          // Assign the ID of the slide to the <span> element
          id: slide.id,
          className: "slide"
        });

        /*********************************************************************
         * Place the newly created DOM node at the beginning of the slidesDiv
         *********************************************************************/
        var position = placement ? placement : "last";
        domConstruct.place(slideElement, "slidesDiv", position);

        /*********************************************************************
         * Create a <div> element to contain the slide title text
         *********************************************************************/
        domConstruct.create("div", {
          // Place the title of the slide in the <div> element
          textContent: slide.title.text,
          className: "title"
        }, slideElement);

        /*********************************************************************
         * Create a new <img> element and place it inside the newly created slide
         * element. This will reference the thumbnail from the slide.
         *********************************************************************/
        domConstruct.create("img", {
          // Set the src URL of the image to the thumbnail URL of the slide
          src: slide.thumbnail.url,

          // Set the title property of the image to the title of the slide
          title: slide.title.text
        }, slideElement); // Place the image inside the new <div> element

        /*********************************************************************
         * Set up a click event handler on the newly created slide. When clicked,
         * the code defined below will execute.
         *********************************************************************/
        on(slideElement, "click", function() {
          /*******************************************************************
           * Remove the "active" class from all elements with the .slide class
           *******************************************************************/
          query(".slide").forEach(function(node) {
            domClass.remove(node, "active");
          });

          /*******************************************************************
           * Add the "active" class on the current element being selected
           *******************************************************************/
          domClass.add(slideElement, "active");

          
          slide.applyTo(view);
        });
      }
    
   
    
    view.when(function () {

        dom.byId("slidesDiv").style.visibility = "visible";
        var slides = scene.presentation.slides;
        slides.forEach(createSlideUI);
        
        var elemento = document.getElementsByClassName("esri-expand");
        
        console.log(elemento);
        
       
        
    });
});