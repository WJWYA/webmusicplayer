<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 名字 -->
        <p class="title">{{ playlist.name }}</p>
        <!-- 头像 -->
        <div class="author-wrap">
          <img class="avatar" :src="avatarUrl" alt="" />
          <span class="name">{{ nickname }}</span>
          <span class="time">{{ createTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <!-- 分类标签 -->
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item, index) in playlist.tracks"
              :key="index"
              
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span class="iconfont icon-mv" v-if="item.mv != 0" @click="toMV(item.mv)"></span>
                  </div>
                  <span>{{ item.al.name }}</span>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ playlist.name }}</td>
              <td>{{ item.dt }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论（'+(hotCount+total)+'）'" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{hotCount}})</span></p>
          <div class="comments-wrap">
            <!-- 评论 -->
            <div class="item" v-for="(item,index) in hotComment" :key="index">
              <div class="icon-wrap">
                <!-- 头像 -->
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <!-- 昵称 -->
                  <span class="name">{{ item.user.nickname}}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <!-- 评论的回复 -->
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{ item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date" >{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{ total }})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in comments" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0" >
                  <span class="name">{{ item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{ item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{ item.time}}</div>
              </div>
            </div>
           
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="10"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  name: "playlist",
  data() {
    return {
      // 封面图片
      avatarUrl:"",
      // 封面昵称
      nickname:"",
      // 封面创建时间
      createTime:"",
      activeIndex: "1",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      playlist: {},
      // 热门评论
      hotComment: [],
      // 热门评论个数
      hotCount:0,
      // 普通评论
      comments:[]

    };
  },
  created() {
    // 获取歌单详情
    axios({
      url: "/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      // console.log(res)
      this.playlist = res.data.playlist;
      this.avatarUrl = res.data.playlist.creator.avatarUrl
      this.nickname = res.data.playlist.creator.nickname
      this.createTime = res.data.playlist.createTime
      // console.log(this.playlist);
      for (let i = 0; i < this.playlist.tracks.length; i++) {
        let min = parseInt(this.playlist.tracks[i].dt / 1000 / 60);
        let sec = parseInt((this.playlist.tracks[i].dt / 1000) % 60);
        if (min < 10) {
          min = "0" + min;
        }
        if (sec < 10) {
          sec = "0" + sec;
        }
        // console.log(min + ":" + sec);
        this.playlist.tracks[i].dt = min + ":" + sec;
      }
      let time = new Date(this.createTime);
          let y = time.getFullYear();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          let h = time.getHours();
          let mm = time.getMinutes();
          let s = time.getSeconds();
          this.createTime =
            y +
            "-" +
            this.add0(m) +
            "-" +
            this.add0(d) +
            " " +
            this.add0(h) +
            ":" +
            this.add0(mm) +
            ":" +
            this.add0(s);
    });
    // 获取评论
    axios({
      url:"/comment/hot",
      method:"get",
      params:{
        id:this.$route.query.q,
        // 传递类型
        type:2 //歌单
      }
    }).then(res=>{
      // console.log(res.data.hotComments)
      this.hotComment = res.data.hotComments
      for (let i = 0; i < res.data.hotComments.length; i++) {
        res.data.hotComments[i].time=(new Date(parseInt(res.data.hotComments[i].time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")); 
        
      }
      // 保存个数
      this.hotCount = res.data.total
    })
    // 获取最新评论
    axios({
      url:"/comment/playlist",
      method:"get",
      params:{
        id:this.$route.query.q,
        // 传递类型
        limit: 10,
        offset: 0
      }
    }).then(res=>{
      // console.log(res)
      //总个数
      this.total = res.data.total
      //评论数据
      this.comments = res.data.comments

      for (let i = 0; i < res.data.comments.length; i++) {
        res.data.comments[i].time=(new Date(parseInt(res.data.comments[i].time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")); 
        
      }
    })

  },
  methods: {
     add0(m) {
      return m < 10 ? "0" + m : m;
    },

     //去mv页面
    toMV(id){
      this.$router.push(`/mv?q=${id}`)
      this.$parent.musicUrl = "";

    },
    playMusic(id) {
      // console.log(id)
      axios({
        url: "/song/url",
        method: "get",
        params: {
          id, // id:id
        },
      }).then((res) => {
        // console.log(res)
        let url = res.data.data[0].url;
        // console.log(this.$parent.musicUrl)
        // 设置给父组件的 播放地址
        this.$parent.musicUrl = url;
      });
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //保存页码
      this.page = val
      //重新获取数据
      axios({
      url:"/comment/playlist",
      method:"get",
      params:{
        id:this.$route.query.q,
        // 传递类型
        limit: 10,
        offset: (this.page-1)*10
      }
    }).then(res=>{
      // console.log(res)
      //总个数
      this.total = res.data.total
      //评论数据
      this.comments = res.data.comments

      for (let i = 0; i < this.comments.length; i++) {
        this.comments[i].time=(new Date(parseInt(this.comments[i].time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")); 
        
      }
      
    })

    },
  },
};
</script>

<style >
</style>
