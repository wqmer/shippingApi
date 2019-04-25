class Result {
    constructor() {
            this.hold = 0 ;
            this.in_transit = 0 ;
            this.out_of_delivery = 0;
            this.justCreated_or_noRecord = 0;
            this.delivery = 0 ;
            
    }
    update(code) { 
            switch (code) {
                case '0':
                  this.in_transit ++ ;
                  break;
                case '3':
                  this.delivery ++;
                  break;
                case '2':
                  this.hold ++;
                  break;
                case '5':
                  this.out_of_delivery ++;
                  break;
                default:
                  this.justCreated_or_noRecord ++;
                  break;
                  
            }
   }
}

 


module.exports = {Result}