
    
var ROOTTHREE = 1.7321;
var ROOTSIX = 2.4495;

// group ('A,C,G,T'  'AC,GT')
function getCoordinates(  points, groups ) {
    
    if (groups.length == 2) return oneDimCoordinates(points, groups); 
    if (groups.length == 3) return twoDimCoordinates(points, groups); 
    if (groups.length == 4) return threeDimCoordinates(points); 
    
// var y =3√2t+3√6f.

}

function oneDimCoordinates(points, groups)  {
    
    var data = {};
    var firstVertex = groups[0].split('');
        
    for( let [name,point] of Object.entries(points) )  {
        
        var x = 0;
        
        for ( let axes of firstVertex) x += point[axes];
        
        data[name] = new THREE.Vector3(x,0,0);
        
    }
    
    return data;
    
    
}
// t l r
function twoDimCoordinates(points, groups)  {
    
    var data = {};

    
    var firstVertex = groups[0].split('');
    var secondVertex = groups[1].split('');
    var thirdVertex = groups[2].split('');
    

    for( let [name,point] of Object.entries(points) ) {
        
        var t = 0;
        var l = 0;
        var r = 0;
        
        for ( let axes of firstVertex) { t += point[axes]; }
        for ( let axes of secondVertex) { l += point[axes]; }
        for ( let axes of thirdVertex) { r += point[axes]; }
       
        var x = (r + 1 - l)/2
        var y = ROOTTHREE*t/2;
        
        data[name] = new THREE.Vector3(x,y,0);
        
        
    }
          
    return data;
    
    
}
//A  C  G  T

//t  l  r  f
function threeDimCoordinates(points)  {
    
    var data = {};

    for( let [name,point] of Object.entries(points) )   {
        
        var x = (point.G + 1 - point.C)/2;
        var y = ROOTSIX*point.A/3;
        var z = ROOTTHREE*point.T/2 + ROOTTHREE*point.A/6;
        data[name] = new THREE.Vector3(x,y,z);
        
    }
    
    return data;
    
}
    

    