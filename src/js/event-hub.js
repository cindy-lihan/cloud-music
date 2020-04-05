window.event = {
    events:{},
    emit(eventName, data){  //发布
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]  
                fnList.map((fn) => {
                    fn.call(undefined, data)
                })   
            }
        }
    },
    on(eventName, fn){ //订阅
       
        if(this.events[key] === undefined){
            this.events[key] = []
        }
        this.events[key].push(fn)
    },
    off(){

    }
}