export default class BetterEthersError{ 


    static  getLink(errorMsg) {
        const regex = /See:.* ]/
        let linkStr = regex.exec(errorMsg)
       
        if(linkStr!== null){
            return linkStr[0].slice(4,-1);
        }
        else{
            return null;
        }
        
    }
  
    static decodeErrorObj(dataArr,codeArr,messageArr){
        if(typeof(dataArr.data)==='object'){
            this.decodeErrorObj(dataArr.data,codeArr,messageArr)
        }
        if(typeof(dataArr.code) !== "undefined"){
            codeArr.push(dataArr.code)
        }
        if(typeof(dataArr.message) !== "undefined"){
            messageArr.push(dataArr.message)
        }
        
    }
  
  
    static printSubError(obj,index){
        if(typeof(obj)==="string"){
            return `${index.toUpperCase()}: ${obj}\n`;
        }
        if(typeof(obj)==="object"){
            let returnMsg = `${index.toUpperCase()}\n`;
  
            if(index==='error'){
                let codeArr = []
                let messageArr = []
  
                this.decodeErrorObj(obj,codeArr,messageArr);
  
                if(codeArr.length || messageArr.length){
                    returnMsg += "\n\tStack Details:\n"
                    returnMsg += "\tCode - Message\n"
                    for(let i=0; i<messageArr.length;i++){
                        returnMsg += `\t\t${codeArr[i] || "Null"} - ${messageArr[i]}\n`
                    }
                }
            }else{
                for (const [key, value] of Object.entries(obj)) {
                    if(typeof(value)!=='function' && typeof(value)!=='object'){
                        returnMsg += `\t${key}: ${value}\n`;
                    }                    
                  }
            }            
            
            returnMsg +='\n'
            return returnMsg;
            
        }
    }
  
    static makeError(error){
  
        let output = "Ethers JS Error\n\n";
  
        const keys = Object.keys(error)
  
        keys.forEach(index => {
            output += this.printSubError(error[index],index);
        });
  
  
        output +=`\nLink: ${this.getLink(error)}`
  
  
        console.error(output);
    }

    static setup(){
        if (typeof window !== 'undefined') {
            window.addEventListener('unhandledrejection', (event) => {
                BetterEthersError.makeError(event.reason);
                event.preventDefault();
            });
        } 
    }
  }