MatchedPairsTest = function (editor) {

   
    this.pairsMatrix = {};
    this.editor = editor;
    var signals = this.signals = editor.signals;
    var scope = this;
    
    signals.matchedPairsTest.add(function(codingType){

        scope.matchedPairsTest(codingType);

    });

    

};

MatchedPairsTest.prototype = {




    matchedPairsTest: function(codingType){

        var data = this.editor.inputData;

        var sizeUV,sizeYZ;
        var testResult = {};

        if (codingType == 0) { sizeYZ = 6; sizeUV = 4;}
        if (codingType == 1) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 2) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 3) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 4) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 5) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 6) { sizeYZ = 3; sizeUV = 3;}
        if (codingType == 7) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 8) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 9) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 10) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 11) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 12) { sizeYZ = 1; sizeUV = 2;}
        if (codingType == 13) { sizeYZ = 1; sizeUV = 2;}


        var seqNames = Object.keys(data);
        var seqNums = seqNames.length;

        if (Object.keys(this.pairsMatrix).length!=0) needToGetAllPosition = 0;
        else needToGetAllPosition = 1;

        for (var i = 0; i < seqNums; i+=1 ){

            var seq1Name = seqNames[i];

            if(needToGetAllPosition) this.pairsMatrix[seq1Name] = {};
            testResult[seq1Name] = {};

            var seq1 = data[seq1Name].sequence;

            for (var j = 0; j < seqNums; j+=1 ){

                var seq2Name = seqNames[j];
                var seq2 = data[seq2Name].sequence;
                var dm;

                if(needToGetAllPosition) {
                    dm = this.pairsMatrix[seq1Name][seq2Name] = this.getAllPositionDivergenceMatrix(seq1,seq2);
                }
                else{
                    dm = this.pairsMatrix[seq1Name][seq2Name];
                }
                
                dm = this.getSiteDivergenceMatrix(dm, codingType);
                
                [vectorY,vectorZ,vectorU,vectorV] = this.getVectorYZUV(sizeYZ, sizeUV, dm);
                if(i<j){
                    // console.log(dm);
                    // console.log('vectorY',vectorY);
                    // console.log('vectorZ',vectorZ);
                    // console.log('vectorU',vectorU);
                    // console.log('vectorV',vectorV);
                }
                testResult[seq1Name][seq2Name] = this.pairTest(seq1Name,seq2Name,sizeYZ,sizeUV,vectorY,vectorZ,vectorU,vectorV);
                
            }

        }
        // console.log(testResult);
        return testResult;

    },

    /*
    Bowker's matched-pairs test of symmetry
    */
    pairTest: function(seq1Name,seq2Name,sizeYZ,sizeUV,vectorY,vectorZ,vectorU,vectorV){
        // // console.log(vectorY)
        // // console.log(vectorZ)
        if (seq1Name != seq2Name) {

            df = 0;
            bowker = 0.0;
            for (var l = 0; l < sizeYZ; l++) {
                if ((vectorY[l] + vectorZ[l]) > 0) {
                    bowker = bowker + Math.pow((vectorY[l] - vectorZ[l]),2)/(vectorY[l] + vectorZ[l]);
                    df++;
                }
            }
            if (df > 0) {
                // // console.log('herer2')
                Q = xChi_Square_Distribution_Tail(bowker, df);
                // // console.log('bowker:',bowker,df);
            } else {
                // // console.log('herer')
                Q = 1.0;
            }

        } else {

            /*
            This is where default values are drawn from in case i == j
            */
            Q = 1.0;

        }
        return Q;

    },

    getVectorYZUV: function(sizeYZ, sizeUV, dm){

        var vectorY = [];
        var vectorZ = [];
        var vectorU = [];
        var vectorV = [];
        var zeroU, zeroV, zeroY, zeroZ;
        var l, m, n, varU, varV = 0;

        for (l = 0; l < sizeYZ; l++) {
            vectorY[l] = 0.0;
            vectorZ[l] = 0.0;
        }
        l = 0;
        for (m = 0; m < sizeUV; m++) {
            for (n = m+1; n < sizeUV; n++) {
                vectorY[l] = dm[m][n];
                vectorZ[l] = dm[n][m];
                l++;
            }
        }
        zeroY = 0;
        zeroZ = 0;
        for (l = 0; l < sizeYZ; l++) {
            if (vectorY[l] < 1) ++zeroY;
            if (vectorZ[l] < 1) ++zeroZ;
        }	

        for (m = 0; m < sizeUV; m++) {
            vectorU[m] = 0.0;
            vectorV[m] = 0.0;
        }
        for (m = 0; m < sizeUV; m++) {
            varU = 0;
            varV = 0;
            for (n = 0; n < sizeUV; n++) {
                varU = varU + dm[m][n];
                varV = varV + dm[n][m];
            }
            vectorU[m] = varU;
            vectorV[m] = varV;
        }
        zeroU = 0;
        zeroV = 0;
        for (m = 0; m < sizeUV; m++) {
            if (vectorU[m] < 1) ++zeroU;
            if (vectorV[m] < 1) ++zeroV;
        }
        return [vectorY,vectorZ,vectorU,vectorV];
    },

    getAllPositionDivergenceMatrix: function (seq1, seq2){

        var dm = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        var length_1 = seq1.length;
        for(var h = 0; h < length_1; h++) {       /*requires that length_1 = length_2*/

            var a = seq1[h];
            var b = seq2[h];
            if((a == 'A') && (b == 'A')) ++dm[0][0];
            if((a == 'A') && (b == 'C')) ++dm[0][1];
            if((a == 'A') && (b == 'G')) ++dm[0][2];
            if((a == 'A') && (b == 'T')) ++dm[0][3];
            if((a == 'A') && (b == 'U')) ++dm[0][3];
            if((a == 'C') && (b == 'A')) ++dm[1][0];
            if((a == 'C') && (b == 'C')) ++dm[1][1];
            if((a == 'C') && (b == 'G')) ++dm[1][2];
            if((a == 'C') && (b == 'T')) ++dm[1][3];
            if((a == 'C') && (b == 'U')) ++dm[1][3];
            if((a == 'G') && (b == 'A')) ++dm[2][0];
            if((a == 'G') && (b == 'C')) ++dm[2][1];
            if((a == 'G') && (b == 'G')) ++dm[2][2];
            if((a == 'G') && (b == 'T')) ++dm[2][3];
            if((a == 'G') && (b == 'U')) ++dm[2][3];
            if((a == 'T') && (b == 'A')) ++dm[3][0];
            if((a == 'T') && (b == 'C')) ++dm[3][1];
            if((a == 'T') && (b == 'G')) ++dm[3][2];
            if((a == 'T') && (b == 'T')) ++dm[3][3];
            if((a == 'T') && (b == 'U')) ++dm[3][3];
            if((a == 'U') && (b == 'A')) ++dm[3][0];
            if((a == 'U') && (b == 'C')) ++dm[3][1];
            if((a == 'U') && (b == 'G')) ++dm[3][2];
            if((a == 'U') && (b == 'T')) ++dm[3][3];
            if((a == 'U') && (b == 'U')) ++dm[3][3];
        }
        return dm;
    },

    getSiteDivergenceMatrix:function ( divergenceMatrix, codingType ){
        
        var dm = divergenceMatrix.slice();

        if(codingType == 1) {
        /*
        pools A and G
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][2];
                dm[n][2] = dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[2][m];
                dm[2][m] = dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 2) {
        /*
        pools C and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][1] = dm[n][1] + dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[1][m] = dm[1][m] + dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 3) {
        /*
        pools C and G
        */
            for(n = 0; n < 4; n++) {
                dm[n][1] = dm[n][1] + dm[n][2];
                dm[n][2] = dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[1][m] = dm[1][m] + dm[2][m];
                dm[2][m] = dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 4) {
        /*
        pools A and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 5) {
        /*
        pools G and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][2] = dm[n][2] + dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[2][m] = dm[2][m] + dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 6) {
        /*
        pools A and C
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][1];
                dm[n][1] = dm[n][3];
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[1][m];
                dm[1][m] = dm[3][m];
                dm[3][m] = 0;
            }
        }
        if(codingType == 7) {
        /*
        pools A and C as well as G and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][1];
                dm[n][1] = dm[n][2] + dm[n][3];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[1][m];
                dm[1][m] = dm[2][m] + dm[3][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 8) {
        /*
        pools A and T as well as G and C
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][3];
                dm[n][1] = dm[n][1] + dm[n][2];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[3][m];
                dm[1][m] = dm[1][m] + dm[2][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 9) {
        /*
        pools A and G as well as C and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][2];
                dm[n][1] = dm[n][1] + dm[n][3];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[2][m];
                dm[1][m] = dm[1][m] + dm[3][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 10) {
        /*
        pools C, G and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][1] = dm[n][1] + dm[n][2] + dm[n][3];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[1][m] = dm[1][m] + dm[2][m] + dm[3][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 11) {
        /*
        pools A, G and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][2] + dm[n][3];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[2][m] + dm[3][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 12) {
        /*
        pools A, C and T
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][1] + dm[n][3];
                dm[n][1] = dm[n][2];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[1][m] + dm[3][m];
                dm[1][m] = dm[2][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }
        if(codingType == 13) {
        /*
        pools A, C and G
        */
            for(n = 0; n < 4; n++) {
                dm[n][0] = dm[n][0] + dm[n][1] + dm[n][2];
                dm[n][1] = dm[n][3];
                dm[n][2] = 0;
                dm[n][3] = 0;
            }
            for(m = 0; m < 4; m++) {
                dm[0][m] = dm[0][m] + dm[1][m] + dm[2][m];
                dm[1][m] = dm[3][m];
                dm[2][m] = 0;
                dm[3][m] = 0;
            }
        }

        return dm;

    }
    
    
};

