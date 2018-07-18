var FileLoader = function ( editor ) {
    
    this.FLOWFILENAME  = 'flows.csv';
    this.EDGEFILENAME = 'networks.csv';
    this.NODEFILENAME = 'nodes.csv'; 
    this.TRIPFILENAME = 'trips.csv';
    this.ROOTTHREE = 1.7321;
    this.ROOTSIX = 2.4495;
    var scope = this;
    var signals = this.signals = editor.signals;
    this.editor = editor;
    var reader = this.reader = new FileReader();


    signals.fileLoaded.add(function( file, type ){
        if(type == "") scope.loadFile( file ); 
        else scope.loadDataString( file,type ); 
    });

};


FileLoader.prototype = {

    // load a zip folder
    loadFile: function( file ){
        var scope = this;
        scope.reader.addEventListener( 'load', function ( event ) {	
            var contents = event.target.result;
            console.log(JSON.stringify(contents));
            if(file.name.match(/\.fasta/)){
                scope.dataPreprocessFasta(contents);
                scope.signals.dataPrepared.dispatch();
            }
            else if(file.name.match(/\.nex/)){
                scope.dataPreprocessNex(contents);
                scope.signals.dataPrepared.dispatch();
            }
            else if(file.name.match(/\.phy/)){
                scope.dataPreprocessPhy(contents);
                scope.signals.dataPrepared.dispatch();
            }
            
        }, false );
        
        scope.reader.readAsBinaryString( file );
    },

    loadDataString:function(contents,type){
        
        if(type=='fasta'){
            this.dataPreprocessFasta(contents);
            this.signals.dataPrepared.dispatch();
        }
        else if(type=='nex'){
            this.dataPreprocessNex(contents);
            this.signals.dataPrepared.dispatch();
        }
        else if(type=='phy'){
            this.dataPreprocessPhy(contents);
            this.signals.dataPrepared.dispatch();
        }
    },
    
    dataPreprocessFasta : function( data ){
        var words = data.split(/>/);
        var input = {
            single:{},
            first:{},
            second:{},
            third:{},

            rawData:{},
            singleSeq:{},
            firstSeq:{},
            secondSeq:{},
            thirdSeq:{}
        };
        
        for(var i=0;i<words.length;i++){
            if(words[i]=="") continue;
            var firstOccur = words[i].indexOf('\n');
            
            var seqName = words[i].substring(0, firstOccur + 1);
            var seq = words[i].substring( firstOccur+1, words[i].length);
            seqName = seqName.replace(/\s/g,"");
            seq = seq.replace(/\s/g,"");
            // console.log(seq)
            // console.log(JSON.stringify(seq));
            currFreqs = this.getFrequency(seq);
            // storeData(input, currFreqs);
        
            input.single[seqName] = currFreqs[0];
            input.first[seqName] = currFreqs[1];
            input.second[seqName] = currFreqs[2];
            input.third[seqName] = currFreqs[3];

            input.rawData[seqName] = seq;
            input.singleSeq[seqName] = currFreqs[4];
            input.firstSeq[seqName] = currFreqs[5];
            input.secondSeq[seqName] = currFreqs[6];
            input.thirdSeq[seqName] = currFreqs[7];
        }
    
        this.editor.inputData = input;
        // this.signals.dataPrepared.dispatch();
        
    },
    
    dataPreprocessPhy : function(data){
        var words = data.split(/\n/);
        var input = {
            single:{},
            first:{},
            second:{},
            third:{},

            rawData:{},
            singleSeq:{},
            firstSeq:{},
            secondSeq:{},
            thirdSeq:{}
        };
        var seqName="";
        var seq="";
        for(var i=1; i< words.length;i++){
          var line = words[i].replace(/\r/g,"").split(/ /);
          if(line.length>1){
              if(seqName!=""){
                var currFreqs = this.getFrequency(seq);
                input.single[seqName] = currFreqs[0];
                input.first[seqName] = currFreqs[1];
                input.second[seqName] = currFreqs[2];
                input.third[seqName] = currFreqs[3];
    
                input.rawData[seqName] = seq;
                input.singleSeq[seqName] = currFreqs[4];
                input.firstSeq[seqName] = currFreqs[5];
                input.secondSeq[seqName] = currFreqs[6];
                input.thirdSeq[seqName] = currFreqs[7];
              }
              seqName = line[0];
              seq = "";
              for(var j =1;j<line.length;j++){
                  if(line[j]!=""){
                      seq += line[j];
                  }
              }
          }
          else{
              seq += line;
          }
                
        }
        this.editor.inputData = input;
        // this.signals.dataPrepared.dispatch();
        
    },
    
    dataPreprocessNex : function(data){
        var words = data.split(/MATRIX/);
        var result = words[1].split(/\n/);
        var input = {
            single:{},
            first:{},
            second:{},
            third:{},

            rawData:{},
            singleSeq:{},
            firstSeq:{},
            secondSeq:{},
            thirdSeq:{}
        };
        var seq="";
        var seqName ="";
        for(var i=0; i< result.length;i++){
            result[i] = result[i].replace(/\r/,"");
            result[i] = result[i].replace(/\t/,"");
            if(result[i]!=""&&result[i]!=';'&&result[i]!="END;"){
                var line = result[i].split(/ /);
                seqName = line[0];
                for(var j=1;j<line.length;j++){
                    if(line[j]!="") seq +=line[j];
                }
                var currFreqs = this.getFrequency(seq);
                input.single[seqName] = currFreqs[0];
                input.first[seqName] = currFreqs[1];
                input.second[seqName] = currFreqs[2];
                input.third[seqName] = currFreqs[3];
    
                input.rawData[seqName] = seq;
                input.singleSeq[seqName] = currFreqs[4];
                input.firstSeq[seqName] = currFreqs[5];
                input.secondSeq[seqName] = currFreqs[6];
                input.thirdSeq[seqName] = currFreqs[7];
                seq="";
            }
        }
        
        this.editor.inputData = input;
        // this.signals.dataPrepared.dispatch();
    },

    getFrequency : function( data ) {
        //orginal
        var fre={};
        fre['A']=0;
        fre['C']=0;
        fre['G']=0;
        fre['T']=0;
        freSeq = '';
        
        //first position
        var fir ={};
        fir['A'] = 0;
        fir['C'] = 0;
        fir['G'] = 0;
        fir['T'] = 0;
        firstSeq = '';
        //second position
        var sec ={};
        sec['A'] = 0;
        sec['C'] = 0;
        sec['G'] = 0;
        sec['T'] = 0;
        secondSeq = '';
        //third position
        var thir ={};
        thir['A'] = 0;
        thir['C'] = 0;
        thir['G'] = 0;
        thir['T'] = 0;
        thirdSeq = '';

        var firstLen = 0;
        var secondLen = 0;
        var thirdLen = 0;
        var weight; 
        for(var i=0;i<data.length;i++){
            currCode = data[i];
            if (/^[A-Z]$/i.test(currCode)==false) continue;
           
            if(currCode =='A' || currCode=='G' || currCode == 'C'|| currCode == 'T'){
                
                fre[currCode]++;
                freSeq += currCode;
                if(i%3==0){
                    firstLen += 1; 
                    fir[currCode]++;
                    firstSeq += currCode;
                }
                else if(i%3==1){
                    secondLen += 1; 
                    sec[currCode]++;
                    secondSeq += currCode;
                }
                else if(i%3==2){
                    thirdLen += 1; 
                    thir[currCode]++;
                    thirdSeq += currCode;
                }
                 
            }
            else {
                fre['A']+=0.25;
                fre['G']+=0.25;
                fre['C']+=0.25;
                fre['T']+=0.25;
                freSeq += currCode;
                if(i%3==0){
                    firstLen += 1; 
                    fir['A']+=0.25;
                    fir['G']+=0.25;
                    fir['C']+=0.25;
                    fir['T']+=0.25;
                    firstSeq += currCode;
                }
                else if(i%3==1){
                    secondLen += 1; 
                    sec['A']+=0.25;
                    sec['G']+=0.25;
                    sec['C']+=0.25;
                    sec['T']+=0.25;
                    secondSeq += currCode;
                }
                else if(i%3==2){
                    thirdLen += 1; 
                    thir['A']+=0.25;
                    thir['G']+=0.25;
                    thir['C']+=0.25;
                    thir['T']+=0.25;               
                    thirdSeq += currCode;
                }

             }

        }
        // console.log(data.length)
        var totalLen = firstLen+secondLen+thirdLen;
        fre['A'] /= totalLen;
        fre['C'] /= totalLen;
        fre['G'] /= totalLen;
        fre['T'] /= totalLen;


        fir['A'] /= firstLen;
        fir['C'] /= firstLen;
        fir['G'] /= firstLen;
        fir['T'] /= firstLen;

        sec['A'] /= secondLen;
        sec['C'] /= secondLen;
        sec['G'] /= secondLen;
        sec['T'] /= secondLen;

        thir['A'] /= thirdLen;
        thir['C'] /= thirdLen;
        thir['G'] /= thirdLen;
        thir['T'] /= thirdLen;
        // console.log([fre,fir,sec,thir])
        return [fre,fir,sec,thir,freSeq,firstSeq,secondSeq,thirdSeq];
    },
    


};


