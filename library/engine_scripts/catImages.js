module.exports = function (engine, scenario, vp) {
    engine.evaluate(function () {
        var imagesNodeList = document.querySelectorAll('img:not([src*="svg"])');
        var imagesArray = Array.prototype.slice.call(imagesNodeList);
        imagesArray.forEach(function(img) {
            if (img.width === 0 && img.height === 0) {
                return true;
            }
            img.src = 'https://placekitten.com/' + img.width + '/' + img.height;
        });
    });
    console.log('onReady.js has run for: ', vp.label);
};