function xChi_Square_Distribution_Tail(x, dof) {
   
   if (dof <= 0) return 0.0;
	
   if (dof % 2 == 0)
		return Sum_Poisson_Terms(x/2.0, dof/2);
   else
		return Sum_Over_Odd_Terms(x,dof);
}


function Sum_Over_Odd_Terms(x,dof){
   var k;
   var n;
   var term;
   var sum;
   var sqrtx;
   var twooverpi;
	
   twooverpi = 0.63661977;
	
   if (dof == 1) return 2.0 * xGaussian_Distribution_Tail( Math.sqrt(x) );
   n = (dof - 1) / 2;
   sqrtx = Math.sqrt(x);
   term = sqrtx;
   sum = sqrtx;
   for (k = 2; k <=n; k++) {
      term *= ( x / (k + k - 1) );
      sum += term;
   }
   return 2.0 * xGaussian_Distribution_Tail(sqrtx) + Math.sqrt(twooverpi) * Math.exp(-x/2.0)*sum;
}

function Sum_Poisson_Terms(x, n) {
   var k;
   var term;
   var sum;
	
   term = 1.0;
   sum = 1.0;
   // console.log('sum');
   for ( k = 1; k < n; k++) {
      term *= (x / k);
      sum += term;
   }
   // console.log('res',Math.exp(-x)*sum);
   return Math.exp(-x)*sum;
};



function xGaussian_Distribution_Tail( x ){
    // console.log('xga')
   var sqrt2 = 0.70710678;
   return  0.5 * erfc(sqrt2 * x );
}


function erfc(x){

	z = Math.abs(x);
	t = 1.0 / (0.5 * z + 1.0);
	a1 = t * 0.17087277 + -0.82215223;
	a2 = t * a1 + 1.48851587;
	a3 = t * a2 + -1.13520398;
	a4 = t * a3 + 0.27886807;
	a5 = t * a4 + -0.18628806;
	a6 = t * a5 + 0.09678418;
	a7 = t * a6 + 0.37409196;
	a8 = t * a7 + 1.00002368;
	a9 = t * a8;
	a10 = -z * z - 1.26551223 + a9;
	a = t * Math.exp(a10);

	if (x < 0.0) {

		a = 2.0 - a;
	}

	return a;

}

function erf(x) {
    // constants
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;

    // Save the sign of x
    var sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);

    return sign*y;
}