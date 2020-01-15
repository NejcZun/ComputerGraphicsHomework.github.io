var canvas = document.getElementById("platno");
var ctx = canvas.getContext("2d");
var points = Array();
var krivulje = Array();
var pos = canvasPosition(canvas);
var lastDrawn = 0;

    canvas.addEventListener('click', function(click){

        let x = click.clientX - pos.dx;
        let y = click.clientY - pos.dy;
        points.push({"x" : x, "y" : y});
        //na vsake 4 tocke doda krivuljo
        if(points.length%4==0){
            addBezier(lastDrawn);
            lastDrawn=lastDrawn+4;
        }
        console.log(points.length);
        clear();
        draw();
        history();
    });


//izris vseh elementov
function draw(){
    let j=2;
    let k=3;
    for (let i=0; i<points.length; i++) {
        if(i==j){drawRect(points[i].x, points[i].y); j=j+4;}
        else if(i==k){ drawRect(points[i].x, points[i].y); k=k+4;}
        else drawCircle(points[i].x, points[i].y);
    }
    for (const krivulja of krivulje) {
        ctx.strokeStyle = krivulja.color;
        ctx.beginPath();
        ctx.moveTo(krivulja.start_x, krivulja.start_y);
        ctx.bezierCurveTo(krivulja.c1_x, krivulja.c1_y, krivulja.c2_x, krivulja.c2_y, krivulja.end_x, krivulja.end_y);
        ctx.stroke();
        ctx.closePath();
    }
}
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 }
function canvasPosition(element) {
    var dx = element.offsetLeft;
    var dy = element.offsetTop;
    while (element.offsetParent) {
      element = element.offsetParent;
      dx += element.offsetLeft;
      dy += element.offsetTop;
    }
    return {"dx": dx, "dy": dy};
  }

  function addBezier(i){
    if(krivulje.length>0){
      krivulje.push({"id": krivulje.length, "start_x" : points[i].x, "start_y" :  points[i].y, "end_x" : points[i+1].x, "end_y" : points[i+1].y, "c1_x" : points[i+2].x, "c1_y" : points[i+2].y, "c2_x" : points[i+3].x, "c2_y" : points[i+3].y, "color" : document.getElementById("color").value})
    }else{
      krivulje.push({"id": i, "start_x" : points[i].x, "start_y" :  points[i].y, "end_x" : points[i+1].x, "end_y" : points[i+1].y, "c1_x" : points[i+2].x, "c1_y" : points[i+2].y, "c2_x" : points[i+3].x, "c2_y" : points[i+3].y, "color" : document.getElementById("color").value})
    }
  }

  function deleteKrivulja(id){
    if(points.length%4==0){
      let i=0;
      for (const krivulja of krivulje) {
        if(krivulja.id == id){
          deletePoints(krivulja);
          krivulje = krivulje.slice(0, i).concat(krivulje.slice(i + 1, krivulje.length));
        }
        i++;
      }
      /*reset everything */
      lastDrawn=points.length;
      clear();
      history();
      draw();
    }else{
      alert_notification("Please finish the curve before deleting others!");
    }
  }
  function alert_notification(msg){
    alert(msg);
  }
  function deletePoints(krivulja){
    for (let j=0; j<points.length;j++) {
        if((points[j].x == krivulja.start_x && points[j].y == krivulja.start_y) && (points[j+1].x == krivulja.end_x && points[j+1].y == krivulja.end_y) && (points[j+2].x == krivulja.c1_x && points[j+2].y == krivulja.c1_y) && (points[j+3].x == krivulja.c2_x && points[j+3].y == krivulja.c2_y)) points.splice(j, 4);
    }
  }

  /* funkcije za interpolacijske in aproksimirana vozlisca */
  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.fillStyle = '#88f';
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  function drawRect(x, y){
    ctx.beginPath();
    ctx.fillStyle = '#f88';
    ctx.fillRect(x, y, 10, 10);
    ctx.closePath();
  }
  function history(){
    html='';
    let i=0;
    for (const krivulja of krivulje) {
      html+= '<tr><td>'+(i+1)+'. krivulja</td><td><a class="button button3" onClick="deleteKrivulja('+krivulja.id+')"><i class="material-icons">delete</i></a></td></tr>';
      i++;
    }
    document.getElementById("history").innerHTML=html;
  }