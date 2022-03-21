module.exports = function (engine, scenario, vp) {
    engine.evaluate(function () {
        var imagesNodeList = document.querySelectorAll('img:not([src*="svg"])');
        var imagesArray = Array.prototype.slice.call(imagesNodeList);
        imagesArray.forEach(function(img) {
            if (img.width === 0 && img.height === 0) {
                return true;
            }

            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.fillStyle = '#663399';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // replace image source with canvas data
            img.src = canvas.toDataURL();

        });
    });
    console.log('onReady.js has run for: ', vp.label);
};
