ui = new UI.Controller(models, material);

var canvasEditor = function(containerID, canvasUI){
    picker('吸管儿底色', containerID, function(ui, color){
        canvasUI.canvas.backgroundColor = color;
        canvasUI.canvas.renderAll();
    });

    imageInput(containerID);
}
