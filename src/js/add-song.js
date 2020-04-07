{
    let view = {
        el: '#song-info-container',
        template:` <div class="song-info-area ">
        <form class="song-info-form">
            <div class="row"><label for="songName">歌名</label><input type="text" name="songName" id="songName">
            </div>
            <div class="row"><label for="singer">歌手</label><input type="text" name="singer" id="singer">
            </div>
            <div class="row"><label for="collection">专辑</label><input type="text" name="collection" id="collection">
            </div>
            <div class="row"><label for="collection">外链</label><input type="text" name="collection" id="collection" placeholder="请上传文件" readonly="readonly">
            </div>
            <div><input class='btn-save' type="button" id="saveSong" value="保存"></div>
        </form>
    </div>
    `,
    render(data) {
      $(this.el).html(this.template);
    }
    }
    let model = {}
    let controller={
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
        }
    }
    controller.init(view, model)
}