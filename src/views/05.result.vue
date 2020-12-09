<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.q }}</h2>
      <span class="sub-title">找到{{ count }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item, index) in songList"
              :key="index"
              @dblclick="playMusic(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌名 -->
                    <span>{{ item.name }}</span>
                    <!-- mv图标 -->
                    <span class="iconfont icon-mv" v-if="item.mvid != 0" @click="toMV(item.mvid)"></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div
            class="item"
            v-for="(item, index) in playlists"
            :key="index"
            @click="toPlaylist(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mv" :key="index" @click="toMV(item.id)">
            <div class="img-wrap">
              <!-- 封面 -->
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <!-- 播放次数 -->
                <div class="num">{{ item.playCount }}</div>
              </div>
              <!-- 持续时间 -->
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <!-- mv名 -->
              <div class="name">{{ item.name }}</div>
              <!-- 歌手名 -->
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
//导入 axios
import axios from "axios";

export default {
  name: "result",
  data() {
    return {
      //tab切换时 会改变的数据
      activeIndex: "songs",
      // 保存查询歌曲
      songList: [],
      //保存歌单的数组
      playlists: [],
      // 搜索结果总数
      count: 0,
      //保存mv字段
      mv: [],

      searchName: this.$route.query.q,
    };
  },
  //侦听器
  watch: {
    // songList() {
    //   this.search();
    // },
    $route() {
      // console.log(this.$route.query.q);
      this.search();
    },
    searchName() {
      // console.log(this.searchName);
    },
    activeIndex() {
      //songs 歌曲
      // lists 歌单
      // mv   mv
      // console.log(this.activeIndex);
      let type = 1;
      //获取个数
      let limit = 10;

      switch (this.activeIndex) {
        case "songs":
          type = 1;
          limit = 15;
          break;
        case "lists":
          type = 1000;
          limit = 15;
          break;
        case "mv":
          type = 1004;
          limit = 8;
          break;

        default:
          break;
      }
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          keywords: this.$route.query.q,
          type,
          // 获取的数据量
          limit,
        },
      }).then((res) => {
        // console.log(res)
        // 获取歌曲
        if (type == 1) {
          //歌曲的逻辑
          this.songList = res.data.result.songs;
          // console.log(this.songList)
          for (let i = 0; i < this.songList.length; i++) {
            let min = parseInt(this.songList[i].duration / 1000 / 60);
            if (min < 10) {
              min = "0" + min;
            }
            let sec = parseInt((this.songList[i].duration / 1000) % 60);
            if (sec < 10) {
              sec = "0" + sec;
            }
            // console.log(min + ":" + sec);
            this.songList[i].duration = min + ":" + sec;
          }
          // 保存总数
          this.count = res.data.result.songCount;
        }
        // 获取歌单
        else if (type == 1000) {
          console.log("1000");
          //歌单的逻辑
          this.playlists = res.data.result.playlists;
          //总数
          this.count = res.data.result.playlistCount;
          console.log(this.count);
          //处理播放次数
          for (let i = 0; i < this.playlists.length; i++) {
            if (this.playlists[i].playCount > 100000) {
              this.playlists[i].playCount =
                parseInt(this.playlists[i].playCount / 10000) + "万";
            }
          }
        }
        //获取mv
        else {
          //保存mv数据
          // console.log(limit);
          this.mv = res.data.result.mvs;
          //保存总数
          this.count = res.data.result.mvCount;
          //处理数据
          for (let i = 0; i < this.mv.length; i++) {
            // 时间
            let min = parseInt(this.mv[i].duration / 1000 / 60);
            let sec = parseInt((this.mv[i].duration / 1000) % 60);
            if (min < 10) {
              min = "0" + min;
            }
            if (sec < 10) {
              sec = "0" + sec;
            }
            this.mv[i].duration = min + ":" + sec;
            //播放次数
            if (this.mv[i].playCount > 100000) {
              this.mv[i].playCount =
                parseInt(this.mv[i].playCount / 10000) + "万";
            }
          }
        }
      });
    },
  },

  //生命周期钩子  回调函数
  created() {
    this.search();
  },
  methods: {
    //去mv页面
    toMV(id){
      this.$router.push(`/mv?q=${id}`)

    },
    // 去歌单详情页
    toPlaylist(id){
      // 跳转并携带数据即可
      // console.log(id)
      this.$router.push('/playlist?q='+id)

    },
    playMusic(id) {
      // console.log(id)
      axios({
        url: "https://autumnfish.cn/song/url",
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
    search() {
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          keywords: this.$route.query.q,
          type: "1",
          // 获取的数据量
          limit: 15,
        },
      }).then((res) => {
        // console.log(res)
        this.songList = res.data.result.songs;
        // console.log(this.songList)
        for (let i = 0; i < this.songList.length; i++) {
          let min = parseInt(this.songList[i].duration / 1000 / 60);
          if (min < 10) {
            min = "0" + min;
          }
          let sec = parseInt((this.songList[i].duration / 1000) % 60);
          if (sec < 10) {
            sec = "0" + sec;
          }
          // console.log(min + ":" + sec);
          this.songList[i].duration = min + ":" + sec;
        }
        // 保存总数
        this.count = res.data.result.songCount;
      });
    },
  },
};
</script>

<style >
</style>
