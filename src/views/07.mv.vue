<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls autoplay :src="url"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <!-- 头像 -->
            <img :src="icon" alt="" />
          </div>
          <!-- 歌手名 -->
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <!-- 标题 -->
          <h2 class="title">{{ mvInfo.name }}</h2>
          <!-- 发布时间 -->
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <!-- 播放次数 -->
          <span class="number">播放：{{ mvInfo.playCount }}次</span>
          <!-- 描述 -->
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">
          精彩评论<span class="number">({{ hctotal }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name"
                  >{{ item.beReplied[0].user.nickname }}：</span
                >
                <span class="comment">{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name"
                  >{{ item.beReplied[0].user.nickname }}：</span
                >
                <span class="comment">{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
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
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div
            class="item"
            v-for="(item, index) in simiMvs"
            :key="index"
            @click="toMV(item.id)"
          >
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//导入axios
import axios from "axios";
export default {
  name: "mv",
  data() {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      //mv地址
      url: "",
      //相关mv
      simiMvs: [],
      //mv的信息
      mvInfo: {},
      //头像
      icon: "",
      //评论
      comments: [],
      //热门评论
      hotComments: [],
      //热门评论数量
      hctotal: 0,
    };
  },
  created() {
    // 获取mv播放地址
    this.toMvUrl();

    //获取相关mv
    this.tosimiMvs();
    // 获取mv信息
    this.getMvDetails();
    // 获取评论数据
    this.getComments();
  },

  watch: {
    // 监听路由参数是否发生变化，这里监听的是mvid
    $route() {
      // console.log(this.$route.query.q);
      this.toMvUrl();
      this.getMvDetails();
      this.getComments();
    },
  },
  methods: {
    // 获取mv播放地址
    toMvUrl() {
      axios({
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          id: this.$route.query.q,
        },
      }).then((res) => {
        // console.log(res)
        this.url = res.data.data.url;
      });
    },
    //相关mv
    tosimiMvs() {
      axios({
        url: "https://autumnfish.cn/simi/mv",
        method: "get",
        params: {
          mvid: this.$route.query.q,
        },
      }).then((res) => {
        // console.log(res);
        // this.url = res.data.data.url
        this.simiMvs = res.data.mvs;
        for (let i = 0; i < this.simiMvs.length; i++) {
          let min = parseInt(this.simiMvs[i].duration / 1000 / 60);
          let sec = parseInt((this.simiMvs[i].duration / 1000) % 60);
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          this.simiMvs[i].duration = min + ":" + sec;
        }
        for (let i = 0; i < this.simiMvs.length; i++) {
          if (this.simiMvs[i].playCount > 100000) {
            this.simiMvs[i].playCount =
              parseInt(this.simiMvs[i].playCount / 10000) + "万";
          }
        }
      });
    },
    // 获取mv信息
    getMvDetails() {
      axios({
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: this.$route.query.q,
        },
      }).then((res) => {
        // console.log(res)
        // mv的信息
        this.mvInfo = res.data.data;
        // 获取歌手信息
        axios({
          url: "https://autumnfish.cn/artists",
          method: "get",
          params: {
            id: this.mvInfo.artists[0].id,
          },
        }).then((res) => {
          // console.log(res)
          //歌手的封面
          this.icon = res.data.artist.picUrl;
        });
      });
    },
    // 获取评论数据
    getComments() {
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * this.limit,
        },
      }).then((res) => {
        console.log(res);
        this.total = res.data.total;
        this.comments = res.data.comments;
        this.hotComments = res.data.hotComments;
        this.hctotal = this.hotComments.length;
        console.log(this.hctotal);
        console.log(this.comments);
        console.log(this.hotComments);
        //时间戳转化为时间
        for (let i = 0; i < this.hotComments.length; i++) {
          let time = new Date(this.hotComments[i].time);
          let y = time.getFullYear();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          let h = time.getHours();
          let mm = time.getMinutes();
          let s = time.getSeconds();
          this.hotComments[i].time =
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

          // console.log(this.hotComments[i].time);
        }
        //时间戳转化为时间
        for (let i = 0; i < this.comments.length; i++) {
          let time = new Date(this.comments[i].time);
          let y = time.getFullYear();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          let h = time.getHours();
          let mm = time.getMinutes();
          let s = time.getSeconds();
          this.comments[i].time =
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

          // console.log(this.hotComments[i].time);
        }
      });
    },
    // 获取评论数据
    getCommentsAgin() {
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        this.comments = res.data.comments;
        //时间戳转化为时间
        for (let i = 0; i < this.comments.length; i++) {
          let time = new Date(this.comments[i].time);
          let y = time.getFullYear();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          let h = time.getHours();
          let mm = time.getMinutes();
          let s = time.getSeconds();
          this.comments[i].time =
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

          // console.log(this.hotComments[i].time);
        }
      });
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },

    //去mv页面
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getCommentsAgin();
    },
  },
};
</script>

<style></style>
