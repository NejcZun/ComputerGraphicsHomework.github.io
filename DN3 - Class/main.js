(function(w, M) {
    w.requestAnimFrame = (function () {
        return  function (callback) {w.setTimeout(callback, 1000 / 60);};
    })();
    
    const HEIGHT = 800;
    const WIDTH = 800;

    var quad = new Quadtree({x: 0,y: 0,width: WIDTH,height: HEIGHT});
    var circles = [];
    var ctx = document.getElementById('canvas').getContext('2d');
    
    var createCircles = function(num) {
        for( var i=0;i<num;i++) {
            circles.push({x : randBetween(0, WIDTH), y : randBetween(0, HEIGHT), radius : 10,vx: randBetween(-2,2),vy: randBetween(-2,2), collision : false});
        }
    };
    
    var getUrlParameter = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    var drawQuadtree = function(tree) {
        var limit = tree.limit;
        if( tree.nodes.length === 0 ) {
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.strokeRect(limit.x, limit.y, limit.width, limit.height);
        } else {
            for( var i=0;i<tree.nodes.length;i++) {
                drawQuadtree(tree.nodes[i]);
            }
        }
    };
    
    var drawCircles = function() {
        let circle;
        for( var i=0;i<circles.length;i++) {
            
            circle = circles[i];
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, true);
            if( circle.collision ) {
                ctx.fillStyle = 'rgba(255,0,0,0.5)';
                ctx.fill();
            } else {
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.stroke();
            }
        
        }
    };
    
    var randBetween = function(min, max) {
        var val = min + (Math.random() * (max - min));
        return val;
    };
    
   var checkCollision = function(object, circles, l){
        for (let k=0; k<circles.length; k++) {
            let col_rad = circles[k].radius + object.radius;
            let col_x = object.x - circles[k].x;
            let col_y = object.y - circles[k].y;
            if(col_rad > Math.sqrt((col_x * col_x) + (col_y * col_y)) && k != l){return true;}
        }
        return false;
    }
    
    var loop = function() {
        quad.clear();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for( var i=0;i<circles.length;i++) {
            
            if(circles[i].x + circles[i].vx > WIDTH-circles[i].radius || circles[i].x + circles[i].vx < circles[i].radius) {
                circles[i].vx = -circles[i].vx;
            }
            if(circles[i].y + circles[i].vy > HEIGHT-circles[i].radius || circles[i].y + circles[i].vy < circles[i].radius) {
                circles[i].vy = -circles[i].vy;
            }

            circles[i].x += circles[i].vx;
            circles[i].y += circles[i].vy;
            circles[i].collision = checkCollision(circles[i], circles, i);
            quad.insert(circles[i]);
        }
        
        if(document.getElementById("seeQuad").checked) drawQuadtree(quad); //izrise quad tree
        drawCircles();
        requestAnimFrame(loop);
    };
	
    var url = new URL(window.location.href);
    var num = 300;
    if (url.searchParams.get('num')) num = getUrlParameter('num');
    createCircles(num);
    loop();
    w.quad = quad;
    
})(window, Math);