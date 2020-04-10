{
    let { Query, User } = AV;
    let APP_ID = 'KCMzVQVudzfkO9bvGIERzbnX-MdYXbMMI'
    let APP_KEY = 'J4WMrLv6Dk61RV3MCm53Ikk8'
    let SERVER_URL = 'https://us.leancloud.cn'
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY,
        serverURLs: SERVER_URL,
    })

    // var TestObject = AV.Object.extend("Song");
    // var testObject = new TestObject();
    // testObject.set("name", "神仙音乐-一秒心动的宝藏女生");
    // testObject.set("creator", "樱桃味音乐");
    // testObject.set("creatorId", "樱桃味音乐");
    // testObject.set("describe", "让人心动的音乐（女生集）持续更新");
    // testObject.set("songs", ["1", "2", "3"]);
    // testObject.set("img", "none");
    // testObject.save().then(
    //   testObject => {
    //     alert("保存成功");
    //   },
    //   () => {
    //     alert("保存失败");
    //   }
    // );
}


