{
  let view ={
    el:'#tabs',
    init(){
      this.$el = $(this.el)
    }
  }

  let model ={

  }
  let controller ={
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click','.tabs-title li',(e)=>{
        let $li = $(e.currentTarget)
        let pageName = $li.attr('data-tab-name')
        $li.addClass('active')
        .siblings().removeClass('active');
        // 使用evenHub与各个模块通信
        window.eventHub.emit('selectTab',pageName)
  
      })
    }

  }
  controller.init(view,model)
}